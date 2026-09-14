import type { WrongItem } from '../types'

// 简化版莱特纳 (Leitner) 间隔复习算法
// box: 1-5，box 越大代表记忆越牢固；间隔天数递增
const INTERVAL_DAYS = [0, 1, 2, 4, 7] // index = box-1

const DAY = 24 * 60 * 60 * 1000

export function createWrongItem(
  wordId: string,
  levelId: string,
  unitId: string,
): WrongItem {
  return {
    wordId,
    levelId,
    unitId,
    box: 1,
    nextReview: Date.now(),
    wrongCount: 1,
    correctStreak: 0,
    updatedAt: Date.now(),
  }
}

// 答错：回退到 box 1，需要尽快复习
export function reduceOnWrong(item: WrongItem): WrongItem {
  return {
    ...item,
    box: 1,
    nextReview: Date.now(),
    wrongCount: item.wrongCount + 1,
    correctStreak: 0,
    updatedAt: Date.now(),
  }
}

// 答对：box+1，间隔变长；box 超过上限视为已掌握，返回 null 从错题本移除
export function advanceOnCorrect(item: WrongItem): WrongItem | null {
  const nextBox = item.box + 1
  if (nextBox > INTERVAL_DAYS.length) {
    return null // 已掌握，移出错题本
  }
  return {
    ...item,
    box: nextBox,
    correctStreak: item.correctStreak + 1,
    nextReview: Date.now() + INTERVAL_DAYS[nextBox - 1] * DAY,
    updatedAt: Date.now(),
  }
}

export function isDue(item: WrongItem, now = Date.now()): boolean {
  return item.nextReview <= now
}
