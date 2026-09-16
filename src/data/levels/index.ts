import type { LevelData, UnitData, WordItem } from '../../types'
import { L1_UNITS } from './l1'
import { L2_UNITS } from './l2'
import { L3_UNITS } from './l3'
import { L4_UNITS } from './l4'
import { L5_UNITS } from './l5'
import { L6_UNITS } from './l6'

// ============================================================
// Power Up 分级词汇/句型数据
// 对标：剑桥《Power Up》教材 1-6 级（CEFR Pre-A1 ~ B1，对应剑桥 YLE/KET/PET 考试体系）
// 说明：L1-L6 均已填充可直接游玩的词表；为降低小朋友学习难度，每个单元词量控制在 10-12 个左右
//       （L1 拆分为 27 个小单元约 300 词，L2 拆分为 24 个小单元约 288 词，L3-L6 各拆分为 9 个小单元约 100 词/级，均含例句）。
// 本文件为汇总入口，各级别数据已拆分至 l1.ts ~ l6.ts，共享工具函数见 words.ts。
// ============================================================

export const LEVELS: LevelData[] = [
  {
    id: 'L1', name: 'Power Up 1', ageRange: '6岁', cefr: 'Pre-A1',
    cambridge: 'YLE Starters', vocabTarget: 300, color: 'rose',
    gradient: 'from-rose-300 to-pink-400', units: L1_UNITS,
  },
  {
    id: 'L2', name: 'Power Up 2', ageRange: '6-7岁', cefr: 'A1',
    cambridge: 'YLE Movers', vocabTarget: 600, color: 'orange',
    gradient: 'from-orange-300 to-amber-400', units: L2_UNITS,
  },
  {
    id: 'L3', name: 'Power Up 3', ageRange: '7岁', cefr: 'A2',
    cambridge: 'YLE Flyers', vocabTarget: 800, color: 'lime',
    gradient: 'from-lime-300 to-green-400', units: L3_UNITS,
  },
  {
    id: 'L4', name: 'Power Up 4', ageRange: '7-8岁', cefr: 'A2',
    cambridge: 'Pre-KET', vocabTarget: 1000, color: 'teal',
    gradient: 'from-teal-300 to-cyan-400', units: L4_UNITS,
  },
  {
    id: 'L5', name: 'Power Up 5', ageRange: '8-9岁', cefr: 'A2-B1',
    cambridge: 'KET', vocabTarget: 1300, color: 'sky',
    gradient: 'from-sky-300 to-blue-400', units: L5_UNITS,
  },
  {
    id: 'L6', name: 'Power Up 6', ageRange: '9-12岁', cefr: 'B1',
    cambridge: 'PET', vocabTarget: 1600, color: 'violet',
    gradient: 'from-violet-300 to-purple-400', units: L6_UNITS,
  },
]

export function getAllUnits(): UnitData[] {
  return LEVELS.flatMap((l) => l.units)
}

export function findUnit(unitId: string): UnitData | undefined {
  return getAllUnits().find((u) => u.id === unitId)
}

export function findWord(wordId: string): WordItem | undefined {
  for (const u of getAllUnits()) {
    const found = u.words.find((wd) => wd.id === wordId)
    if (found) return found
  }
  return undefined
}

export function findLevel(levelId: string): LevelData | undefined {
  return LEVELS.find((l) => l.id === levelId)
}
