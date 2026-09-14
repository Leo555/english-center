import { useState } from 'react'
import type { GameType, WordItem } from '../../types'
import PictureChoiceGame from './PictureChoiceGame'
import MatchLineGame from './MatchLineGame'
import EliminationGame from './EliminationGame'
import Mascot from '../common/Mascot'
import ConfirmDialog from '../common/ConfirmDialog'

interface Props {
  gameType: GameType
  words: WordItem[]
  onAnswer: (wordId: string, correct: boolean) => void
  onFinish: (stars: number, correct: number, total: number) => void
  onExit: () => void
}

export default function GamePlayer({ gameType, words, onAnswer, onFinish, onExit }: Props) {
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 w-full">
      <button onClick={() => setExitConfirmOpen(true)} className="self-start text-slate-400 font-bold">
        ✕ 退出闯关
      </button>
      <ConfirmDialog
        open={exitConfirmOpen}
        emoji="🚪"
        title="要退出本次闯关吗？"
        message="当前进度将不会保存哦～"
        confirmText="确定退出"
        cancelText="继续闯关"
        onConfirm={() => {
          setExitConfirmOpen(false)
          onExit()
        }}
        onCancel={() => setExitConfirmOpen(false)}
      />
      {words.length === 0 ? (
        <div className="text-center py-10">
          <Mascot emoji="🚧" message="这部分内容正在开发中，敬请期待～" />
        </div>
      ) : gameType === 'picture' ? (
        <PictureChoiceGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
      ) : gameType === 'match' ? (
        <MatchLineGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
      ) : (
        <EliminationGame words={words} onAnswer={onAnswer} onFinish={onFinish} />
      )}
    </div>
  )
}
