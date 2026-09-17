import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { GameType, UnitProgress, WrongItem } from '../types'
import { getAllUnits, findUnit } from '../data/levels'
import { advanceOnCorrect, createWrongItem, isDue, reduceOnWrong } from '../utils/srs'
import { getCurrentUserId } from './userSession'

// 按"当前登录用户"分别存取进度数据，实现多用户本地数据隔离。
// name 由 persist 中间件传入（即下方配置的 'powerup-kids-progress'），
// 实际写入 localStorage 的 key 会拼接当前用户 id，如 powerup-kids-progress:u_xxx。
// 尚未选择/创建用户时（currentUserId 为空）不读写，避免污染全局存储。
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

interface ProgressState {
  unlockedUnits: Record<string, boolean>
  unitProgress: Record<string, UnitProgress>
  wrongBook: Record<string, WrongItem>

  // actions
  markLearned: (unitId: string) => void
  setGameStars: (unitId: string, gameType: GameType, stars: number) => void
  recordAnswer: (wordId: string, levelId: string, unitId: string, correct: boolean) => void
  resetProgress: () => void

  // selectors
  isUnitUnlocked: (unitId: string) => boolean
  isUnitCleared: (unitId: string) => boolean
  getUnitStars: (unitId: string) => number // 0-9 (3 games * 3 stars)
  getTotalStars: () => number
  getDueReviewItems: (limit?: number) => WrongItem[]
  getDueReviewCount: () => number
}

const FIRST_UNIT_ID = 'L1-U1'

