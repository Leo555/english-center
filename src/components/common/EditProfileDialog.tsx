import { useEffect, useState } from 'react'
import { AVATAR_OPTIONS, useUsers, type UserProfile } from '../../store/useUsers'
import Button from './Button'

interface Props {
  profile: UserProfile | null
  onClose: () => void
}

// 修改头像 / 昵称的弹窗：从「切换孩子」面板点击某个孩子资料上的 ✏️ 进入
export default function EditProfileDialog({ profile, onClose }: Props) {
  const renameProfile = useUsers((s) => s.renameProfile)
  const updateAvatar = useUsers((s) => s.updateAvatar)
  const [nickname, setNickname] = useState(profile?.nickname ?? '')
  const [avatar, setAvatar] = useState(profile?.avatar ?? AVATAR_OPTIONS[0])

  // 该弹窗组件在 ProfileSwitcher 里是常驻挂载的（profile 为 null 时不渲染内容），
  // 首次打开时用 useState 初始值带入没问题，但再次打开（切换编辑另一个孩子，
  // 或关闭后重新打开同一个孩子）不会重新触发 useState 初始化，导致表单残留上次编辑的内容。
  // 这里用 profile?.id 作为依赖，每次弹窗打开时都把表单重置为该孩子当前的昵称/头像。
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname)
      setAvatar(profile.avatar)
    }
  }, [profile?.id])

  if (!profile) return null

  const canSubmit = nickname.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    if (avatar !== profile.avatar) updateAvatar(profile.id, avatar)
    if (nickname.trim() !== profile.nickname) renameProfile(profile.id, nickname)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-fun font-bold text-lg text-slate-700 text-center mb-4">✏️ 编辑资料</div>

        <div className="flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-sm font-bold text-slate-500 mb-1">孩子的昵称</label>
            <input
              autoFocus
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                    avatar === emoji ? 'bg-amber-200 ring-2 ring-amber-400 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="ghost" fullWidth onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" fullWidth onClick={handleSubmit} disabled={!canSubmit}>
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}
