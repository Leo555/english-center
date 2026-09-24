// 学习进度云同步：自动推送逻辑
// 仅当当前用户资料绑定了手机号时才会触发网络请求；未绑定手机号的用户完全不联网、不受影响。
import { useProgress } from '../store/useProgress'
import { useVideoProgress } from '../store/useVideoProgress'
import { useUsers } from '../store/useUsers'
import { pushCloudState, pushLeaderboardScore, type CloudProgressPayload, type CloudVideoPayload } from './cloudSync'

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

// 应用启动时调用一次即可：订阅进度/视频进度变化，防抖推送云端；
// 切后台/关闭页面前尽量把未同步的改动 flush 出去。
export function initAutoSync(): void {
  if (inited) return
  inited = true

  useProgress.subscribe(scheduleSync)
  useVideoProgress.subscribe(scheduleSync)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void syncNow()
  })
  window.addEventListener('beforeunload', () => {
    void syncNow()
  })
}
