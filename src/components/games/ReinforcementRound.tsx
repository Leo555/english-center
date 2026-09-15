import { useEffect, useMemo, useState } from 'react'
import type { WordItem } from '../../types'
import { buildChoices, shuffle } from '../../utils/gameEngine'
import { speak } from '../../utils/speech'

interface Props {
  allWords: WordItem[] // 用于生成干扰项的词库（通常是本关全部单词）
  queueWords: WordItem[] // 需要巩固（本关答错过）的单词
  onAnswer: (wordId: string, correct: boolean) => void
  onDone: () => void
}

// 错题巩固环节：答错的题目会被放回队尾重新出现，必须全部答对才算完成，
// 不允许像主关卡一样直接跳过——这样才能确保孩子真正掌握了刚才答错的内容。
export default function ReinforcementRound({ allWords, queueWords, onAnswer, onDone }: Props) {
  const uniqueQueueWords = useMemo(() => {
    const seen = new Set<string>()
    return queueWords.filter((w) => (seen.has(w.id) ? false : (seen.add(w.id), true)))
  }, [queueWords])

  const totalToMaster = uniqueQueueWords.length
  const [queue, setQueue] = useState<WordItem[]>(() => shuffle(uniqueQueueWords))
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [roundKey, setRoundKey] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const current = queue[0]

  const { options, direction } = useMemo(() => {
    if (!current) return { options: [] as WordItem[], direction: 'word2pic' as const }
    return {
      direction: (Math.random() > 0.5 ? 'word2pic' : 'pic2word') as 'word2pic' | 'pic2word',
      options: buildChoices(allWords, current, 4),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundKey, current?.id])

  useEffect(() => {
    if (!current || direction !== 'word2pic') return
    speak(current.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundKey])

  function handlePick(opt: WordItem) {
    if (!current || feedback) return
    setSelected(opt.id)
    const isCorrect = opt.id === current.id
    onAnswer(current.id, isCorrect)
    setFeedback(isCorrect ? 'correct' : 'wrong')

    setTimeout(
      () => {
        setSelected(null)
        setFeedback(null)
        setRoundKey((k) => k + 1)
        if (isCorrect) {
          setMasteredIds((prev) => new Set(prev).add(current.id))
          const rest = queue.slice(1)
          if (rest.length === 0) {
            onDone()
            return
          }
          setQueue(rest)
        } else {
          // 答错放回队尾，必须再次面对直到答对为止
          setQueue([...queue.slice(1), current])
        }
      },
      isCorrect ? 550 : 750,
    )
  }

  if (!current) return null

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <div className="text-sm font-bold text-slate-500">
        巩固进度 {masteredIds.size} / {totalToMaster}
      </div>
      <div className="text-center">
        {direction === 'word2pic' ? (
          <button onClick={() => speak(current.en)} className="bg-white rounded-3xl px-8 py-6 shadow-lg animate-pop">
            <div className="text-4xl font-extrabold text-slate-700">{current.en}</div>
            <div className="text-slate-400 text-sm mt-1">{current.ipa} 🔊 再听一次</div>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1 animate-pop">
            <div className="text-8xl">{current.emoji}</div>
            <div className="text-slate-400 text-sm font-bold">{current.cn}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          const showCorrect = feedback && opt.id === current.id
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
              {direction === 'word2pic' ? (
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
