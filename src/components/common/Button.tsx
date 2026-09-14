import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-gradient-to-b from-amber-300 to-orange-400 text-white shadow-[0_4px_0_#c2650b] active:shadow-[0_1px_0_#c2650b] active:translate-y-[3px]',
  secondary: 'bg-gradient-to-b from-sky-300 to-blue-400 text-white shadow-[0_4px_0_#2a5fa5] active:shadow-[0_1px_0_#2a5fa5] active:translate-y-[3px]',
  ghost: 'bg-white text-slate-600 shadow-[0_4px_0_#e2e8f0] active:shadow-[0_1px_0_#e2e8f0] active:translate-y-[3px] border border-slate-100',
}

export default function Button({ variant = 'primary', fullWidth, className = '', children, ...rest }: Props) {
  return (
    <button
      className={`rounded-2xl px-6 py-3 font-fun font-bold text-lg transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
