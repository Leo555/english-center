// 学习进度云同步接口
// GET    /api/progress?phone=xxx        -> 返回该手机号下所有昵称的存档（供换设备后选择昵称找回进度）
// PUT    /api/progress { phone, nickname, avatar, progress, video } -> 写入/覆盖该昵称的存档
// DELETE /api/progress?phone=xxx&nickname=yyy -> 删除该手机号下指定昵称的云端存档
import { hdel, hget, hgetall, hset, incrWithExpire, isRedisConfigured, zadd, zrem } from './_lib/redis.js'
import { LEADERBOARD_KEY, leaderboardMember, normalizeNickname, normalizePhone, syncKey } from './_lib/validate.js'
import type { ApiRequest, ApiResponse } from './_lib/http.js'

interface CloudRecord {
  avatar: string
  updatedAt: number
  progress: unknown
  video: unknown
}

type Json = Record<string, unknown>

function asObject(value: unknown): Json {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Json) : {}
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

// 学习进度合并：同一孩子的存档在多台设备间可能"各自领先一部分"，云端存储应当保留
// 各设备已知的最好成绩，因此写入时必须与已有记录合并而不是整体覆盖：
// - unitProgress：每个单元的每种玩法取"较大星数"，learned 取并集
// - wrongBook：同一单词保留"更难掌握"的那份（wrongCount 更大）
// - unlockedUnits：取并集
// 这样某台进度落后的设备（长时间没打开 / 隐私窗口 / 换设备）打开后把旧数据推上来时，
// 也不会把云端已经更高的进度覆盖回退，造成其它设备/排行榜显示的进度"对不上"。
function mergeProgress(prev: unknown, next: unknown): Json {
  const a = asObject(prev)
  const b = asObject(next)

  const aUnits = asObject(a.unitProgress)
  const bUnits = asObject(b.unitProgress)
  const unitProgress: Json = { ...aUnits }
  for (const [unitId, bUnitRaw] of Object.entries(bUnits)) {
    if (!(unitId in aUnits)) {
      unitProgress[unitId] = bUnitRaw
      continue
    }
    const aUnit = asObject(aUnits[unitId])
    const bUnit = asObject(bUnitRaw)
    const aStars = asObject(aUnit.stars)
    const stars: Json = { ...aStars }
    for (const [gameType, star] of Object.entries(asObject(bUnit.stars))) {
      stars[gameType] = Math.max(asNumber(stars[gameType]), asNumber(star))
    }
    unitProgress[unitId] = { learned: Boolean(aUnit.learned) || Boolean(bUnit.learned), stars }
  }

  const aWrong = asObject(a.wrongBook)
  const wrongBook: Json = { ...aWrong }
  for (const [wordId, bItemRaw] of Object.entries(asObject(b.wrongBook))) {
    const aItem = aWrong[wordId]
    if (!aItem) {
      wrongBook[wordId] = bItemRaw
    } else {
      const keepExisting = asNumber(asObject(aItem).wrongCount) >= asNumber(asObject(bItemRaw).wrongCount)
      wrongBook[wordId] = keepExisting ? aItem : bItemRaw
    }
  }

  return {
    unlockedUnits: { ...asObject(a.unlockedUnits), ...asObject(b.unlockedUnits) },
    unitProgress,
    wrongBook,
  }
}

function mergeVideo(prev: unknown, next: unknown): Json {
  return {
    watchedVideos: { ...asObject(asObject(prev).watchedVideos), ...asObject(asObject(next).watchedVideos) },
  }
}

// 从一份进度存档里算出"总星数"（与前端 useProgress.getTotalStars() 口径一致：
// 遍历每个单元的每种玩法星数求和）。排行榜分数必须由它推导，才能与首页"总星数"永远一致。
function totalStarsOf(progress: unknown): number {
  const units = asObject(asObject(progress).unitProgress)
  let sum = 0
  for (const unit of Object.values(units)) {
    const stars = asObject(asObject(unit).stars)
    for (const s of Object.values(stars)) sum += asNumber(s)
  }
  return sum
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!isRedisConfigured()) {
    res.status(503).json({ error: '云同步暂未配置，请在 Vercel 项目中接入 Redis 后重试' })
    return
  }

  try {
    if (req.method === 'GET') {
      await handleGet(req, res)
    } else if (req.method === 'PUT') {
      await handlePut(req, res)
    } else if (req.method === 'DELETE') {
      await handleDelete(req, res)
    } else {
      res.setHeader('Allow', 'GET, PUT, DELETE')
      res.status(405).json({ error: 'Method Not Allowed' })
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : '服务器错误' })
  }
}

