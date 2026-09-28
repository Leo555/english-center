// 学习进度云同步：自动推送逻辑
// 仅当当前用户资料绑定了手机号时才会触发网络请求；未绑定手机号的用户完全不联网、不受影响。
import { useProgress } from '../store/useProgress'
import { useVideoProgress } from '../store/useVideoProgress'
import { useUsers } from '../store/useUsers'
import {
  PROGRESS_STORAGE_PREFIX,
  readStoredState,
  seedUserStorage,
  VIDEO_PROGRESS_STORAGE_PREFIX,
} from '../store/userSession'
import {
  fetchCloudProfiles,
  pushCloudState,
  pushLeaderboardScore,
  type CloudProfileRecord,
  type CloudProgressPayload,
  type CloudVideoPayload,
} from './cloudSync'
import type { UnitProgress, WrongItem } from '../types'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function collectPayload(): { progress: CloudProgressPayload; video: CloudVideoPayload } {
  const { unlockedUnits, unitProgress, wrongBook } = useProgress.getState()
  const { watchedVideos } = useVideoProgress.getState()
  return {
    progress: { unlockedUnits, unitProgress, wrongBook },
    video: { watchedVideos },
  }
}

export async function syncNow(): Promise<void> {
  const profile = useUsers.getState().getCurrentProfile()
  if (!profile?.phone) return
  const { progress, video } = collectPayload()
  try {
    await pushCloudState(profile.phone, profile.nickname, profile.avatar, progress, video)
  } catch {
    // 网络异常时静默失败，等待下一次改动触发重试，不打断孩子的学习流程
  }
  try {
    await pushLeaderboardScore(profile.phone, profile.nickname, useProgress.getState().getTotalStars())
  } catch {
    // 排行榜同步失败不影响学习进度同步，静默失败等待下次重试
  }
}

function scheduleSync() {
  const profile = useUsers.getState().getCurrentProfile()
  if (!profile?.phone) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    void syncNow()
  }, 800)
}

let inited = false

// 把云端进度合并进本地：对每个单元的每个玩法取"本地/云端较大星数"，
// 错题本、已看视频取并集（错题保留更难掌握的那份）。这样既不丢失本地刚产生的进度，
// 也能把云端更高的进度拉下来，让"本机是落后设备"时首页进度立即对齐云端。
function mergeUnitProgress(
  local: Record<string, UnitProgress> | undefined,
  cloud: Record<string, UnitProgress> | undefined,
): Record<string, UnitProgress> {
  const result: Record<string, UnitProgress> = { ...(local ?? {}) }
  for (const [uid, cu] of Object.entries(cloud ?? {})) {
    const lu = result[uid]
    if (!lu) {
      result[uid] = cu
      continue
    }
    const stars: Record<string, number> = { ...(lu.stars ?? {}) }
    for (const [gt, cs] of Object.entries(cu?.stars ?? {})) {
      stars[gt] = Math.max(Number(stars[gt] ?? 0), Number(cs ?? 0))
    }
    result[uid] = { learned: !!(lu.learned || cu?.learned), stars }
  }
  return result
}

function mergeWrongBook(
  local: Record<string, WrongItem> | undefined,
  cloud: Record<string, WrongItem> | undefined,
): Record<string, WrongItem> {
  const result: Record<string, WrongItem> = { ...(local ?? {}) }
  for (const [wid, cw] of Object.entries(cloud ?? {})) {
    const lw = result[wid]
    if (!lw) {
      result[wid] = cw
    } else {
      // 保留"更难掌握"的那份：错误次数更多、或复习时间更早的
      result[wid] = lw.wrongCount >= cw.wrongCount ? lw : cw
    }
  }
  return result
}

// 每次进入页面，主动从云端拉取当前孩子的最新进度并合并到本地：
// 解决"本机是落后设备（长时间没打开 / 隐私窗口 / 刚换设备）时，本地进度低于云端、
// 首页进度条与排行榜/其他设备对不上"的问题。云端未配置或网络异常时静默忽略，本地不受影响。
export async function pullFromCloud(): Promise<void> {
  const profile = useUsers.getState().getCurrentProfile()
  if (!profile?.phone) return

  let record: CloudProfileRecord | undefined
  try {
    const profiles = await fetchCloudProfiles(profile.phone)
    record = profiles[profile.nickname]
  } catch {
    return
  }
  if (!record) return

  // 直接读本地持久化原始 JSON，避免依赖 zustand store 内存中进度加载的时序
  const localProgress = readStoredState<CloudProgressPayload>(PROGRESS_STORAGE_PREFIX, profile.id)
  const localVideo = readStoredState<CloudVideoPayload>(VIDEO_PROGRESS_STORAGE_PREFIX, profile.id)

  const mergedProgress: CloudProgressPayload = {
    // unlockedUnits 在 store rehydrate 时会按 unitProgress 重新推导，这里并集即可
    unlockedUnits: { ...(localProgress?.unlockedUnits ?? {}), ...(record.progress?.unlockedUnits ?? {}) },
    unitProgress: mergeUnitProgress(localProgress?.unitProgress, record.progress?.unitProgress),
    wrongBook: mergeWrongBook(localProgress?.wrongBook, record.progress?.wrongBook),
  }
  const mergedVideo: CloudVideoPayload = {
    watchedVideos: { ...(localVideo?.watchedVideos ?? {}), ...(record.video?.watchedVideos ?? {}) },
  }

  seedUserStorage(PROGRESS_STORAGE_PREFIX, profile.id, mergedProgress)
  seedUserStorage(VIDEO_PROGRESS_STORAGE_PREFIX, profile.id, mergedVideo)

  // 重新加载 store 内存，让首页/地图立即反映合并后的进度
  void useProgress.persist.rehydrate()
  void useVideoProgress.persist.rehydrate()
}

// 应用启动时调用一次即可：订阅进度/视频进度变化，防抖推送云端；
// 切后台/关闭页面前尽量把未同步的改动 flush 出去。
export function initAutoSync(): void {
  if (inited) return
  inited = true

  // 每次进入页面，先从云端拉取最新进度合并到本地，让落后的设备立即对齐云端；
  // 拉取合并完成后再把（可能更新后的）本地进度补推上云端/排行榜（zaddGT 保证只增不减）。
  void pullFromCloud().finally(() => {
    void syncNow()
  })

  useProgress.subscribe(scheduleSync)
  useVideoProgress.subscribe(scheduleSync)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void syncNow()
  })
  window.addEventListener('beforeunload', () => {
    void syncNow()
  })
}
