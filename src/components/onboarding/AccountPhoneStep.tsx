import { useState } from 'react'
import { useUsers } from '../../store/useUsers'
import { fetchCloudProfiles, type CloudProfileRecord } from '../../lib/cloudSync'
import Mascot from '../common/Mascot'

interface Props {
  message?: string
  onCreateNew: (phone: string) => void
  onPicked?: (id: string) => void
  onCancel?: () => void
}

// 手机号 = 家庭账号，昵称 = 该账号下的孩子（子用户）。
// 本组件统一负责"输入手机号 -> 查询该账号下已有的孩子 -> 选择继续 / 添加新孩子"，
// 供首次进入（Onboarding）与"切换账号"两处复用。
export default function AccountPhoneStep({
  message = '先设置家庭账号手机号，之后添加的孩子都会归到这个账号下，换设备也能用它找回～',
  onCreateNew,
  onPicked,
  onCancel,
}: Props) {
  const restoreFromCloud = useUsers((s) => s.restoreFromCloud)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<Record<string, CloudProfileRecord> | null>(null)
  const [queriedPhone, setQueriedPhone] = useState('')

  const clean = phone.replace(/\D/g, '')
  const valid = clean.length >= 6 && clean.length <= 20

  const handleContinue = async () => {
    if (!valid || loading) return
    setLoading(true)
    setProfiles(null)
    try {
      const result = await fetchCloudProfiles(clean)
      setProfiles(result)
    } catch {
      // 云端未配置或网络异常：不阻塞流程，当作"该账号下暂无云端记录"处理，
      // 仍可继续创建孩子资料（本地进度不受影响）。
      setProfiles({})
    } finally {
      setQueriedPhone(clean)
      setLoading(false)
    }
  }

  const handlePick = (nickname: string, record: CloudProfileRecord) => {
    const id = restoreFromCloud(queriedPhone, nickname, record)
    onPicked ? onPicked(id) : onCreateNew(queriedPhone)
  }

  const hasChildren = !!profiles && Object.keys(profiles).length > 0

  return (
    <div className="flex flex-col items-center gap-6 text-center pt-10 px-2">
      <Mascot emoji="📱" message={message} size="lg" />

      <div className="w-full max-w-xs bg-white/80 rounded-2xl p-5 shadow flex flex-col gap-4">
        <div className="text-left">
          <label className="block text-sm font-bold text-slate-500 mb-1">手机号（家庭账号）</label>
          <input
            autoFocus
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setProfiles(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            maxLength={20}
            placeholder="用于云端同步与换设备找回"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-lg font-bold text-slate-700 outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <button
          disabled={!valid || loading}
          onClick={handleContinue}
          className="w-full rounded-2xl bg-amber-400 disabled:opacity-40 py-3 font-bold text-white transition-colors"
        >
          {loading ? '查询中…' : '下一步'}
        </button>
      </div>

      {profiles && (
        <div className="w-full max-w-xs flex flex-col gap-2">
          {hasChildren && (
            <>
              <p className="text-xs text-slate-400">该账号下已有孩子，选择继续学习：</p>
              {Object.entries(profiles).map(([nickname, record]) => (
                <button
                  key={nickname}
                  onClick={() => handlePick(nickname, record)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-slate-50 hover:bg-amber-100 transition-colors text-left"
                >
                  <span className="text-2xl">{record.avatar || '🦁'}</span>
                  <span className="font-bold text-slate-700">{nickname}</span>
                </button>
              ))}
            </>
          )}
          <button
            onClick={() => onCreateNew(queriedPhone)}
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border-2 border-dashed border-slate-200 hover:border-amber-300 text-slate-500 hover:text-amber-500 font-bold transition-colors"
          >
            ➕ {hasChildren ? '添加新的孩子' : '用这个手机号创建孩子资料'}
          </button>
        </div>
      )}

      {onCancel && (
        <button onClick={onCancel} className="text-sm text-slate-400 underline">
          返回
        </button>
      )}
    </div>
  )
}
