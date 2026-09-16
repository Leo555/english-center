import type { UnitData, WordItem } from '../../types'

// 共享的 uid 计数器：所有 l1~l6 模块都从这里导入 w()/unit()，
// 保证跨文件生成的 word id 全局唯一（不因文件拆分而重置冲突）。
let uid = 0
export function w(en: string, cn: string, ipa: string, emoji: string, exEn: string, exCn: string): WordItem {
  uid++
  return { id: `w${uid}-${en.replace(/\s+/g, '_')}`, en, cn, ipa, emoji, example: { en: exEn, cn: exCn } }
}

export function unit(
  levelId: string,
  index: number,
  title: string,
  titleEn: string,
  words: WordItem[],
  icon?: string
): UnitData {
  return { id: `${levelId}-U${index}`, levelId, index, title, titleEn, words, icon }
}
