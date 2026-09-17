import type { VideoData } from '../types'

// ============================================================
// 视频学习专区 —— 数据源
// ============================================================
// 重要说明（请务必遵守）：
// 1. 本文件只搭建"结构"，下方 source 均为 null（占位状态），页面会展示"敬请期待"。
// 2. 请只填入你拥有合法授权的视频：
//    a) source: 'youtube' + youtubeId —— 官方发布在 YouTube 上、允许 embed 嵌入播放的公开视频
//       （只是嵌入播放官方视频，不下载/不转存文件）
//    b) source: 'local' + localSrc —— 你自己拥有版权/已获授权的视频文件，
//       放到 public/videos/ 对应目录下，例如 public/videos/l1/greetings.mp4，
//       则 localSrc 填 '/videos/l1/greetings.mp4'
// 3. 不要下载、转存、托管未获授权的第三方版权视频（包括但不限于教材出版社的付费课程视频）。
// ============================================================

export const VIDEOS: VideoData[] = [
  // ---------------- Level 1 ----------------
  { id: 'L1-V1', levelId: 'L1', title: '打招呼', titleEn: 'Greetings', desc: '学习日常问候用语', emoji: '👋', source: null },
  { id: 'L1-V2', levelId: 'L1', title: '数字 1-10', titleEn: 'Numbers 1-10', desc: '认识数字并学会数数', emoji: '🔢', source: null },
  { id: 'L1-V3', levelId: 'L1', title: '颜色', titleEn: 'Colors', desc: '认识常见颜色单词', emoji: '🎨', source: null },

  // ---------------- Level 2 ----------------
  { id: 'L2-V1', levelId: 'L2', title: '我的家庭', titleEn: 'My Family', desc: '认识家庭成员称呼', emoji: '👨‍👩‍👧', source: null },
  { id: 'L2-V2', levelId: 'L2', title: '动物朋友', titleEn: 'Animal Friends', desc: '认识常见动物单词', emoji: '🐶', source: null },
  { id: 'L2-V3', levelId: 'L2', title: '一天的活动', titleEn: 'Daily Activities', desc: '学习描述一天的日常活动', emoji: '⏰', source: null },

  // ---------------- Level 3 ----------------
  { id: 'L3-V1', levelId: 'L3', title: '校园生活', titleEn: 'School Life', desc: '认识校园场景常用表达', emoji: '🏫', source: null },
  { id: 'L3-V2', levelId: 'L3', title: '周末计划', titleEn: 'Weekend Plans', desc: '学习谈论周末打算', emoji: '📅', source: null },
  { id: 'L3-V3', levelId: 'L3', title: '美食世界', titleEn: 'Food World', desc: '认识各国美食词汇', emoji: '🍜', source: null },

  // ---------------- Level 4 ----------------
  { id: 'L4-V1', levelId: 'L4', title: '城市探索', titleEn: 'City Exploration', desc: '认识城市场所与方位表达', emoji: '🏙️', source: null },
  { id: 'L4-V2', levelId: 'L4', title: '健康生活', titleEn: 'Healthy Life', desc: '学习健康与运动相关表达', emoji: '🏃', source: null },
  { id: 'L4-V3', levelId: 'L4', title: '奇妙发明', titleEn: 'Amazing Inventions', desc: '认识常见发明与科技词汇', emoji: '💡', source: null },

  // ---------------- Level 5 ----------------
  { id: 'L5-V1', levelId: 'L5', title: '世界文化', titleEn: 'World Cultures', desc: '认识不同国家的文化习俗', emoji: '🌍', source: null },
  { id: 'L5-V2', levelId: 'L5', title: '科技生活', titleEn: 'Tech Life', desc: '学习科技相关话题表达', emoji: '💻', source: null },
  { id: 'L5-V3', levelId: 'L5', title: '人物传记', titleEn: 'Biography', desc: '学习描述人物经历的表达方式', emoji: '📖', source: null },

  // ---------------- Level 6 ----------------
  { id: 'L6-V1', levelId: 'L6', title: '学术写作', titleEn: 'Academic Writing', desc: '学习学术文章写作技巧', emoji: '📝', source: null },
  { id: 'L6-V2', levelId: 'L6', title: '全球议题', titleEn: 'Global Issues', desc: '学习讨论全球性话题的表达', emoji: '🌐', source: null },
  { id: 'L6-V3', levelId: 'L6', title: '演讲技巧', titleEn: 'Public Speaking', desc: '学习公众演讲常用句型', emoji: '🎤', source: null },
]

export function getVideosByLevel(levelId: string): VideoData[] {
  return VIDEOS.filter((v) => v.levelId === levelId)
}

export function findVideo(videoId: string): VideoData | undefined {
  return VIDEOS.find((v) => v.id === videoId)
}
