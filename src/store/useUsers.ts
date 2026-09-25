import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getCurrentUserId,
  hasStoredProgress,
  migrateLegacyProgressIfNeeded,
  PROGRESS_STORAGE_PREFIX,
  removeUserProgressStorage,
  seedUserStorage,
  setCurrentUserId,
  VIDEO_PROGRESS_STORAGE_PREFIX,
} from './userSession'
import { useProgress } from './useProgress'
import { useVideoProgress } from './useVideoProgress'
import type { CloudProfileRecord } from '../lib/cloudSync'

export interface UserProfile {
  id: string
  nickname: string // 孩子昵称（子用户）
  avatar: string // emoji 头像
  createdAt: number
  phone?: string // 所属家庭账号手机号；未绑定则该资料只存本地，不联网（仅遗留数据可能出现此状态）
}

interface UsersState {
  profiles: UserProfile[]
  currentUserId: string | null

  // actions
  // phone = 家庭账号手机号，创建孩子资料时必须归属到某个账号下
  createProfile: (nickname: string, avatar: string, phone: string) => string
  switchUser: (id: string) => void
  renameProfile: (id: string, nickname: string) => void
  updateAvatar: (id: string, avatar: string) => void
  removeProfile: (id: string) => void
  bindPhone: (id: string, phone: string) => void
  restoreFromCloud: (phone: string, nickname: string, record: CloudProfileRecord) => string

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
//
// 返回 Promise：rehydrate 是异步的，调用方（如 switchUser 补推同步）若需要在"进度已切换为
// 新用户"之后才读取 useProgress 状态，必须等这个 Promise resolve，否则会读到切换前的旧数据。
function reloadProgressForUser(userId: string | null): Promise<void> {
  if (!userId) return Promise.resolve()
  if (hasStoredProgress(userId)) {
    return useProgress.persist.rehydrate() ?? Promise.resolve()
  }
  useProgress.getState().resetProgress()
  return Promise.resolve()
}

export const useUsers = create<UsersState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentUserId: getCurrentUserId(),

      createProfile: (nickname, avatar, phone) => {
        const id = genId()
        const isFirstEverProfile = get().profiles.length === 0
        const cleanPhone = phone.replace(/\D/g, '')
        const profile: UserProfile = {
          id,
          nickname: sanitizeNickname(nickname) || '小朋友',
          avatar: avatar || AVATAR_OPTIONS[0],
          createdAt: Date.now(),
          phone: cleanPhone.length >= 6 && cleanPhone.length <= 20 ? cleanPhone : undefined,
        }
        if (isFirstEverProfile) migrateLegacyProgressIfNeeded(id)
        setCurrentUserId(id)
        set((s) => ({ profiles: [...s.profiles, profile], currentUserId: id }))
        reloadProgressForUser(id)
        if (profile.phone) {
          void import('../lib/autoSync').then((m) => m.syncNow())
        }
        return id
      },

      switchUser: (id) => {
        if (id === get().currentUserId) return
        if (!get().profiles.some((p) => p.id === id)) return
        setCurrentUserId(id)
        set({ currentUserId: id })
        // 切换到的孩子如果最近没有产生新进度变化，不会触发 autoSync 的 subscribe 回调，
        // 存量星数就可能一直没推送到云端排行榜。这里等进度 rehydrate 完成后补一次同步，
        // 确保读到的是新用户的进度而不是切换前残留的旧数据。
        void reloadProgressForUser(id).then(() => import('../lib/autoSync')).then((m) => m.syncNow())
      },

      renameProfile: (id, nickname) => {
        const clean = sanitizeNickname(nickname)
        if (!clean) return
        const target = get().profiles.find((p) => p.id === id)
        const oldNickname = target?.nickname
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, nickname: clean } : p)),
        }))
        if (get().currentUserId === id) {
          void import('../lib/autoSync').then((m) => m.syncNow())
        }
        // 昵称是云端存档/排行榜的 key 之一，改名相当于"换了一个 key"：
        // 若不清理旧昵称对应的云端记录，排行榜/存档列表会同时残留新旧两条数据。
        if (target?.phone && oldNickname && oldNickname !== clean) {
          void import('../lib/cloudSync').then((m) => {
            m.deleteCloudProfile(target.phone!, oldNickname).catch(() => {})
            m.deleteLeaderboardEntry(target.phone!, oldNickname).catch(() => {})
          })
        }
      },

      updateAvatar: (id, avatar) => {
        if (!avatar) return
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === id ? { ...p, avatar } : p)),
        }))
        if (get().currentUserId === id) {
          void import('../lib/autoSync').then((m) => m.syncNow())
        }
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

      // 给某个本地资料绑定所属家庭账号手机号：之后进度/视频进度变化会自动 debounce 推送到该手机号下（以昵称为字段）。
      // 立即触发一次推送，让这个手机号下马上能查到这份资料（换设备时才不会显示"暂无云端存档"）。
      // 目前仅用于 LegacyPhoneMigrationGate 补录存量老资料；新建资料已在 createProfile 时直接写入 phone。
      bindPhone: (id, phone) => {
        const clean = phone.replace(/\D/g, '')
        if (clean.length < 6 || clean.length > 20) return
        set((s) => ({ profiles: s.profiles.map((p) => (p.id === id ? { ...p, phone: clean } : p)) }))
        if (get().currentUserId === id) {
          void import('../lib/autoSync').then((m) => m.syncNow())
        }
      },

      // 换设备后用手机号找回进度：若本机已存在同手机号+同昵称的资料则直接复用，否则新建一份本地资料，
      // 并把云端存档写入对应的 localStorage 位置，再触发 rehydrate 让 useProgress/useVideoProgress 生效。
      restoreFromCloud: (phone, nickname, record) => {
        const existing = get().profiles.find((p) => p.phone === phone && p.nickname === nickname)
        const id = existing?.id ?? genId()

        seedUserStorage(
          PROGRESS_STORAGE_PREFIX,
          id,
          record.progress ?? { unlockedUnits: {}, unitProgress: {}, wrongBook: {} },
        )
        seedUserStorage(VIDEO_PROGRESS_STORAGE_PREFIX, id, record.video ?? { watchedVideos: {} })

        setCurrentUserId(id)
        set((s) => ({
          profiles: existing
            ? s.profiles.map((p) => (p.id === id ? { ...p, avatar: record.avatar || p.avatar } : p))
            : [
                ...s.profiles,
                { id, nickname, avatar: record.avatar || AVATAR_OPTIONS[0], createdAt: Date.now(), phone },
              ],
          currentUserId: id,
        }))

        void useProgress.persist.rehydrate()
        void useVideoProgress.persist.rehydrate()
        return id
      },

      getCurrentProfile: () => {
        const { profiles, currentUserId } = get()
        return profiles.find((p) => p.id === currentUserId) ?? null
      },
    }),
    { name: 'powerup-kids-users' },
  ),
)
