import { useState } from 'react'
import { useUsers } from '../../store/useUsers'
import ConfirmDialog from '../common/ConfirmDialog'
import BindPhoneDialog from '../common/BindPhoneDialog'
import CreateProfile from '../onboarding/CreateProfile'
import CloudRestore from '../onboarding/CloudRestore'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ProfileSwitcher({ open, onClose }: Props) {
  const profiles = useUsers((s) => s.profiles)
  const currentUserId = useUsers((s) => s.currentUserId)
  const switchUser = useUsers((s) => s.switchUser)
  const removeProfile = useUsers((s) => s.removeProfile)
  const bindPhone = useUsers((s) => s.bindPhone)
  const unbindPhone = useUsers((s) => s.unbindPhone)
  const [adding, setAdding] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [bindingId, setBindingId] = useState<string | null>(null)

  if (!open) return null

  if (adding) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-50 to-sky-50 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <CreateProfile
            mode="add"
            onDone={() => {
              setAdding(false)
              onClose()
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      </div>
    )
  }

  if (restoring) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-50 to-sky-50 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <CloudRestore
            onDone={() => {
              setRestoring(false)
              onClose()
            }}
            onCancel={() => setRestoring(false)}
          />
        </div>
      </div>
    )
  }

  const pendingProfile = profiles.find((p) => p.id === pendingDelete)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl animate-pop max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-fun font-bold text-lg text-slate-700 text-center mb-4">切换用户</div>
        <div className="flex flex-col gap-2">
          {profiles.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${
                p.id === currentUserId ? 'bg-amber-100 ring-2 ring-amber-300' : 'bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <button
                className="flex items-center gap-3 flex-1 text-left"
                onClick={() => {
                  switchUser(p.id)
                  onClose()
                }}
              >
                <span className="text-2xl">{p.avatar}</span>
                <span className="font-bold text-slate-700">{p.nickname}</span>
                {p.id === currentUserId && <span className="text-xs text-amber-500 font-bold ml-1">当前</span>}
              </button>
              {p.phone ? (
                <button
                  className="text-xs text-sky-400 font-bold shrink-0 px-1"
                  onClick={() => unbindPhone(p.id)}
                  title="点击解除手机号同步"
                >
                  ☁️ 已同步
                </button>
              ) : (
                <button
                  className="text-xs text-slate-300 hover:text-sky-400 font-bold shrink-0 px-1"
                  onClick={() => setBindingId(p.id)}
                >
                  绑定同步
                </button>
              )}
              {profiles.length > 1 && (
                <button
                  className="text-slate-300 hover:text-rose-400 text-lg p-1 shrink-0"
                  onClick={() => setPendingDelete(p.id)}
                  aria-label="删除用户"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full mt-4 rounded-2xl border-2 border-dashed border-slate-200 py-3 font-bold text-slate-400 hover:border-amber-300 hover:text-amber-500 transition-colors"
          onClick={() => setAdding(true)}
        >
          ➕ 添加新用户
        </button>
        <button
          className="w-full mt-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 font-bold text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-colors"
          onClick={() => setRestoring(true)}
        >
          🔄 用手机号找回进度
        </button>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        emoji="🗑️"
        title={`删除用户${pendingProfile ? ` "${pendingProfile.nickname}"` : ''}？`}
        message="该用户的学习进度将被永久删除，无法恢复。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={() => {
          if (pendingDelete) removeProfile(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <BindPhoneDialog
        open={!!bindingId}
        onConfirm={(phone) => {
          if (bindingId) bindPhone(bindingId, phone)
          setBindingId(null)
        }}
        onCancel={() => setBindingId(null)}
      />
    </div>
  )
}

