import { findLevel, findUnit } from '../data/levels'
import { useProgress } from '../store/useProgress'
import type { GameType } from '../types'
import { GAME_META } from '../types'
import Button from './common/Button'
import Mascot from './common/Mascot'
import StarRating from './common/StarRating'

export default function UnitHub({
  unitId,
  onLearn,
  onPlay,
  onBack,
}: {
  unitId: string
  onLearn: () => void
  onPlay: (gameType: GameType) => void
  onBack: () => void
}) {
  const unit = findUnit(unitId)
  const level = unit ? findLevel(unit.levelId) : undefined
  const progress = useProgress((s) => s.unitProgress[unitId])
  const learned = !!progress?.learned
  // dev 模式下（npm run dev）无需先完成学习模式即可直接进入闯关游戏，方便开发/测试
  const canPlay = learned || import.meta.env.DEV

  if (!unit || !level) return null

  const isDev = unit.words.length === 0

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回地图
      </button>
      <div className="text-center">
        <div className="text-sm text-slate-400 font-bold">
          {level.name} · 第 {unit.index} 关
        </div>
        <div className="text-2xl font-extrabold text-slate-700">{unit.title}</div>
      </div>

      {isDev ? (
        <Mascot emoji="🚧" message="这一关正在开发中，敬请期待～" size="lg" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 justify-center max-w-sm">
            {unit.words.map((wd) => (
              <span
                key={wd.id}
                className="bg-white rounded-xl px-3 py-2 shadow text-sm font-bold flex items-center gap-1"
              >
                <span className="text-xl">{wd.emoji}</span>
                {wd.en}
              </span>
            ))}
          </div>

          <Button variant="primary" fullWidth onClick={onLearn}>
            📖 学习模式 {learned && '✅'}
          </Button>

          <div className="grid grid-cols-1 gap-3 w-full">
            {(Object.keys(GAME_META) as GameType[]).map((gt) => {
              const stars = progress?.stars?.[gt] ?? 0
              return (
                <button
                  key={gt}
                  disabled={!canPlay}
                  onClick={() => onPlay(gt)}
                  className="bg-white disabled:opacity-40 rounded-2xl px-4 py-3 shadow flex items-center justify-between font-bold text-slate-600 border-2 border-white hover:border-amber-200 transition-all"
                >
                  <span>
                    {GAME_META[gt].icon} {GAME_META[gt].name}
                  </span>
                  <StarRating stars={stars} size="sm" />
                </button>
              )
            })}
          </div>
          {!canPlay && <div className="text-xs text-slate-400">先完成「学习模式」才能解锁闯关游戏哦～</div>}
        </>
      )}
    </div>
  )
}
