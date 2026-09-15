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
              className={`rounded-2xl p-4 shadow-lg bg-gradient-to-r ${lv.gradient} text-white text-left disabled:opacity-40 disabled:grayscale transition-all`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-extrabold">
                    {lv.name} {!unlocked && '🔒'}
                  </div>
                  <div className="text-sm opacity-90">
                    适合 {lv.ageRange} · CEFR {lv.cefr} · 剑桥 {lv.cambridge}
                  </div>
                </div>
                <div className="text-3xl">{unlocked ? '▶️' : '🔒'}</div>
              </div>
              <div className="text-xs opacity-80 mt-1">目标词汇量 {lv.vocabTarget}+</div>
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
        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all`}
            style={{ width: `${progressPct}%` }}
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
                <div className="w-[70%] flex flex-col items-center gap-0.5 mt-0.5">
                  <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${starPct}%` }} />
                  </div>
                  <span className="text-[9px] opacity-90">⭐{stars}/9</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
