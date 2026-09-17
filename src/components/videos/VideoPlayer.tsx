import { findVideo } from '../../data/videos'
import { useVideoProgress } from '../../store/useVideoProgress'
import Button from '../common/Button'
import Mascot from '../common/Mascot'

export default function VideoPlayer({ videoId, onBack }: { videoId: string; onBack: () => void }) {
  const video = findVideo(videoId)
  const isWatched = useVideoProgress((s) => s.isWatched)
  const markWatched = useVideoProgress((s) => s.markWatched)

  if (!video) return null

  const watched = isWatched(video.id)

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回视频专区
      </button>

      <div className="text-center">
        <div className="text-2xl font-extrabold text-slate-700">
          {video.emoji} {video.title}
        </div>
        <div className="text-sm text-slate-400">{video.titleEn}</div>
      </div>

      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg flex items-center justify-center">
        {video.source === 'youtube' && video.youtubeId && (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {video.source === 'local' && video.localSrc && (
          <video
            className="w-full h-full"
            src={video.localSrc}
            controls
            onEnded={() => markWatched(video.id)}
          />
        )}
        {video.source === null && (
          <div className="text-white/80 px-6 py-10 text-center">
            <div className="text-4xl mb-2">🚧</div>
            <div className="font-bold">视频暂未上传，敬请期待～</div>
          </div>
        )}
      </div>

      <div className="bg-white/75 rounded-2xl p-4 shadow-sm text-sm text-slate-500">{video.desc}</div>

      {video.source && (
        <Button
          variant={watched ? 'ghost' : 'primary'}
          fullWidth
          onClick={() => markWatched(video.id)}
          disabled={watched}
        >
          {watched ? '✅ 已学完' : '✅ 标记为已学完'}
        </Button>
      )}

      {video.source === null && <Mascot emoji="🎬" message="等视频上线了，我第一个通知你！" size="md" />}
    </div>
  )
}
