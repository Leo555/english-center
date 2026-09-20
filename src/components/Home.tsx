import { useMemo, useState } from 'react'
import { useProgress } from '../store/useProgress'
import { useUsers } from '../store/useUsers'
import { getAllUnits } from '../data/levels'
import { isDue } from '../utils/srs'
import Button from './common/Button'
import Mascot from './common/Mascot'
import ProgressBar from './common/ProgressBar'
import ProfileSwitcher from './common/ProfileSwitcher'

export default function Home({
  onEnterMap,
  onEnterReview,
  onEnterVideos,
}: {
  onEnterMap: () => void
  onEnterReview: () => void
  onEnterVideos: () => void
}) {
  const wrongBook = useProgress((s) => s.wrongBook)
  const totalStars = useProgress((s) => s.getTotalStars())
  const currentProfile = useUsers((s) => s.getCurrentProfile())
  const [switcherOpen, setSwitcherOpen] = useState(false)

  const maxStars = useMemo(() => getAllUnits().filter((u) => u.words.length > 0).length * 9, [])
  const dueCount = useMemo(() => Object.values(wrongBook).filter((it) => isDue(it)).length, [wrongBook])

  return (
    <div className="flex flex-col items-center gap-6 text-center pt-6">
      <div className="w-full flex justify-end gap-1 -mb-2">
        <button
          onClick={() => setSwitcherOpen(true)}
          aria-label="账号设置"
          className="flex items-center justify-center w-10 h-10 text-2xl leading-none opacity-70 hover:opacity-100 transition-opacity shrink-0"
        >
          <span className="leading-none">⚙️</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Power Up 小英雄" className="w-14 h-14 drop-shadow-sm" />
        <div className="text-4xl font-extrabold text-orange-500 drop-shadow-sm">Power Up 小英雄</div>
      </div>
      <Mascot
        emoji={currentProfile?.avatar ?? '🦁'}
        message={`hi${currentProfile ? `，${currentProfile.nickname}` : ''}！准备好闯关学英语了吗？`}
        size="lg"
      />

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
        <Button variant="ghost" onClick={onEnterVideos}>
          🎬 视频学习专区
        </Button>
      </div>

      <p className="text-xs text-slate-400 max-w-xs mt-2">
        内容分级对标《Power Up》教材 1-6 级，覆盖剑桥 YLE Starters / Movers / Flyers 至 KET / PET。
      </p>

      <ProfileSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  )
}
