import { useEffect, useMemo, useState } from 'react'
import type { WordItem } from '../../types'
import { buildChoices, calcStars, shuffle } from '../../utils/gameEngine'
import { speak } from '../../utils/speech'
import ProgressBar from '../common/ProgressBar'

interface Question {
  word: WordItem
  direction: 'word2pic' | 'pic2word'
  options: WordItem[]
}

export interface GameProps {
  words: WordItem[]
  onAnswer: (wordId: string, correct: boolean) => void
  onFinish: (stars: number, correct: number, total: number) => void
}

export default function PictureChoiceGame({ words, onAnswer, onFinish }: GameProps) {
  const questions = useMemo<Question[]>(() => {
    return shuffle(words).map((word) => ({
      word,
      direction: Math.random() > 0.5 ? 'word2pic' : 'pic2word',
      options: buildChoices(words, word, 4),
    }))
  }, [words])

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const q = questions[qIndex]

  // 进入新题目时自动朗读一次单词（仅"看词选图"方向，避免"看图选词"泄露答案读音）
  useEffect(() => {
    if (!q || q.direction !== 'word2pic') return
    speak(q.word.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex])

  function handlePick(opt: WordItem) {
    if (feedback) return
    setSelected(opt.id)
    const isCorrect = opt.id === q.word.id
    onAnswer(q.word.id, isCorrect)
    if (isCorrect) {
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
      setTimeout(() => {
        if (qIndex + 1 >= questions.length) {
          const finalMistakes = mistakes
          onFinish(calcStars(questions.length, finalMistakes), correctCount + 1, questions.length)
        } else {
          setQIndex((i) => i + 1)
          setSelected(null)
          setFeedback(null)
        }
      }, 550)
    } else {
      setFeedback('wrong')
      setMistakes((m) => m + 1)
      setTimeout(() => {
        setSelected(null)
        setFeedback(null)
      }, 500)
    }
  }

  if (!q) return null

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <ProgressBar value={qIndex} max={questions.length} colorClass="bg-emerald-400" />
      <div className="text-center">
        {q.direction === 'word2pic' ? (
          <button
            onClick={() => speak(q.word.en)}
            className="bg-white rounded-3xl px-8 py-6 shadow-lg animate-pop"
          >
            <div className="text-4xl font-extrabold text-slate-700">{q.word.en}</div>
            <div className="text-slate-400 text-sm mt-1">{q.word.ipa} 🔊 再听一次</div>
          </button>
        ) : (
          <div className="text-8xl animate-pop">{q.word.emoji}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {q.options.map((opt) => {
          const isSelected = selected === opt.id
          const showCorrect = feedback && opt.id === q.word.id
          const showWrong = feedback === 'wrong' && isSelected
          return (
            <button
              key={opt.id}
              onClick={() => handlePick(opt)}
              className={`rounded-2xl py-6 px-3 text-center font-bold text-2xl shadow-md border-4 transition-all
                ${showCorrect ? 'border-emerald-400 bg-emerald-50 animate-pop' : ''}
                ${showWrong ? 'border-rose-400 bg-rose-50 animate-shake' : ''}
                ${!feedback ? 'border-white bg-white hover:border-amber-300' : ''}
              `}
            >
              {q.direction === 'word2pic' ? (
                <span className="text-5xl">{opt.emoji}</span>
              ) : (
                <span className="text-xl">{opt.en}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
