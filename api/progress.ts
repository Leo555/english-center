// 学习进度云同步接口
// GET  /api/progress?phone=xxx        -> 返回该手机号下所有昵称的存档（供换设备后选择昵称找回进度）
// PUT  /api/progress { phone, nickname, avatar, progress, video } -> 写入/覆盖该昵称的存档
import { hgetall, hset, incrWithExpire, isRedisConfigured } from './_lib/redis.js'
import { normalizeNickname, normalizePhone, syncKey } from './_lib/validate.js'
import type { ApiRequest, ApiResponse } from './_lib/http.js'

interface CloudRecord {
  avatar: string
  updatedAt: number
  progress: unknown
  video: unknown
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
    } else {
      res.setHeader('Allow', 'GET, PUT')
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
  const record: CloudRecord = {
    avatar: typeof body?.avatar === 'string' ? body.avatar.slice(0, 8) : '🦁',
    updatedAt: Date.now(),
    progress: body?.progress ?? {},
    video: body?.video ?? {},
  }
  await hset(syncKey(phone), nickname, JSON.stringify(record))
  res.status(200).json({ ok: true, updatedAt: record.updatedAt })
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
