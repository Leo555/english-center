// 手机号仅作格式校验、用作同步分组标识，没有接入短信服务做真实性验证；
// 因此云同步的安全边界等价于"知道手机号即可读写该手机号下的存档"，
// 类似家庭内部共享账号场景，不适合、也不会用于存放除学习进度以外的敏感数据。

export function normalizePhone(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const digits = input.replace(/\D/g, '')
  if (digits.length < 6 || digits.length > 20) return null
  return digits
}

export function normalizeNickname(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const trimmed = input.trim().slice(0, 12)
  if (!trimmed) return null
  return trimmed
}

export function syncKey(phone: string): string {
  return `powerup:sync:${phone}`
}

// 排行榜使用 sorted set 存储，member 格式为 `${phone}:${nickname}`。
// phone 经 normalizePhone 处理后只包含数字，因此按首个 ':' 拆分即可安全还原 phone/nickname，
// 不受 nickname 中可能出现的 ':' 字符影响。
export const LEADERBOARD_KEY = 'powerup:leaderboard'

export function leaderboardMember(phone: string, nickname: string): string {
  return `${phone}:${nickname}`
}

export function parseLeaderboardMember(member: string): { phone: string; nickname: string } {
  const sep = member.indexOf(':')
  if (sep < 0) return { phone: '', nickname: member }
  return { phone: member.slice(0, sep), nickname: member.slice(sep + 1) }
}
