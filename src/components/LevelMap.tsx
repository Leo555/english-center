import { LEVELS } from '../data/levels'
import { useProgress } from '../store/useProgress'

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
      <div className="grid grid-cols-3 gap-3 pb-6 px-2">
        {level.units.map((u) => {
          const unlocked = isUnitUnlocked(u.id)
          const stars = Object.values(unitProgress[u.id]?.stars ?? {}).reduce((a, b) => a + (b ?? 0), 0)
          const isDev = u.words.length === 0
          const logo = u.icon ?? (isDev ? '🚧' : '📘')
          return (
            <button
              key={u.id}
              disabled={!unlocked}
              onClick={() => onEnterUnit(u.id)}
              className={`relative rounded-2xl aspect-square flex flex-col items-center justify-center gap-0.5 shadow-lg font-bold border-4 transition-all
                ${unlocked ? `bg-gradient-to-br ${level.gradient} text-white border-white` : 'bg-slate-200 text-slate-400 border-slate-100'}
              `}
            >
              <span className="absolute top-1.5 left-2 text-[10px] font-bold opacity-70">{u.index}</span>
              <span className="text-3xl">{unlocked ? logo : '🔒'}</span>
              <span className="text-[10px] px-1.5 text-center leading-tight">{u.title}</span>
              {unlocked && !isDev && <span className="text-[10px]">⭐{stars}/9</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
