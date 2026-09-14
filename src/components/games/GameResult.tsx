import Button from '../common/Button'
import Mascot from '../common/Mascot'
import StarRating from '../common/StarRating'

interface Props {
  stars: number
  correct: number
  total: number
  unlockedNext?: boolean
  onRetry: () => void
  onBack: () => void
  backLabel?: string
}

const MESSAGES = ['别灰心，再试一次一定行！💪', '不错哦，继续加油！👍', '太棒啦，你是小英语高手！🎉']

export default function GameResult({ stars, correct, total, unlockedNext, onRetry, onBack, backLabel = '返回' }: Props) {
  const msgIndex = Math.max(0, Math.min(2, stars - 1))
  return (
    <div className="flex flex-col items-center gap-5 text-center py-6 animate-pop">
      <Mascot emoji={stars >= 3 ? '🥳' : stars >= 2 ? '🦊' : '🐣'} message={MESSAGES[msgIndex] ?? MESSAGES[0]} size="lg" />
      <StarRating stars={stars} size="lg" />
      <div className="text-slate-500 font-bold">
        答对 {correct} / {total} 题
      </div>
      {unlockedNext && (
        <div className="bg-emerald-100 text-emerald-600 font-bold rounded-full px-4 py-2 animate-pop">
          🔓 恭喜解锁下一关！
        </div>
      )}
      <div className="flex gap-3 mt-2">
        <Button variant="ghost" onClick={onRetry}>
          🔁 再玩一次
        </Button>
        <Button variant="primary" onClick={onBack}>
          {backLabel}
        </Button>
      </div>
    </div>
  )
}