// 注意：unlockedUnits 必须每次都从 unitProgress 完整重新推导，不能在已有解锁状态基础上做累加。
// 历史教训：早期 L3-L6 是空占位单元（words.length === 0）时，跨级解锁条件的 every() 对空数组恒为 true，
// 曾经导致"做完 L1 第一关就连锁解锁 L4/L5/L6"的 bug。虽然该 bug 已通过 hasPlayableUnit 判断修复，
// 但如果这里继续 `{...unlocked, ...}` 累加式合并旧状态，那些已经被"污染"过、错误写入 localStorage
// 的解锁记录会永久保留、无法被后续修复自动纠正（因为从不会被"收回"）。
// 因此改为纯函数式：只依据当前真实的 unitProgress 从零推导一遍完整的解锁表，
// 这样即使之前的本地存储里有历史遗留的错误解锁，也会在下一次调用时被自动纠正。
function recomputeUnlocks(progress: Record<string, UnitProgress>): Record<string, boolean> {
  const next: Record<string, boolean> = { [FIRST_UNIT_ID]: true }
  const allUnits = getAllUnits()

  const cleared = (unitId: string) => {
    const u = findUnit(unitId)
    if (!u || u.words.length === 0) return false
    const p = progress[unitId]
    if (!p?.learned) return false
    const total = Object.values(p.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0)
    return total >= 3 // 三种玩法平均至少 1 星即视为通关
  }

  // 同级内：前一单元通关 -> 解锁下一单元
  for (let i = 0; i < allUnits.length - 1; i++) {
    const cur = allUnits[i]
    const nxt = allUnits[i + 1]
    if (cur.levelId === nxt.levelId && cleared(cur.id)) {
      next[nxt.id] = true
    }
  }

  // 跨级：某级全部单元通关 -> 解锁下一级第一单元
  const byLevel: Record<string, typeof allUnits> = {}
  for (const u of allUnits) {
    byLevel[u.levelId] = byLevel[u.levelId] || []
    byLevel[u.levelId].push(u)
  }
  const levelIds = Object.keys(byLevel)
  for (let i = 0; i < levelIds.length - 1; i++) {
    const curUnits = byLevel[levelIds[i]]
    // 纯占位级别（如 L3-L6 暂未填充词库，全部单元 words.length === 0）不能被当作"已通关"，
    // 否则 every() 对空数组条件恒为 true，会在玩家还没真正完成前置级别时，
    // 就连锁解锁后续所有占位级别（如做完 L1 第一关就直接解锁了 L4/L5/L6）。
    // 必须要求该级别至少有 1 个真实可玩单元，且全部可玩单元都已通关，才算真正通关。
    const hasPlayableUnit = curUnits.some((u) => u.words.length > 0)
    const allClear = hasPlayableUnit && curUnits.every((u) => (u.words.length === 0 ? true : cleared(u.id)))
    if (allClear) {
      const nextLevelFirst = byLevel[levelIds[i + 1]][0]
      if (nextLevelFirst) next[nextLevelFirst.id] = true
    }
  }

  return next
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      unlockedUnits: { [FIRST_UNIT_ID]: true },
      unitProgress: {},
      wrongBook: {},

      markLearned: (unitId) => {
        set((s) => {
          const unitProgress = {
            ...s.unitProgress,
            [unitId]: { learned: true, stars: s.unitProgress[unitId]?.stars ?? {} },
          }
          return { unitProgress, unlockedUnits: recomputeUnlocks(unitProgress) }
        })
      },

      setGameStars: (unitId, gameType, stars) => {
        set((s) => {
          const prev = s.unitProgress[unitId] ?? { learned: true, stars: {} }
          const bestStars = Math.max(prev.stars[gameType] ?? 0, stars)
          const unitProgress = {
            ...s.unitProgress,
            [unitId]: { learned: true, stars: { ...prev.stars, [gameType]: bestStars } },
          }
          return { unitProgress, unlockedUnits: recomputeUnlocks(unitProgress) }
        })
      },

      recordAnswer: (wordId, levelId, unitId, correct) => {
        set((s) => {
          const existing = s.wrongBook[wordId]
          const wrongBook = { ...s.wrongBook }
          if (!correct) {
            wrongBook[wordId] = existing ? reduceOnWrong(existing) : createWrongItem(wordId, levelId, unitId)
          } else if (existing) {
            const advanced = advanceOnCorrect(existing)
            if (advanced) {
              wrongBook[wordId] = advanced
            } else {
              delete wrongBook[wordId] // 已掌握，移出错题本
            }
          }
          return { wrongBook }
        })
      },

      resetProgress: () => set({ unlockedUnits: { [FIRST_UNIT_ID]: true }, unitProgress: {}, wrongBook: {} }),

      // dev 模式下（npm run dev）默认解锁全部单元，方便开发/测试时任意访问；生产构建不受影响
      isUnitUnlocked: (unitId) => import.meta.env.DEV || !!get().unlockedUnits[unitId],

      isUnitCleared: (unitId) => {
        const p = get().unitProgress[unitId]
        if (!p?.learned) return false
        const total = Object.values(p.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0)
        return total >= 3
      },

      getUnitStars: (unitId) => {
        const p = get().unitProgress[unitId]
        if (!p) return 0
        return Object.values(p.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0)
      },

      getTotalStars: () => {
        const progress = get().unitProgress
        return Object.values(progress).reduce(
          (sum, p) => sum + Object.values(p.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0),
          0,
        )
      },

      getDueReviewItems: (limit = 12) => {
        const items = Object.values(get().wrongBook).filter((it) => isDue(it))
        items.sort((a, b) => b.wrongCount - a.wrongCount || a.nextReview - b.nextReview)
        return items.slice(0, limit)
      },

      getDueReviewCount: () => Object.values(get().wrongBook).filter((it) => isDue(it)).length,
    }),
    {
      name: 'powerup-kids-progress',
      storage: createJSONStorage(() => perUserStorage),
      // 应用启动、从 localStorage 恢复数据后立即按当前真实进度重新推导一次解锁表，
      // 修复历史遗留（如旧版 bug 期间被错误写入）的解锁状态，无需用户手动重置进度。
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.unlockedUnits = recomputeUnlocks(state.unitProgress)
        }
      },
    },
  ),
)
