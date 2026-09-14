import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameType, UnitProgress, WrongItem } from '../types'
import { getAllUnits, findUnit } from '../data/levels'
import { advanceOnCorrect, createWrongItem, isDue, reduceOnWrong } from '../utils/srs'

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

function recomputeUnlocks(
  unlocked: Record<string, boolean>,
  progress: Record<string, UnitProgress>,
): Record<string, boolean> {
  const next: Record<string, boolean> = { ...unlocked, [FIRST_UNIT_ID]: true }
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
    const allClear = curUnits.every((u) => (u.words.length === 0 ? true : cleared(u.id)))
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
          return { unitProgress, unlockedUnits: recomputeUnlocks(s.unlockedUnits, unitProgress) }
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
          return { unitProgress, unlockedUnits: recomputeUnlocks(s.unlockedUnits, unitProgress) }
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
    { name: 'powerup-kids-progress' },
  ),
)
