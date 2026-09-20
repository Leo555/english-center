import { useState } from 'react'

interface Props {
  open: boolean
  onConfirm: (phone: string) => void
  onCancel: () => void
}

export default function BindPhoneDialog({ open, onConfirm, onCancel }: Props) {
  const [phone, setPhone] = useState('')
  if (!open) return null

  const clean = phone.replace(/\D/g, '')
  const valid = clean.length >= 6 && clean.length <= 20

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4" onClick={onCancel}>
      <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-xl animate-pop" onClick={(e) => e.stopPropagation()}>
        <div className="text-2xl text-center mb-2">☁️</div>
        <div className="font-fun font-bold text-lg text-slate-700 text-center mb-3">绑定手机号同步</div>
        <p className="text-xs text-slate-400 text-center mb-3">
          绑定后学习进度会自动同步到云端；换设备后输入同一手机号即可找回。
        </p>
        <input
          autoFocus
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && valid && onConfirm(clean)}
          placeholder="请输入手机号"
          maxLength={20}
          className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-lg font-bold text-slate-700 outline-none focus:border-amber-400 transition-colors mb-4"
        />
        <div className="flex flex-col gap-2">
          <button
            disabled={!valid}
            onClick={() => valid && onConfirm(clean)}
            className="w-full rounded-2xl bg-amber-400 disabled:opacity-40 py-3 font-bold text-white transition-colors"
          >
            确认绑定
          </button>
          <button onClick={onCancel} className="w-full rounded-2xl py-2 font-bold text-slate-400">
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
