export default function Mascot({ emoji = '🦊', message, size = 'md' }: { emoji?: string; message?: string; size?: 'sm' | 'md' | 'lg' }) {
  const emojiSize = size === 'lg' ? 'text-7xl' : size === 'sm' ? 'text-3xl' : 'text-5xl'
  return (
    <div className="flex items-center gap-3">
      <div className={`${emojiSize} animate-floaty select-none`}>{emoji}</div>
      {message && (
        <div className="relative bg-white rounded-2xl rounded-bl-none px-4 py-2 shadow-md font-bold text-slate-600 max-w-xs">
          {message}
        </div>
      )}
    </div>
  )
}
