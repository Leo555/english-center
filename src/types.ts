// 核心数据类型定义

export interface WordItem {
  id: string // 全局唯一，如 L1-U1-hello
  en: string // 英文单词/短语
  cn: string // 中文释义
  ipa?: string // 音标
  emoji: string // 图形化表示，用于 图形选择/连线/消消乐
  example: { en: string; cn: string } // 例句（句子学习）
}

export interface UnitData {
  id: string // 如 L1-U1
  levelId: string
  index: number // 单元序号 1-9
  title: string // 单元主题（中文）
  titleEn: string
  words: WordItem[] // 为空数组表示内容开发中
  icon?: string // 主题 logo（emoji），用于地图上直观展示单元主题
}

export interface LevelData {
  id: string // L1 ~ L6
  name: string // Power Up 1
  ageRange: string
  cefr: string
  cambridge: string // 对应剑桥考试
  vocabTarget: number // 官方词汇量目标（用于展示分级信息）
  color: string // 主题色（tailwind 类名片段）
  gradient: string
  units: UnitData[]
}

export type GameType = 'picture' | 'match' | 'elim'

export const GAME_META: Record<GameType, { name: string; icon: string; desc: string }> = {
  picture: { name: '图形选择', icon: '🎯', desc: '看词/听音，选出正确的图形' },
  match: { name: '连线配对', icon: '🔗', desc: '把单词和图形/意思连起来' },
  elim: { name: '消消乐', icon: '💥', desc: '点击配对的卡片，全部消除' },
}

export interface UnitProgress {
  learned: boolean // 是否完成过学习模式
  stars: Partial<Record<GameType, number>> // 每种玩法的最佳星级 0-3
}

export interface WrongItem {
  wordId: string
  levelId: string
  unitId: string
  box: number // 莱特纳盒子等级 1-5，越大代表记得越牢
  nextReview: number // 下次应复习的时间戳
  wrongCount: number
  correctStreak: number
  updatedAt: number
}

// 视频学习专区
// source 为 null 表示暂未配置视频源（占位状态，前端展示"敬请期待"）；
// 请仅填入拥有合法授权/版权的视频（如自制视频、已获授权的官方 embed 链接），
// 不要下载/托管未授权的第三方版权视频文件。
export type VideoSource = 'youtube' | 'local' | null

export interface VideoData {
  id: string // 全局唯一，如 L1-V1
  levelId: string // 所属级别 L1 ~ L6
  title: string // 中文标题
  titleEn: string // 英文标题
  desc: string // 一句话简介
  emoji: string // 封面占位图标
  source: VideoSource
  youtubeId?: string // source === 'youtube' 时必填：YouTube 视频 ID（不含完整 URL）
  localSrc?: string // source === 'local' 时必填：public/ 下的本地视频路径，如 /videos/l1/greetings.mp4
}
