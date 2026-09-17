import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { getCurrentUserId } from './userSession'

// 视频学习进度：记录每个用户已看完的视频 id，按当前登录用户分别存取（与 useProgress 一致的隔离方式）
const perUserStorage: StateStorage = {
  getItem: (name) => {
    const uid = getCurrentUserId()
    if (!uid) return null
    return localStorage.getItem(`${name}:${uid}`)
  },
  setItem: (name, value) => {
    const uid = getCurrentUserId()
    if (!uid) return
    localStorage.setItem(`${name}:${uid}`, value)
  },
  removeItem: (name) => {
    const uid = getCurrentUserId()
    if (!uid) return
    localStorage.removeItem(`${name}:${uid}`)
  },
}

interface VideoProgressState {
  watchedVideos: Record<string, boolean>
  markWatched: (videoId: string) => void
  isWatched: (videoId: string) => boolean
  getWatchedCount: (videoIds: string[]) => number
}

export const useVideoProgress = create<VideoProgressState>()(
  persist(
    (set, get) => ({
      watchedVideos: {},
      markWatched: (videoId) => set((s) => ({ watchedVideos: { ...s.watchedVideos, [videoId]: true } })),
      isWatched: (videoId) => !!get().watchedVideos[videoId],
      getWatchedCount: (videoIds) => videoIds.filter((id) => get().watchedVideos[id]).length,
    }),
    { name: 'powerup-kids-video-progress', storage: createJSONStorage(() => perUserStorage) },
  ),
)
