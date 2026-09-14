export default function StarRating({ stars, max = 3, size = 'md' }: { stars: number; max?: number; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl' : 'text-xl'
  return (
    <span className={`inline-flex gap-0.5 ${px}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < stars ? 'drop-shadow-sm' : 'opacity-25'}>
          ⭐
        </span>
      ))}
    </span>
  )
}
