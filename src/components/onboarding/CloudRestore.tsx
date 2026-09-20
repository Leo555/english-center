import { useState } from 'react'
import { useUsers } from '../../store/useUsers'
import { fetchCloudProfiles, type CloudProfileRecord } from '../../lib/cloudSync'
import Mascot from '../common/Mascot'

interface Props {
  onDone: (id: string) => void
  onCancel: () => void
}

export default function CloudRestore({ onDone, onCancel }: Props) {
  const restoreFromCloud = useUsers((s) => s.restoreFromCloud)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [profiles, setProfiles] = useState<Record<string, CloudProfileRecord> | null>(null)

  const clean = phone.replace(/\D/g, '')
  const canQuery = clean.length >= 6 && clean.length <= 20

  const handleQuery = async () => {
    if (!canQuery || loading) return
    setLoading(true)
    setError('')
    setProfiles(null)
    try {
      const result = await fetchCloudProfiles(clean)
      setProfiles(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }

  const handlePick = (nickname: string, record: CloudProfileRecord) => {
    const id = restoreFromCloud(clean, nickname, record)
    onDone(id)
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center pt-10 px-2">
      <Mascot emoji="☁️" message="输入绑定过同步的手机号，找回学习进度～" size="lg" />

      <div className="w-full max-w-xs bg-white/80 rounded-2xl p-5 shadow flex flex-col gap-4">
        <div className="text-left">
          <label className="block text-sm font-bold text-slate-500 mb-1">手机号</label>
          <input
            autoFocus
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="请输入绑定同步时用的手机号"
            maxLength={20}
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-lg font-bold text-slate-700 outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <button
          disabled={!canQuery || loading}
          onClick={handleQuery}
          className="w-full rounded-2xl bg-sky-400 disabled:opacity-40 py-3 font-bold text-white transition-colors"
        >
          {loading ? '查询中…' : '🔍 查询'}
        </button>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>

      {profiles && (
        <div className="w-full max-w-xs flex flex-col gap-2">
          {Object.keys(profiles).length === 0 ? (
            <p className="text-sm text-slate-400">该手机号还没有云端存档，请先创建资料并绑定手机号同步。</p>
          ) : (
            Object.entries(profiles).map(([nickname, record]) => (
              <button
                key={nickname}
                onClick={() => handlePick(nickname, record)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-slate-50 hover:bg-amber-100 transition-colors text-left"
              >
                <span className="text-2xl">{record.avatar || '🦁'}</span>
                <span className="font-bold text-slate-700">{nickname}</span>
              </button>
            ))
          )}
        </div>
      )}

      <button onClick={onCancel} className="text-sm text-slate-400 underline">
        返回
      </button>
    </div>
  )
}
