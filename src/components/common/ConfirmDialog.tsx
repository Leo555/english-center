import type { ReactNode } from 'react'
import Button from './Button'

interface Props {
  open: boolean
  emoji?: string
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
  children?: ReactNode
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  emoji = '🤔',
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  confirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-xl animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-2 select-none">{emoji}</div>
        <div className="font-fun font-bold text-lg text-slate-700">{title}</div>
        {message && <div className="mt-1 text-sm text-slate-400">{message}</div>}
        {children}
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" fullWidth onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" fullWidth onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
