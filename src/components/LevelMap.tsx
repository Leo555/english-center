import { LEVELS } from '../data/levels'
import { useProgress } from '../store/useProgress'

// 每 3 个单元一个主题色带，让整版地图按主题分区；柔和的单色系渐变，
// 兼顾可读性与整体的轻柔配色调性，不追求过强的明暗对比
const THEME_PALETTE = [
  'from-sky-300 to-blue-400',
  'from-indigo-300 to-violet-400',
  'from-fuchsia-300 to-pink-400',
  'from-rose-300 to-red-400',
  'from-orange-300 to-amber-400',
  'from-lime-300 to-green-400',
  'from-emerald-300 to-teal-400',
  'from-cyan-300 to-sky-400',
  'from-purple-300 to-fuchsia-400',
]

function themeGradient(unitIndex: number) {
  return THEME_PALETTE[Math.floor((unitIndex - 1) / 3) % THEME_PALETTE.length]
}

// 顶部总进度条专用的深色系渐变：level.gradient 是浅色系（300→400），
// 用在浅灰色 track 上区分度太低（尤其低百分比时几乎看不出色块），
// 这里按各级别的主题色映射一套更深、更饱和的渐变（500→600），确保与灰色轨道形成明显对比。
const PROGRESS_GRADIENT: Record<string, string> = {
  rose: 'from-rose-500 to-pink-600',
  orange: 'from-orange-500 to-amber-600',
  lime: 'from-lime-500 to-green-600',
  teal: 'from-teal-500 to-cyan-600',
  sky: 'from-sky-500 to-blue-600',
  violet: 'from-violet-500 to-purple-600',
}

function progressGradient(color: string) {
  return PROGRESS_GRADIENT[color] ?? 'from-indigo-500 to-purple-600'
}

export default function LevelMap({
  levelId,
  onSelectLevel,
  onEnterUnit,
  onViewVocab,
  onBack,
}: {
  levelId?: string
  onSelectLevel: (levelId: string) => void
  onEnterUnit: (unitId: string) => void
  onViewVocab: (levelId: string) => void
  onBack: () => void
}) {
  const isUnitUnlocked = useProgress((s) => s.isUnitUnlocked)
  const isUnitCleared = useProgress((s) => s.isUnitCleared)
  const unitProgress = useProgress((s) => s.unitProgress)

  const level = levelId ? LEVELS.find((l) => l.id === levelId) : undefined

  if (!level) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <button onClick={onBack} className="self-start text-slate-400 font-bold">
          ⬅️ 返回首页
        </button>
        <div className="text-2xl font-extrabold text-center text-slate-700 mb-2">选择 Power Up 级别</div>
        {LEVELS.map((lv) => {
          const unlocked = isUnitUnlocked(lv.units[0].id)
          return (
            <button
              key={lv.id}
              disabled={!unlocked}
              onClick={() => onSelectLevel(lv.id)}
              className={`rounded-2xl p-4 text-left transition-all flex items-center justify-between gap-3 ${
                unlocked
                  ? `shadow-lg bg-gradient-to-r ${lv.gradient} text-white`
                  : 'shadow-sm bg-slate-100 text-slate-400'
              }`}
            >
              <div>
                <div className="text-xl font-extrabold">{lv.name}</div>
                <div className={`text-sm ${unlocked ? 'opacity-90' : 'text-slate-400'}`}>
                  适合 {lv.ageRange} · CEFR {lv.cefr} · 剑桥 {lv.cambridge}
                </div>
                <div className={`text-xs mt-1 ${unlocked ? 'opacity-80' : 'text-slate-400'}`}>
                  目标词汇量 {lv.vocabTarget}+
                </div>
              </div>
              <div className="w-9 h-9 shrink-0 flex items-center justify-center text-3xl leading-none">
                {unlocked ? '▶️' : '🔒'}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  const playableUnits = level.units.filter((u) => u.words.length > 0)
  const clearedCount = playableUnits.filter((u) => isUnitCleared(u.id)).length
  const totalStars = playableUnits.reduce(
    (sum, u) => sum + Object.values(unitProgress[u.id]?.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0),
    0,
  )
  const maxStars = playableUnits.length * 9
  const progressPct = maxStars ? Math.round((totalStars / maxStars) * 100) : 0

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回级别列表
      </button>
      <div className="text-2xl font-extrabold text-center text-slate-700 mb-2">{level.name} 闯关地图</div>
      <button
        onClick={() => onViewVocab(level.id)}
        className="self-center bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-slate-600 border-2 border-white hover:border-amber-200 transition-all"
      >
        📖 查看本级词汇表
      </button>
      <div className="bg-white/75 rounded-2xl px-4 py-3 shadow-sm mx-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span>🏁 闯关进度</span>
          <span>
            已通关 {clearedCount}/{playableUnits.length} 单元 · ⭐ {totalStars}/{maxStars}
          </span>
        </div>
        <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden ring-1 ring-slate-300/60">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressGradient(level.color)} transition-all`}
            style={{ width: `${Math.max(progressPct, totalStars > 0 ? 3 : 0)}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pb-6 px-2">
        {level.units.map((u) => {
          const unlocked = isUnitUnlocked(u.id)
          const stars = Object.values(unitProgress[u.id]?.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0)
          const isDev = u.words.length === 0
          const logo = u.icon ?? (isDev ? '🚧' : '📘')
          const cleared = unlocked && !isDev && isUnitCleared(u.id)
          const starPct = Math.round((stars / 9) * 100)
          return (
            <button
              key={u.id}
              disabled={!unlocked}
              onClick={() => onEnterUnit(u.id)}
              className={`relative rounded-2xl aspect-square flex flex-col items-center justify-center gap-0.5 shadow-lg font-bold border-4 transition-all
                ${unlocked ? `bg-gradient-to-br ${themeGradient(u.index)} text-white border-white` : 'bg-slate-200 text-slate-400 border-slate-100'}
              `}
            >
              <span className="absolute top-1.5 left-2 text-[10px] font-bold opacity-70">{u.index}</span>
              {cleared && <span className="absolute top-1 right-1.5 text-xs">✅</span>}
              <span className="text-3xl">{unlocked ? logo : '🔒'}</span>
              <span className="text-[10px] px-1.5 text-center leading-tight">{u.title}</span>
              {unlocked && !isDev && (
                <div className="w-[78%] flex flex-col items-center gap-0.5 mt-0.5">
                  <div className="h-1.5 w-full bg-black/25 rounded-full overflow-hidden ring-1 ring-black/10">
                    <div
                      className="h-full bg-amber-300 rounded-full transition-all shadow-[0_0_2px_rgba(0,0,0,0.3)]"
                      style={{ width: `${Math.max(starPct, stars > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 bg-white/90 rounded-full px-1.5 leading-tight shadow-sm">
                    ⭐{stars}/9
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
