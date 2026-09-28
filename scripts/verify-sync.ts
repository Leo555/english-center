// 本地验证：用内存版假 Upstash 驱动真实的 api/progress.ts 与 api/leaderboard.ts 处理逻辑，
// 复现并验证"排行榜分数与首页总星数对不上"的修复：
//   - 排行榜分数现在由 /api/progress 写入后的真实进度总星数推导（普通 ZADD，必要时回落）
//   - 不再由前端单独推送，避免两条通道各自推送导致排行榜卡在旧的高分
//
// 关键场景（对应优优的真实问题：排行榜显示 351，页面刷新后仍是 186）：
//   B. 排行榜被孤立地推到 351，但云端进度实际只有 186 → 进度补推后排行榜应回落到 186
//   C. 领先设备推了 351，落后设备只推了 186 → 合并后排行榜应保持 351（不会被错误拉低）
import { createServer } from 'node:http'

const PORT = 8799
const store = {
  hash: {} as Record<string, Record<string, string>>,
  zset: {} as Record<string, Record<string, number>>,
  counters: {} as Record<string, number>,
}

function exec(args: (string | number)[]): { result: unknown; error?: string } {
  const [cmd, ...rest] = args
  switch (cmd) {
    case 'HSET': {
      const [key, field, value] = rest as [string, string, string]
      ;(store.hash[key] ??= {})[field] = value
      return { result: 1 }
    }
    case 'HGET': {
      const [key, field] = rest as [string, string]
      return { result: store.hash[key]?.[field] ?? null }
    }
    case 'HGETALL': {
      const [key] = rest as [string]
      const h = store.hash[key] ?? {}
      const arr: string[] = []
      for (const [f, v] of Object.entries(h)) arr.push(f, v)
      return { result: arr }
    }
    case 'HDEL': {
      const [key, field] = rest as [string, string]
      const h = store.hash[key]
      if (h && field in h) {
        delete h[field]
        return { result: 1 }
      }
      return { result: 0 }
    }
    case 'ZADD': {
      // 支持 ["ZADD", key, "GT", score, member] 与普通 ["ZADD", key, score, member] 两种
      const [key, a, b, c] = rest as [string, string, string, string]
      let score: number, member: string
      if (a === 'GT') {
        score = Number(b)
        member = c
      } else {
        score = Number(a)
        member = b
      }
      const z = (store.zset[key] ??= {})
      const prev = z[member]
      if (a === 'GT' && prev !== undefined && prev >= score) return { result: 0 }
      z[member] = score
      return { result: 1 }
    }
    case 'ZREM': {
      const [key, member] = rest as [string, string]
      const z = store.zset[key] ?? {}
      if (member in z) {
        delete z[member]
        return { result: 1 }
      }
      return { result: 0 }
    }
    case 'ZREVRANGE': {
      const [key, start, stop] = rest as [string, string, string]
      const z = store.zset[key] ?? {}
      const entries = Object.entries(z).sort((x, y) => y[1] - x[1])
      const slice = entries.slice(Number(start), Number(stop) + 1)
      const arr: string[] = []
      for (const [m, s] of slice) arr.push(m, String(s))
      return { result: arr }
    }
    case 'INCR': {
      const [key] = rest as [string]
      store.counters[key] = (store.counters[key] ?? 0) + 1
      return { result: store.counters[key] }
    }
    case 'EXPIRE':
      return { result: 1 }
    default:
      return { result: null }
  }
}

const server = createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    try {
      const args = body ? JSON.parse(body) : []
      const out = exec(args)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(out))
    } catch (e) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: String(e) }))
    }
  })
})

process.env.KV_REST_API_URL = `http://127.0.0.1:${PORT}`
process.env.KV_REST_API_TOKEN = 'test'

// 动态导入真实 handler（env 已设置，redis.ts 在调用时才读 env）
const { default: progressHandler } = await import('../api/progress.ts')
const { default: leaderboardHandler } = await import('../api/leaderboard.ts')

