// 当前登录用户 id 的轻量存取工具
// 独立于 zustand persist（同步读写 localStorage），确保其它 store 在初始化时
// 就能同步拿到"当前用户是谁"，不受 zustand persist 异步 rehydrate 时序影响。

const CURRENT_USER_KEY = 'powerup-kids-current-user'

export function getCurrentUserId(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_KEY)
  } catch {
    return null
  }
}

export function setCurrentUserId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_USER_KEY, id)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch {
    // 忽略隐私模式等 localStorage 不可用场景
  }
}

// 每个用户的游戏进度会按此前缀 + 用户 id 分别存放，互不影响
export const PROGRESS_STORAGE_PREFIX = 'powerup-kids-progress'

export function removeUserProgressStorage(userId: string): void {
  try {
    localStorage.removeItem(`${PROGRESS_STORAGE_PREFIX}:${userId}`)
  } catch {
    // ignore
  }
}

export function hasStoredProgress(userId: string): boolean {
  try {
    return localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}:${userId}`) != null
  } catch {
    return false
  }
}

// 兼容旧版本（无多用户功能前）遗留的全局进度数据：
// 第一次创建账号时，把这份"匿名"进度迁移给新建的第一个用户，避免历史数据丢失。
export function migrateLegacyProgressIfNeeded(userId: string): void {
  try {
    const legacy = localStorage.getItem(PROGRESS_STORAGE_PREFIX)
    if (!legacy) return
    localStorage.setItem(`${PROGRESS_STORAGE_PREFIX}:${userId}`, legacy)
    localStorage.removeItem(PROGRESS_STORAGE_PREFIX)
  } catch {
    // ignore
  }
}

// 视频学习进度的存储前缀，与 useVideoProgress.ts 内部 perUserStorage 拼接 key 的方式保持一致
export const VIDEO_PROGRESS_STORAGE_PREFIX = 'powerup-kids-video-progress'

// 直接向某个用户的持久化存储写入初始状态（用于云端找回进度场景：
// 先把云端数据写入 localStorage，再触发对应 zustand store 的 rehydrate 读取生效）。
// 写入格式需与 zustand persist 默认的 storage 结构 `{ state, version }` 保持一致。
export function seedUserStorage(storagePrefix: string, userId: string, state: unknown): void {
  try {
    localStorage.setItem(`${storagePrefix}:${userId}`, JSON.stringify({ state, version: 0 }))
  } catch {
    // 忽略隐私模式等 localStorage 不可用场景
  }
}
