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
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0])

  const canSubmit = nickname.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const id = createProfile(nickname, avatar)
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
