import type { GameType, WordItem } from '../../types'
import PictureChoiceGame from './PictureChoiceGame'
import MatchLineGame from './MatchLineGame'
import EliminationGame from './EliminationGame'
import Mascot from '../common/Mascot'

interface Props {
  gameType: GameType
  words: WordItem[]
  onAnswer: (wordId: string, correct: boolean) => void
  onFinish: (stars: number, correct: number, total: number) => void
}

export default function GamePlayer({ gameType, words, onAnswer, onFinish }: Props) {
  if (words.length === 0) {
    return (
      <div className="text-center py-10">
        <Mascot emoji="🚧" message="这部分内容正在开发中，敬请期待～" />
      </div>
    )
  }
  if (gameType === 'picture') return <PictureChoiceGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
  if (gameType === 'match') return <MatchLineGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
  return <EliminationGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
}