function makeRes() {
  return {
    statusCode: 200,
    body: null as unknown,
    status(this: { statusCode: number }, c: number) {
      this.statusCode = c
      return this
    },
    json(this: { body: unknown }, b: unknown) {
      this.body = b
      return this
    },
    setHeader() {
      return this
    },
  }
}

async function putProgress(body: Record<string, unknown>) {
  const res = makeRes()
  await progressHandler({ method: 'PUT', body, headers: {}, query: {} } as any, res as any)
  return res
}
async function putLeaderboard(body: Record<string, unknown>) {
  const res = makeRes()
  await leaderboardHandler({ method: 'PUT', body, headers: {}, query: {} } as any, res as any)
  return res
}
async function getLeaderboard() {
  const res = makeRes()
  await leaderboardHandler({ method: 'GET', query: { limit: '100' }, headers: {}, body: null } as any, res as any)
  return (res.body as { entries: Array<{ nickname: string; score: number; phoneTail: string }> }).entries
}
function scoreOf(entries: Array<{ nickname: string; score: number }>, nickname: string) {
  return entries.find((e) => e.nickname === nickname)?.score
}

// 构造一份总星数为 total 的进度（用单个单元的一个玩法承载，便于断言）
function progressWithStars(total: number) {
  return { unitProgress: { u1: { learned: true, stars: { x: total } } }, unlockedUnits: {}, wrongBook: {} }
}

let passed = 0
let failed = 0
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    passed++
    console.log(`  ✅ ${name}`)
  } else {
    failed++
    console.log(`  ❌ ${name}`, extra ?? '')
  }
}

await new Promise<void>((r) => server.listen(PORT, () => r()))

console.log('\n=== A. 首次写进度，排行榜应等于进度总星数 ===')
await putProgress({ phone: '13800001111', nickname: 'A童', avatar: '🦁', progress: progressWithStars(186) })
check('排行榜 A童 = 186', scoreOf(await getLeaderboard(), 'A童') === 186)

console.log('\n=== B. 排行榜被孤立推高到 351，但云端进度实际只有 186（优优的真实问题）===')
await putLeaderboard({ phone: '13900002222', nickname: '优优', score: 351 }) // 模拟孤立的旧高分
check('孤立推送后排行榜 优优 = 351', scoreOf(await getLeaderboard(), '优优') === 351)
await putProgress({ phone: '13900002222', nickname: '优优', avatar: '🦁', progress: progressWithStars(186) }) // 用户刷新补推真实进度
check('进度补推后排行榜回落到 186（修复核心）', scoreOf(await getLeaderboard(), '优优') === 186)

console.log('\n=== C. 领先设备 351，落后设备只推 186 → 合并后应保持 351，不应被错误拉低 ===')
await putProgress({ phone: '13700003333', nickname: 'C童', avatar: '🦁', progress: progressWithStars(351) })
check('领先设备写入后排行榜 C童 = 351', scoreOf(await getLeaderboard(), 'C童') === 351)
await putProgress({ phone: '13700003333', nickname: 'C童', avatar: '🦁', progress: { unitProgress: { u1: { learned: true, stars: { x: 186 } } }, unlockedUnits: {}, wrongBook: {} } })
check('落后设备补推后排行榜仍 = 351（merge 取最大，不回落）', scoreOf(await getLeaderboard(), 'C童') === 351)

console.log('\n=== D. 删除云端存档应同步移除排行榜记录 ===')
await putProgress({ phone: '13600004444', nickname: 'D童', avatar: '🦁', progress: progressWithStars(100) })
check('写入后排行榜 D童 = 100', scoreOf(await getLeaderboard(), 'D童') === 100)
const delRes = makeRes()
await progressHandler({ method: 'DELETE', query: { phone: '13600004444', nickname: 'D童' }, headers: {}, body: null } as any, delRes as any)
check('删除接口返回 200', delRes.statusCode === 200)
check('删除后排行榜无 D童 记录', scoreOf(await getLeaderboard(), 'D童') === undefined)

server.close()
console.log(`\n=== 结果: ${passed} 通过, ${failed} 失败 ===`)
process.exit(failed === 0 ? 0 : 1)
