// 学习进度云同步：前端调用封装（对应 api/progress.ts）
import type { UnitProgress, WrongItem } from '../types'

export interface CloudProgressPayload {
  unlockedUnits: Record<string, boolean>
  unitProgress: Record<string, UnitProgress>
  wrongBook: Record<string, WrongItem>
}

export interface CloudVideoPayload {
  watchedVideos: Record<string, boolean>
}

export interface CloudProfileRecord {
  avatar: string
  updatedAt: number
  progress: CloudProgressPayload
  video: CloudVideoPayload
}

export async function fetchCloudProfiles(phone: string): Promise<Record<string, CloudProfileRecord>> {
  const res = await fetch(`/api/progress?phone=${encodeURIComponent(phone)}`)
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || '查询失败，请检查网络')
  return (data?.profiles ?? {}) as Record<string, CloudProfileRecord>
}

export async function pushCloudState(
  phone: string,
  nickname: string,
  avatar: string,
  progress: CloudProgressPayload,
  video: CloudVideoPayload,
): Promise<void> {
  const res = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, nickname, avatar, progress, video }),
    keepalive: true,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || '同步失败')
  }
}

export async function deleteCloudProfile(phone: string, nickname: string): Promise<void> {
  const res = await fetch(
    `/api/progress?phone=${encodeURIComponent(phone)}&nickname=${encodeURIComponent(nickname)}`,
    { method: 'DELETE' },
  )
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || '删除失败')
  }
}

// 排行榜：按 手机号+昵称 记录总星数（对应 api/leaderboard.ts）
export interface LeaderboardEntry {
  rank: number
  nickname: string
  phoneTail: string // 手机号后 5 位（服务端已裁剪，不含完整手机号）
  score: number
}

export async function fetchLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  const res = await fetch(`/api/leaderboard?limit=${limit}`)
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || '查询排行榜失败')
  return (data?.entries ?? []) as LeaderboardEntry[]
}

export async function pushLeaderboardScore(phone: string, nickname: string, score: number): Promise<void> {
  const res = await fetch('/api/leaderboard', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, nickname, score }),
    keepalive: true,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || '排行榜同步失败')
  }
}

export async function deleteLeaderboardEntry(phone: string, nickname: string): Promise<void> {
  const res = await fetch(
    `/api/leaderboard?phone=${encodeURIComponent(phone)}&nickname=${encodeURIComponent(nickname)}`,
    { method: 'DELETE' },
  )
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error || '删除排行榜记录失败')
  }
}
