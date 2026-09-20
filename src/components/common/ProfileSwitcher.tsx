import { useState } from 'react'
import { useUsers } from '../../store/useUsers'
import ConfirmDialog from '../common/ConfirmDialog'
import CreateProfile from '../onboarding/CreateProfile'
import AccountPhoneStep from '../onboarding/AccountPhoneStep'

interface Props {
  open: boolean
  onClose: () => void
}

function formatPhone(phone?: string): string {
  if (!phone) return '未绑定'
  if (phone.length <= 4) return phone
  return `${phone.slice(0, phone.length - 4).replace(/\d/g, '*')}${phone.slice(-4)}`
}

export default function ProfileSwitcher({ open, onClose }: Props) {
  const profiles = useUsers((s) => s.profiles)
  const currentUserId = useUsers((s) => s.currentUserId)
  const switchUser = useUsers((s) => s.switchUser)
  const removeProfile = useUsers((s) => s.removeProfile)
  // 非空时表示正在为该手机号创建新孩子资料（来源：当前账号下"添加新的孩子"，
  // 或"切换家庭账号"流程中输入了新手机号后选择创建）
  const [addingForPhone, setAddingForPhone] = useState<string | null>(null)
  const [switchingAccount, setSwitchingAccount] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  if (!open) return null

  const currentProfile = profiles.find((p) => p.id === currentUserId)
  // 家庭账号 = 手机号：同一账号下的孩子共享同一个手机号，取当前孩子的手机号作为账号标识
  const currentPhone = currentProfile?.phone
  const sameAccountProfiles = currentPhone ? profiles.filter((p) => p.phone === currentPhone) : []

  if (addingForPhone) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-50 to-sky-50 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <CreateProfile
            mode="add"
            phone={addingForPhone}
            onDone={() => {
              setAddingForPhone(null)
              onClose()
            }}
            onCancel={() => setAddingForPhone(null)}
          />
        </div>
      </div>
    )
  }

  if (switchingAccount) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-50 to-sky-50 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <AccountPhoneStep
            message="切换到另一个家庭账号：输入手机号继续该账号下的孩子，或创建新孩子"
            onPicked={() => {
              setSwitchingAccount(false)
              onClose()
            }}
            onCreateNew={(phone) => {
              setSwitchingAccount(false)
              setAddingForPhone(phone)
            }}
            onCancel={() => setSwitchingAccount(false)}
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
        <div className="font-fun font-bold text-lg text-slate-700 text-center mb-1">切换孩子</div>
        <div className="text-center text-xs text-slate-400 mb-4">
          当前账号 {formatPhone(currentPhone)}
        </div>
        <div className="flex flex-col gap-2">
          {sameAccountProfiles.map((p) => (
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
              {sameAccountProfiles.length > 1 && (
                <button
                  className="text-slate-300 hover:text-rose-400 text-lg p-1 shrink-0"
                  onClick={() => setPendingDelete(p.id)}
                  aria-label="删除孩子"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className="w-full mt-4 rounded-2xl border-2 border-dashed border-slate-200 py-3 font-bold text-slate-400 hover:border-amber-300 hover:text-amber-500 transition-colors disabled:opacity-40"
          onClick={() => currentPhone && setAddingForPhone(currentPhone)}
          disabled={!currentPhone}
        >
          ➕ 添加新的孩子
        </button>
        <button
          className="w-full mt-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 font-bold text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-colors"
          onClick={() => setSwitchingAccount(true)}
        >
          📱 切换家庭账号
        </button>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        emoji="🗑️"
        title={`删除孩子${pendingProfile ? ` "${pendingProfile.nickname}"` : ''}？`}
        message="该孩子的学习进度将被永久删除，无法恢复。"
        confirmText="删除"
        cancelText="取消"
        onConfirm={() => {
          if (pendingDelete) removeProfile(pendingDelete)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
