import { useEffect, useState } from 'react'
import { useUsers } from '../store/useUsers'
import { fetchLeaderboard, type LeaderboardEntry } from '../lib/cloudSync'
import Mascot from './common/Mascot'

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard({ onBack }: { onBack: () => void }) {
  const currentProfile = useUsers((s) => s.getCurrentProfile())
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchLeaderboard(100)
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 用于高亮"我"所在的排行：同手机号后 5 位 + 同昵称才算本人
  const myPhoneTail = currentProfile?.phone?.slice(-5)

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回首页
      </button>
      <div className="text-2xl font-extrabold text-center text-slate-700">🏆 排行榜</div>

      {loading && (
        <div className="text-center text-slate-400 font-bold py-8">加载中…</div>
      )}

      {!loading && error && (
        <Mascot emoji="🚧" message={error} size="lg" />
      )}

      {!loading && !error && entries.length === 0 && (
        <Mascot emoji="🌟" message="还没有人上榜，快去闯关拿星星吧！" size="lg" />
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="flex flex-col gap-2 pb-6">
          {entries.map((entry) => {
            const isMe = !!currentProfile && entry.phoneTail === myPhoneTail && entry.nickname === currentProfile.nickname
            return (
              <div
                key={`${entry.phoneTail}:${entry.nickname}:${entry.rank}`}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow ${
                  isMe ? 'bg-amber-100 ring-2 ring-amber-300' : 'bg-white'
                }`}
              >
                <span className="w-8 text-center text-lg font-extrabold text-slate-500 shrink-0">
                  {MEDALS[entry.rank] ?? entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-700 truncate">
                    {entry.nickname}
                    {isMe && <span className="ml-1 text-xs text-amber-500">（我）</span>}
                  </div>
                  <div className="text-xs text-slate-400">尾号 {entry.phoneTail}</div>
                </div>
                <div className="text-orange-500 font-extrabold shrink-0">⭐ {entry.score}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
