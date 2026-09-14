export default function ProgressBar({ value, max, colorClass = 'bg-amber-400' }: { value: number; max: number; colorClass?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden border border-white shadow-inner">
      <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}
