import { useEffect, useState } from 'react'
import { useUsers, type UserProfile } from '../../store/useUsers'
import { deleteCloudProfile, deleteLeaderboardEntry, fetchCloudProfiles, type CloudProfileRecord } from '../../lib/cloudSync'
import ConfirmDialog from '../common/ConfirmDialog'
import EditProfileDialog from '../common/EditProfileDialog'
import CreateProfile from '../onboarding/CreateProfile'
import AccountPhoneStep from '../onboarding/AccountPhoneStep'

interface Props {
  open: boolean
  onClose: () => void
}

// 待删除目标：本地资料（同时可能需要联动删除云端同名存档），或云端专属的存档（本机没有本地资料，直接删云端）
type PendingDelete = { type: 'local'; id: string } | { type: 'cloud'; nickname: string }

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
  const restoreFromCloud = useUsers((s) => s.restoreFromCloud)
  // 非空时表示正在为该手机号创建新孩子资料（来源：当前账号下"添加新的孩子"，
  // 或"切换家庭账号"流程中输入了新手机号后选择创建）
  const [addingForPhone, setAddingForPhone] = useState<string | null>(null)
  const [switchingAccount, setSwitchingAccount] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleting, setDeleting] = useState(false)
  // 待编辑资料（本地孩子），非空时展示 EditProfileDialog
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  // 删除需二次输入完整手机号确认，防止误触删除孩子/云端存档
  const [confirmPhoneInput, setConfirmPhoneInput] = useState('')

  function openDeleteConfirm(target: PendingDelete) {
    setConfirmPhoneInput('')
    setPendingDelete(target)
  }
  // 云端下该账号手机号下、但本机还没有本地资料的孩子（比如在别的设备上创建的），
  // 仅用于在"切换孩子"面板里展示 + 一键找回，不影响本地已有资料的展示。
  const [cloudOnly, setCloudOnly] = useState<Record<string, CloudProfileRecord>>({})
  const [restoringNickname, setRestoringNickname] = useState<string | null>(null)

  const currentProfile = profiles.find((p) => p.id === currentUserId)
  // 家庭账号 = 手机号：同一账号下的孩子共享同一个手机号，取当前孩子的手机号作为账号标识
  const currentPhone = currentProfile?.phone
  const sameAccountProfiles = currentPhone ? profiles.filter((p) => p.phone === currentPhone) : []
  const localNicknames = new Set(sameAccountProfiles.map((p) => p.nickname))

  // 面板打开时，顺便查一次云端该手机号下实际有哪些孩子——
  // 本地列表只反映"这台设备曾创建过的孩子"，同账号在别的设备上创建的孩子本地是看不到的，
  // 这里补一次云端查询，把本地没有的昵称也列出来，点击即可一键找回到本机。
  useEffect(() => {
    if (!open || !currentPhone) {
      setCloudOnly({})
      return
    }
    let cancelled = false
    fetchCloudProfiles(currentPhone)
      .then((result) => {
        if (cancelled) return
        const extra: Record<string, CloudProfileRecord> = {}
        for (const [nickname, record] of Object.entries(result)) {
          if (!localNicknames.has(nickname)) extra[nickname] = record
        }
        setCloudOnly(extra)
      })
      .catch(() => {
        // 云端未配置或网络异常：静默忽略，不影响本地列表的正常展示
        if (!cancelled) setCloudOnly({})
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPhone, profiles.length])

  if (!open) return null

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

  const pendingLocalProfile =
    pendingDelete?.type === 'local' ? profiles.find((p) => p.id === pendingDelete.id) : undefined
  const pendingDeleteTitle =
    pendingDelete?.type === 'local'
      ? pendingLocalProfile?.nickname
      : pendingDelete?.type === 'cloud'
        ? pendingDelete.nickname
        : undefined

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
              <button
                className="text-slate-300 hover:text-sky-400 text-lg p-1 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingProfile(p)
                }}
                aria-label="编辑资料"
              >
                ✏️
              </button>
              {sameAccountProfiles.length > 1 && (
                <button
                  className="text-slate-300 hover:text-rose-400 text-lg p-1 shrink-0"
                  onClick={() => openDeleteConfirm({ type: 'local', id: p.id })}
                  aria-label="删除孩子"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          {Object.entries(cloudOnly).map(([nickname, record]) => (
            <div
              key={nickname}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 bg-sky-50 hover:bg-sky-100 transition-colors"
            >
              <button
                disabled={restoringNickname !== null}
                className="flex items-center gap-3 flex-1 text-left disabled:opacity-50"
                onClick={async () => {
                  if (!currentPhone) return
                  setRestoringNickname(nickname)
                  try {
                    restoreFromCloud(currentPhone, nickname, record)
                    onClose()
                  } finally {
                    setRestoringNickname(null)
                  }
                }}
              >
                <span className="text-2xl">{record.avatar || '🦁'}</span>
                <span className="font-bold text-slate-700">{nickname}</span>
                <span className="text-xs text-sky-500 font-bold ml-auto shrink-0">
                  {restoringNickname === nickname ? '找回中…' : '☁️ 其他设备'}
                </span>
              </button>
              <button
                className="text-slate-300 hover:text-rose-400 text-lg p-1 shrink-0"
                onClick={() => openDeleteConfirm({ type: 'cloud', nickname })}
                aria-label="删除云端存档"
              >
                🗑️
              </button>
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
        title={`删除孩子${pendingDeleteTitle ? ` "${pendingDeleteTitle}"` : ''}？`}
        message="该孩子的学习进度将被永久删除，无法恢复。为防止误删，请输入当前账号手机号确认："
        confirmText={deleting ? '删除中…' : '删除'}
        cancelText="取消"
        confirmDisabled={deleting || !currentPhone || confirmPhoneInput.trim() !== currentPhone}
        onConfirm={async () => {
          if (!pendingDelete || deleting || !currentPhone) return
          if (confirmPhoneInput.trim() !== currentPhone) return
          setDeleting(true)
          try {
            if (pendingDelete.type === 'local') {
              const target = profiles.find((p) => p.id === pendingDelete.id)
              removeProfile(pendingDelete.id)
              // 本地删除后，同步删掉该手机号下同名的云端存档，避免下次打开面板又被"找回"出来
              if (target?.phone) {
                deleteCloudProfile(target.phone, target.nickname).catch(() => {})
                deleteLeaderboardEntry(target.phone, target.nickname).catch(() => {})
              }
            } else {
              await deleteCloudProfile(currentPhone, pendingDelete.nickname)
              deleteLeaderboardEntry(currentPhone, pendingDelete.nickname).catch(() => {})
              setCloudOnly((prev) => {
                const next = { ...prev }
                delete next[pendingDelete.nickname]
                return next
              })
            }
          } finally {
            setDeleting(false)
            setPendingDelete(null)
          }
        }}
        onCancel={() => setPendingDelete(null)}
      >
        <input
          type="tel"
          inputMode="numeric"
          autoFocus
          value={confirmPhoneInput}
          onChange={(e) => setConfirmPhoneInput(e.target.value)}
          placeholder={currentPhone ? formatPhone(currentPhone).replace(/\*/g, '·') : ''}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-center text-sm tracking-widest text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </ConfirmDialog>

      <EditProfileDialog profile={editingProfile} onClose={() => setEditingProfile(null)} />
    </div>
  )
}
