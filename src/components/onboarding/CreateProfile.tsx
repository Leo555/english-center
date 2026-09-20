import { useState } from 'react'
import { AVATAR_OPTIONS, useUsers } from '../../store/useUsers'
import Button from '../common/Button'
import Mascot from '../common/Mascot'

interface Props {
  mode?: 'onboarding' | 'add'
  onDone?: (id: string) => void
  onCancel?: () => void
}

export default function CreateProfile({ mode = 'onboarding', onDone, onCancel }: Props) {
  const createProfile = useUsers((s) => s.createProfile)
  const bindPhone = useUsers((s) => s.bindPhone)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0])
  const [phone, setPhone] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)

  // 手机号现在是必填项，长度校验需与后端 api/_lib/validate.ts 的 normalizePhone 保持一致（6~20 位数字）
  const cleanPhone = phone.replace(/\D/g, '')
  const phoneValid = cleanPhone.length >= 6 && cleanPhone.length <= 20
  const showPhoneError = phoneTouched && !phoneValid

  const canSubmit = nickname.trim().length > 0 && phoneValid

  const handleSubmit = () => {
    setPhoneTouched(true)
    if (!canSubmit) return
    const id = createProfile(nickname, avatar)
    bindPhone(id, cleanPhone)
    onDone?.(id)
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center pt-10 px-2">
      {mode === 'onboarding' && (
        <>
          <div className="text-4xl font-extrabold text-orange-500 drop-shadow-sm">🚀 Power Up 小英雄</div>
          <Mascot emoji="🦊" message="嗨，你好呀！先告诉我你的名字吧～" size="lg" />
        </>
      )}
      {mode === 'add' && <div className="text-2xl font-extrabold text-orange-500">✨ 创建新用户</div>}

      <div className="w-full max-w-xs bg-white/80 rounded-2xl p-5 shadow flex flex-col gap-4">
        <div className="text-left">
          <label className="block text-sm font-bold text-slate-500 mb-1">你的昵称</label>
          <input
            autoFocus
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            maxLength={12}
            placeholder="比如：小明"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-lg font-bold text-slate-700 outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-bold text-slate-500 mb-2">选一个头像</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`text-2xl rounded-xl aspect-square flex items-center justify-center transition-all ${
                  avatar === emoji
                    ? 'bg-amber-200 ring-2 ring-amber-400 scale-110'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="text-left">
          <label className="block text-sm font-bold text-slate-500 mb-1">
            手机号<span className="text-rose-400">（必填，用于云端同步）</span>
          </label>
          <input
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setPhoneTouched(true)}
            maxLength={20}
            placeholder="换设备后可用手机号找回进度"
            className={`w-full rounded-xl border-2 px-4 py-2.5 text-base font-bold text-slate-700 outline-none transition-colors ${
              showPhoneError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-amber-400'
            }`}
          />
          {showPhoneError && <p className="text-xs text-rose-400 mt-1">请输入 6~20 位手机号</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {mode === 'onboarding' ? '🎉 开始学习' : '✅ 创建'}
        </Button>
        {mode === 'add' && onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </div>
  )
}
