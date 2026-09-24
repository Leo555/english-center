// 排行榜接口：按 手机号+昵称 维度记录总星数，用 Redis sorted set 存储
// GET    /api/leaderboard?limit=xxx                    -> 返回按分数从高到低的排行榜（手机号仅返回后 5 位）
// PUT    /api/leaderboard { phone, nickname, score }    -> 更新/写入某个孩子的分数
// DELETE /api/leaderboard?phone=xxx&nickname=yyy        -> 删除某个孩子的排行榜记录（配合删除孩子资料）
import { isRedisConfigured, zadd, zrem, zrevrangeWithScores } from './_lib/redis.js'
import {
  LEADERBOARD_KEY,
  leaderboardMember,
  normalizeNickname,
  normalizePhone,
  parseLeaderboardMember,
} from './_lib/validate.js'
import type { ApiRequest, ApiResponse } from './_lib/http.js'

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
  const limitRaw = req.query?.limit
  const limitNum = Number(Array.isArray(limitRaw) ? limitRaw[0] : limitRaw)
  const limit = Number.isFinite(limitNum) && limitNum > 0 ? Math.min(Math.floor(limitNum), 100) : 100

  const pairs = await zrevrangeWithScores(LEADERBOARD_KEY, 0, limit - 1)
  const entries = pairs.map(([member, score], index) => {
    const { phone, nickname } = parseLeaderboardMember(member)
    return {
      rank: index + 1,
      nickname,
      phoneTail: phone.slice(-5), // 只返回手机号后 5 位，不返回完整手机号
      score,
    }
  })
  res.status(200).json({ entries })
}

async function handlePut(req: ApiRequest, res: ApiResponse) {
  const body = (typeof req.body === 'string' ? safeJsonParse(req.body) : req.body) as Record<string, unknown> | null
  const phone = normalizePhone(body?.phone)
  const nickname = normalizeNickname(body?.nickname)
  const scoreRaw = body?.score
  const score = typeof scoreRaw === 'number' && Number.isFinite(scoreRaw) ? Math.max(0, Math.floor(scoreRaw)) : null
  if (!phone || !nickname || score === null) {
    res.status(400).json({ error: '参数不正确' })
    return
  }
  await zadd(LEADERBOARD_KEY, score, leaderboardMember(phone, nickname))
  res.status(200).json({ ok: true })
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
  await zrem(LEADERBOARD_KEY, leaderboardMember(phone, nickname))
  res.status(200).json({ ok: true })
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