async function handleGet(req: ApiRequest, res: ApiResponse) {
  // 简单限流：同一 IP 10 分钟内最多查询 30 次，降低手机号被暴力枚举遍历的风险
  const ip = getClientIp(req)
  const attempts = await incrWithExpire(`powerup:ratelimit:${ip}`, 600)
  if (attempts > 30) {
    res.status(429).json({ error: '请求过于频繁，请稍后再试' })
    return
  }

  const phoneRaw = req.query?.phone
  const phone = normalizePhone(Array.isArray(phoneRaw) ? phoneRaw[0] : phoneRaw)
  if (!phone) {
    res.status(400).json({ error: '手机号格式不正确' })
    return
  }

  const raw = await hgetall(syncKey(phone))
  const profiles: Record<string, CloudRecord> = {}
  for (const [nickname, value] of Object.entries(raw)) {
    const parsed = safeJsonParse(value)
    if (parsed) profiles[nickname] = parsed as CloudRecord
  }
  res.status(200).json({ profiles })
}

async function handlePut(req: ApiRequest, res: ApiResponse) {
  const body = (typeof req.body === 'string' ? safeJsonParse(req.body) : req.body) as Record<string, unknown> | null
  const phone = normalizePhone(body?.phone)
  const nickname = normalizeNickname(body?.nickname)
  if (!phone || !nickname) {
    res.status(400).json({ error: '手机号或昵称格式不正确' })
    return
  }
  const key = syncKey(phone)
  const incoming: CloudRecord = {
    avatar: typeof body?.avatar === 'string' ? body.avatar.slice(0, 8) : '🦁',
    updatedAt: Date.now(),
    progress: body?.progress ?? {},
    video: body?.video ?? {},
  }

  // 云端存档只增不减：读取已有记录，与本次提交按"取最好成绩"的方式合并后再写入，
  // 避免某台进度落后的设备打开后把云端已有的更高进度覆盖回退（详见 mergeProgress 注释）。
  const existingRaw = await hget(key, nickname)
  const existing = existingRaw ? (safeJsonParse(existingRaw) as CloudRecord | null) : null
  const record: CloudRecord = existing
    ? {
        avatar: incoming.avatar,
        updatedAt: incoming.updatedAt,
        progress: mergeProgress(existing.progress, incoming.progress),
        video: mergeVideo(existing.video, incoming.video),
      }
    : incoming

  await hset(key, nickname, JSON.stringify(record))
  // 排行榜分数必须以"合并后的云端进度总星数"为准，否则会与首页"总星数"对不上：
  // 进度推送与排行榜推送是两条独立通道（见 autoSync.ts），若进度推送失败/静默而排行榜推送成功，
  // 或某台设备重置过进度，排行榜会卡在一个比真实进度更高的旧值，而 GT 选项又无法让它回落。
  // 这里在进度写入后直接用真实总星数 ZADD，保证排行榜与首页永远一致（必要时允许回落）。
  try {
    await zadd(LEADERBOARD_KEY, totalStarsOf(record.progress), leaderboardMember(phone, nickname))
  } catch {
    // 排行榜更新失败不影响进度本身的保存
  }
  res.status(200).json({ ok: true, updatedAt: record.updatedAt })
}

async function handleDelete(req: ApiRequest, res: ApiResponse) {
  const phoneRaw = req.query?.phone
  const nicknameRaw = req.query?.nickname
  const phone = normalizePhone(Array.isArray(phoneRaw) ? phoneRaw[0] : phoneRaw)
  const nickname = normalizeNickname(Array.isArray(nicknameRaw) ? nicknameRaw[0] : nicknameRaw)
  if (!phone || !nickname) {
    res.status(400).json({ error: '手机号或昵称格式不正确' })
    return
  }
  await hdel(syncKey(phone), nickname)
  // 删除云端存档时同步移除排行榜记录，保持两端一致
  try {
    await zrem(LEADERBOARD_KEY, leaderboardMember(phone, nickname))
  } catch {
    // 排行榜清理失败不影响存档删除本身
  }
  res.status(200).json({ ok: true })
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function getClientIp(req: ApiRequest): string {
  const forwarded = req.headers?.['x-forwarded-for']
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded
  if (typeof value === 'string' && value.length > 0) return value.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}
