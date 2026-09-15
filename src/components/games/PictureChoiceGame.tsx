import { useEffect, useMemo, useState } from 'react'
import type { WordItem } from '../../types'
import { buildChoices, calcStars, shuffle } from '../../utils/gameEngine'
import { speak } from '../../utils/speech'
import { playCorrect, playWrong } from '../../utils/sfx'
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

  // 选错直接进入下一题（不允许原地重试），只有全程零失误才能拿到 3 星
  function handlePick(opt: WordItem) {
    if (feedback) return
    setSelected(opt.id)
    const isCorrect = opt.id === q.word.id
    onAnswer(q.word.id, isCorrect)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    isCorrect ? playCorrect() : playWrong()

    const nextMistakes = isCorrect ? mistakes : mistakes + 1
    const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount
    if (!isCorrect) setMistakes(nextMistakes)
    else setCorrectCount(nextCorrectCount)

    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        onFinish(calcStars(questions.length, nextMistakes), nextCorrectCount, questions.length)
      } else {
        setQIndex((i) => i + 1)
        setSelected(null)
        setFeedback(null)
      }
    }, isCorrect ? 550 : 700)
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
          <div className="flex flex-col items-center gap-1 animate-pop">
            <div className="text-8xl">{q.word.emoji}</div>
            <div className="text-slate-400 text-sm font-bold">{q.word.cn}</div>
          </div>
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
                ${!feedback ? 'border-white bg-white active:border-amber-300' : ''}
              `}
            >
              {q.direction === 'word2pic' ? (
                <span className="flex flex-col items-center gap-1">
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="text-xs font-normal text-slate-400">{opt.cn}</span>
                </span>
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
