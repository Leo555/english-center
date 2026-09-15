import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getCurrentUserId,
  hasStoredProgress,
  migrateLegacyProgressIfNeeded,
  removeUserProgressStorage,
  setCurrentUserId,
} from './userSession'
import { useProgress } from './useProgress'

export interface UserProfile {
  id: string
  nickname: string
  avatar: string // emoji 头像
  createdAt: number
}

interface UsersState {
  profiles: UserProfile[]
  currentUserId: string | null

  // actions
  createProfile: (nickname: string, avatar: string) => string
  switchUser: (id: string) => void
  renameProfile: (id: string, nickname: string) => void
  removeProfile: (id: string) => void

  // selectors
  getCurrentProfile: () => UserProfile | null
}

export const AVATAR_OPTIONS = ['🦁', '🐯', '🐻', '🐼', '🐰', '🦊', '🐸', '🐵', '🐶', '🐱', '🦄', '🐨']

function genId(): string {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function sanitizeNickname(nickname: string): string {
  return nickname.trim().slice(0, 12)
}

// 切换/新建/删除用户后，需要让进度 store 重新从"当前用户"对应的存储位置加载数据，
// 否则内存中仍是上一个用户的进度（storage 的 key 虽已变化，但内存 state 不会自动刷新）。
//
// 注意：必须先判断该用户是否已有存档，再决定 reset 还是 rehydrate ——
// 如果对已有存档的用户直接 resetProgress()，会把内存中的空状态写回其存档（因为
// getCurrentUserId() 此时已指向该用户），导致其历史进度被空数据覆盖丢失。
function reloadProgressForUser(userId: string | null) {
  if (!userId) return
  if (hasStoredProgress(userId)) {
    void useProgress.persist.rehydrate()
  } else {
    useProgress.getState().resetProgress()
  }
}

export const useUsers = create<UsersState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentUserId: getCurrentUserId(),

      createProfile: (nickname, avatar) => {
        const id = genId()
        const isFirstEverProfile = get().profiles.length === 0
        const profile: UserProfile = {
          id,
          nickname: sanitizeNickname(nickname) || '小朋友',
          avatar: avatar || AVATAR_OPTIONS[0],
          createdAt: Date.now(),
        }
        if (isFirstEverProfile) migrateLegacyProgressIfNeeded(id)
        setCurrentUserId(id)
        set((s) => ({ profiles: [...s.profiles, profile], currentUserId: id }))
        reloadProgressForUser(id)
        return id
      },

      switchUser: (id) => {
        if (id === get().currentUserId) return
        if (!get().profiles.some((p) => p.id === id)) return
        setCurrentUserId(id)
        set({ currentUserId: id })
        reloadProgressForUser(id)
      },

      renameProfile: (id, nickname) => {
        const clean = sanitizeNickname(nickname)
        if (!clean) return
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, nickname: clean } : p)),
        }))
      },

      removeProfile: (id) => {
        removeUserProgressStorage(id)
        let nextCurrentUserId: string | null = null
        set((s) => {
          const profiles = s.profiles.filter((p) => p.id !== id)
          let currentUserId = s.currentUserId
          if (currentUserId === id) {
            currentUserId = profiles[0]?.id ?? null
            setCurrentUserId(currentUserId)
          }
          nextCurrentUserId = currentUserId
          return { profiles, currentUserId }
        })
        reloadProgressForUser(nextCurrentUserId)
      },

      getCurrentProfile: () => {
        const { profiles, currentUserId } = get()
        return profiles.find((p) => p.id === currentUserId) ?? null
      },
    }),
    { name: 'powerup-kids-users' },
  ),
)
