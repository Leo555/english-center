import { useMemo, useState } from 'react'
import type { WordItem } from '../../types'
import { calcStars, chunk, shuffle } from '../../utils/gameEngine'
import { speak } from '../../utils/speech'
import { playCorrect, playWrong } from '../../utils/sfx'
import type { GameProps } from './PictureChoiceGame'

const ROUND_SIZE = 6

export default function MatchLineGame({ words, onAnswer, onFinish }: GameProps) {
  const rounds = useMemo(() => chunk(shuffle(words), ROUND_SIZE), [words])
  const [roundIndex, setRoundIndex] = useState(0)
  const [leftOrder, setLeftOrder] = useState<WordItem[]>(() => shuffle(rounds[0] ?? []))
  const [rightOrder, setRightOrder] = useState<WordItem[]>(() => shuffle(rounds[0] ?? []))
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const totalWords = words.length
  const round = rounds[roundIndex]

  function startRound(idx: number) {
    const r = rounds[idx]
    setLeftOrder(shuffle(r))
    setRightOrder(shuffle(r))
    setMatched(new Set())
    setSelectedLeft(null)
    setWrongPair(null)
  }

  function goNextRoundOrFinish(finalMistakes: number, finalCorrect: number) {
    if (roundIndex + 1 >= rounds.length) {
      onFinish(calcStars(totalWords, finalMistakes), finalCorrect, totalWords)
    } else {
      setRoundIndex((i) => i + 1)
      startRound(roundIndex + 1)
    }
  }

  function pickLeft(id: string) {
    if (matched.has(id) || wrongPair) return
    setSelectedLeft(id)
    speak(round.find((w) => w.id === id)?.en ?? '')
  }

  function pickRight(item: WordItem) {
    if (matched.has(item.id) || !selectedLeft || wrongPair) return
    const isCorrect = item.id === selectedLeft
    onAnswer(selectedLeft, isCorrect)
    if (isCorrect) {
      playCorrect()
      const nextMatched = new Set(matched)
      nextMatched.add(item.id)
      setMatched(nextMatched)
      setSelectedLeft(null)
      const newCorrect = correctCount + 1
      setCorrectCount(newCorrect)
      if (nextMatched.size === round.length) {
        setTimeout(() => goNextRoundOrFinish(mistakes, newCorrect), 500)
      }
    } else {
      playWrong()
      setWrongPair({ left: selectedLeft, right: item.id })
      const newMistakes = mistakes + 1
      setMistakes(newMistakes)
      setTimeout(() => {
        setWrongPair(null)
        setSelectedLeft(null)
      }, 500)
    }
  }

  if (!round) return null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className="text-slate-500 font-bold">
        第 {roundIndex + 1} / {rounds.length} 组 · 点单词，再点对应图形完成连线
      </div>
      <div className="grid grid-cols-2 gap-6 w-full">
        <div className="flex flex-col gap-3">
          {leftOrder.map((item) => {
            const isMatched = matched.has(item.id)
            const isSelected = selectedLeft === item.id
            const isWrong = wrongPair?.left === item.id
            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => pickLeft(item.id)}
                className={`rounded-xl px-4 py-3 font-bold text-lg border-4 shadow text-left transition-all
                  ${isMatched ? 'bg-emerald-50 border-emerald-300 opacity-60' : 'bg-white'}
                  ${isSelected ? 'border-amber-400' : !isMatched ? 'border-white' : ''}
                  ${isWrong ? 'border-rose-400 animate-shake' : ''}
                `}
              >
                {item.en} {isMatched && '✅'}
              </button>
            )
          })}
        </div>
        <div className="flex flex-col gap-3">
          {rightOrder.map((item) => {
            const isMatched = matched.has(item.id)
            const isWrong = wrongPair?.right === item.id
            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => pickRight(item)}
                className={`rounded-xl px-4 py-3 border-4 shadow flex flex-col items-center justify-center gap-0.5 transition-all
                  ${isMatched ? 'bg-emerald-50 border-emerald-300 opacity-60' : 'bg-white border-white'}
                  ${isWrong ? 'border-rose-400 animate-shake' : ''}
                `}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-normal text-slate-400">{item.cn}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
