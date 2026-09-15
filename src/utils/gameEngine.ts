import type { WordItem } from '../types'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

// 容易被小朋友混淆的"近义/同义"词组：即使图形不同，意思也几乎无法区分
// （如 goodbye/bye 都是"再见"），因此禁止它们互相作为对方的干扰项出现在同一题里
const CONFUSABLE_GROUPS: string[][] = [
  ['hello', 'hi'],
  ['goodbye', 'bye'],
  ['home', 'house'],
  ['round', 'circle'],
  ['torch', 'flashlight'],
]

function isConfusable(a: string, b: string): boolean {
  return CONFUSABLE_GROUPS.some((g) => g.includes(a) && g.includes(b))
}

// 为某个正确答案生成 N 选 1 的干扰项（用于图形选择题）
export function buildChoices(pool: WordItem[], correct: WordItem, count = 4): WordItem[] {
  const distractorsPool = pool.filter((w) => w.id !== correct.id && !isConfusable(w.en, correct.en))
  const distractors = pickRandom(distractorsPool, Math.min(count - 1, distractorsPool.length))
  return shuffle([correct, ...distractors])
}

// 根据星级计算逻辑：完成即有 1 星，全对 3 星
export function calcStars(total: number, mistakes: number): number {
  if (total === 0) return 0
  if (mistakes === 0) return 3
  const ratio = mistakes / total
  if (ratio <= 0.3) return 2
  return 1
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}
