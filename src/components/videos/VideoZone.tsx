import { useMemo, useState } from 'react'
import { LEVELS } from '../../data/levels'
import { getVideosByLevel } from '../../data/videos'
import { useVideoProgress } from '../../store/useVideoProgress'
import Mascot from '../common/Mascot'

export default function VideoZone({
  onBack,
  onOpenVideo,
}: {
  onBack: () => void
  onOpenVideo: (videoId: string) => void
}) {
  const [levelId, setLevelId] = useState(LEVELS[0].id)
  const isWatched = useVideoProgress((s) => s.isWatched)

  const videos = useMemo(() => getVideosByLevel(levelId), [levelId])
  const level = LEVELS.find((l) => l.id === levelId)!

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回首页
      </button>
      <div className="text-2xl font-extrabold text-center text-slate-700">🎬 视频学习专区</div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            onClick={() => setLevelId(lv.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
              lv.id === levelId
                ? `bg-gradient-to-r ${lv.gradient} text-white shadow`
                : 'bg-white text-slate-400 shadow-sm'
            }`}
          >
            {lv.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pb-6">
        {videos.map((v) => {
          const playable = v.source !== null
          const watched = isWatched(v.id)
          return (
            <button
              key={v.id}
              onClick={() => onOpenVideo(v.id)}
              className="flex items-center gap-3 bg-white rounded-2xl shadow p-3 text-left transition-transform active:scale-[0.98]"
            >
              <div
                className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-gradient-to-br ${level.gradient}`}
              >
                {v.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-700 truncate flex items-center gap-1.5">
                  {v.title}
                  {watched && <span className="text-xs">✅</span>}
                </div>
                <div className="text-xs text-slate-400 truncate">{v.titleEn}</div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{v.desc}</div>
              </div>
              <div className="shrink-0 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                {playable ? '▶️ 可播放' : <span className="text-slate-400">🚧 敬请期待</span>}
              </div>
            </button>
          )
        })}
      </div>

      {videos.length === 0 && <Mascot emoji="🚧" message="这个级别的视频正在筹备中，敬请期待～" size="lg" />}
    </div>
  )
}
