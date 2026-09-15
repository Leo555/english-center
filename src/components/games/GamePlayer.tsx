import { useRef, useState } from 'react'
import type { GameType, WordItem } from '../../types'
import PictureChoiceGame from './PictureChoiceGame'
import MatchLineGame from './MatchLineGame'
import EliminationGame from './EliminationGame'
import ReinforcementRound from './ReinforcementRound'
import Mascot from '../common/Mascot'
import ConfirmDialog from '../common/ConfirmDialog'

interface Props {
  gameType: GameType
  words: WordItem[]
  onAnswer: (wordId: string, correct: boolean) => void
  onFinish: (stars: number, correct: number, total: number) => void
  onExit: () => void
}

interface MainResult {
  correct: number
  total: number
}

export default function GamePlayer({ gameType, words, onAnswer, onFinish, onExit }: Props) {
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  // 用 ref 记录本次闯关中答错过的单词 id：ref 始终读到最新值，避免因主玩法最后一题
  // 恰好答错时，setState 的异步时序导致 handleMainFinish 用到旧的闭包漏判错题
  const wrongIdsRef = useRef<Set<string>>(new Set())
  const [phase, setPhase] = useState<'main' | 'reinforce'>('main')
  const [mainResult, setMainResult] = useState<MainResult | null>(null)
  const [wrongWords, setWrongWords] = useState<WordItem[]>([])

  function handleAnswer(wordId: string, correct: boolean) {
    onAnswer(wordId, correct)
    if (!correct) wrongIdsRef.current.add(wordId)
  }

  // 主玩法结束：若全程无错题，直接完成；否则先进入巩固环节，全部攻克后才算真正通关
  function handleMainFinish(stars: number, correct: number, total: number) {
    if (wrongIdsRef.current.size === 0) {
      onFinish(stars, correct, total)
    } else {
      setWrongWords(words.filter((w) => wrongIdsRef.current.has(w.id)))
      setMainResult({ correct, total })
      setPhase('reinforce')
    }
  }

  // 巩固环节全部答对：额外奖励满星，视为本关真正通关
  function handleReinforcementDone() {
    if (!mainResult) return
    onFinish(3, mainResult.total, mainResult.total)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <button onClick={() => setExitConfirmOpen(true)} className="self-start text-slate-400 font-bold">
        ✕ 退出闯关
      </button>
      <ConfirmDialog
        open={exitConfirmOpen}
        emoji="🚪"
        title="要退出本次闯关吗？"
        message={phase === 'reinforce' ? '还有错题没有攻克，退出后本次进度不会保存哦～' : '当前进度将不会保存哦～'}
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
      ) : phase === 'reinforce' ? (
        <>
          <Mascot emoji="🧠" message={`有 ${wrongWords.length} 个词答错了，全部攻克才能通关，加油！`} />
          <ReinforcementRound
            allWords={words}
            queueWords={wrongWords}
            onAnswer={handleAnswer}
            onDone={handleReinforcementDone}
          />
        </>
      ) : gameType === 'picture' ? (
        <PictureChoiceGame words={words} onAnswer={handleAnswer} onFinish={handleMainFinish} />
      ) : gameType === 'match' ? (
        <MatchLineGame words={words} onAnswer={handleAnswer} onFinish={handleMainFinish} />
      ) : (
        <EliminationGame words={words} onAnswer={handleAnswer} onFinish={handleMainFinish} />
      )}
    </div>
  )
}


