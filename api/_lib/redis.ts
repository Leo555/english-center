// Upstash Redis REST 客户端（零依赖，直接用 fetch 调用 REST API，不引入 @upstash/redis 包）
//
// 环境变量二选一即可（均由 Vercel 在接入 Redis 后自动注入，不写入代码/仓库，符合 Secrets 环境变量管理原则）：
// - Vercel Marketplace 原生集成：KV_REST_API_URL + KV_REST_API_TOKEN
// - Upstash 官方集成：        UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

function getCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

export function isRedisConfigured(): boolean {
  return getCredentials() !== null
}

// Upstash REST API：POST 到根地址，body 为命令数组，如 ["HSET", key, field, value]
async function redisCommand<T = unknown>(args: (string | number)[]): Promise<T> {
  const creds = getCredentials()
  if (!creds) {
    throw new Error('云同步未配置：请在 Vercel 项目中接入 Upstash Redis（Storage → Marketplace → Redis）')
  }
  const res = await fetch(creds.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${creds.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (!res.ok) {
    throw new Error(`Redis 请求失败: HTTP ${res.status}`)
  }
  const data = (await res.json()) as { result: T; error?: string }
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function hgetall(key: string): Promise<Record<string, string>> {
  const result = await redisCommand<string[]>(['HGETALL', key])
  const obj: Record<string, string> = {}
  for (let i = 0; i < result.length; i += 2) obj[result[i]] = result[i + 1]
  return obj
}

export async function hset(key: string, field: string, value: string): Promise<void> {
  await redisCommand(['HSET', key, field, value])
}

export async function hdel(key: string, field: string): Promise<void> {
  await redisCommand(['HDEL', key, field])
}

// 排行榜分数只应单向递增：同一个孩子可能在多台设备上玩（如爸爸手机 + 平板），
// 每台设备打开 App 时都会无条件补推一次"本地"总星数（见 autoSync.ts 的启动补推逻辑）。
// 如果某台设备很久没打开、本地进度落后于云端最新进度，用普通 ZADD 会用旧的低分覆盖掉
// 排行榜上已经更高的分数，导致排行榜显示的分数比孩子实际进度（本地进度条）更低、对不上。
// 加 GT 选项后，只有新分数比已存储分数更高时才会更新；新成员（首次上榜）不受影响，仍会正常写入。
export async function zaddGT(key: string, score: number, member: string): Promise<void> {
  await redisCommand(['ZADD', key, 'GT', score, member])
}

export async function zrem(key: string, member: string): Promise<void> {
  await redisCommand(['ZREM', key, member])
}

// 从高到低取排名区间 [start, stop]（0-based），返回 [成员, 分数] 列表
export async function zrevrangeWithScores(key: string, start: number, stop: number): Promise<Array<[string, number]>> {
  const result = await redisCommand<string[]>(['ZREVRANGE', key, start, stop, 'WITHSCORES'])
  const pairs: Array<[string, number]> = []
  for (let i = 0; i < result.length; i += 2) pairs.push([result[i], Number(result[i + 1])])
  return pairs
}

// 简单限流：INCR 计数 + 首次命中时设置过期时间，用于防止手机号被暴力枚举遍历
export async function incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
  const count = await redisCommand<number>(['INCR', key])
  if (count === 1) await redisCommand(['EXPIRE', key, ttlSeconds])
  return count
}
