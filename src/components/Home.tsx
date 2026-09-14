import { useMemo } from 'react'
import { useProgress } from '../store/useProgress'
import { getAllUnits } from '../data/levels'
import { isDue } from '../utils/srs'
import Button from './common/Button'
import Mascot from './common/Mascot'
import ProgressBar from './common/ProgressBar'

export default function Home({ onEnterMap, onEnterReview }: { onEnterMap: () => void; onEnterReview: () => void }) {
  const wrongBook = useProgress((s) => s.wrongBook)
  const totalStars = useProgress((s) => s.getTotalStars())

  const maxStars = useMemo(() => getAllUnits().filter((u) => u.words.length > 0).length * 9, [])
  const dueCount = useMemo(() => Object.values(wrongBook).filter((it) => isDue(it)).length, [wrongBook])

  return (
    <div className="flex flex-col items-center gap-6 text-center pt-6">
      <div className="text-4xl font-extrabold text-orange-500 drop-shadow-sm">🚀 Power Up 小英雄</div>
      <Mascot emoji="🦁" message="嗨！准备好闯关学英语了吗？" size="lg" />

      <div className="w-full max-w-sm bg-white/70 rounded-2xl p-4 shadow">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
          <span>总进度</span>
          <span>
            ⭐ {totalStars} / {maxStars}
          </span>
        </div>
        <ProgressBar value={totalStars} max={maxStars} />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button onClick={onEnterMap}>🗺️ 开始闯关</Button>
        <Button variant="secondary" onClick={onEnterReview} className="relative">
          🧠 巩固练习
          {dueCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pop">
              {dueCount}
            </span>
          )}
        </Button>
      </div>

      <p className="text-xs text-slate-400 max-w-xs mt-2">
        内容分级对标《Power Up》教材 1-6 级，覆盖剑桥 YLE Starters / Movers / Flyers 至 KET / PET。
      </p>
    </div>
  )
}
