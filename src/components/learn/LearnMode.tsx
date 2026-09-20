import { useEffect, useState } from 'react'
import type { UnitData } from '../../types'
import { speak } from '../../utils/speech'
import Button from '../common/Button'
import Mascot from '../common/Mascot'
import ProgressBar from '../common/ProgressBar'

export default function LearnMode({
  unit,
  onDone,
  onBack,
  onPlay,
}: {
  unit: UnitData
  onDone: () => void
  onBack: () => void
  onPlay: () => void
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)

  const word = unit.words[index]

  // 进入新单词卡片、或翻卡看例句时，自动朗读一次，无需孩子手动点击
  useEffect(() => {
    if (finished || !word) return
    speak(flipped ? word.example.en : word.en)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, flipped, finished])

  function next() {
    if (index + 1 >= unit.words.length) {
      setFinished(true)
      onDone()
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }
  function prev() {
    if (index === 0) return
    setIndex((i) => i - 1)
    setFlipped(false)
  }

  if (finished) {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-4 animate-pop">
        <Mascot emoji="🎓" message="学习完成啦！现在去闯关巩固一下吧～" size="lg" />
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>
            返回单元
          </Button>
          <Button variant="primary" onClick={onPlay}>
            🚀 去闯关
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <ProgressBar value={index} max={unit.words.length} colorClass="bg-sky-400" />
      <div className="text-slate-400 font-bold text-sm">
        第 {index + 1} / {unit.words.length} 个单词
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full bg-white rounded-3xl shadow-xl px-6 py-10 flex flex-col items-center gap-3 min-h-[260px] justify-center border-4 border-white hover:border-amber-200 transition-all"
      >
        <div className="text-7xl animate-pop">{word.emoji}</div>
        {!flipped ? (
          <>
            <div className="text-3xl font-extrabold text-slate-700">{word.en}</div>
            <div className="text-slate-400">{word.ipa}</div>
            <div className="text-xs text-slate-300 mt-2">👆 点卡片看中文和例句</div>
          </>
        ) : (
          <>
            <div className="text-2xl font-extrabold text-orange-500">{word.cn}</div>
            <div className="mt-2 text-slate-600 font-bold">{word.example.en}</div>
            <div className="text-slate-400 text-sm">{word.example.cn}</div>
          </>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          speak(flipped ? word.example.en : word.en)
        }}
        className="text-2xl bg-sky-100 hover:bg-sky-200 rounded-full w-14 h-14 flex items-center justify-center shadow"
        aria-label="发音"
      >
        🔊
      </button>

      <div className="flex gap-3 w-full">
        <Button variant="ghost" onClick={prev} disabled={index === 0} className="flex-1">
          ⬅️ 上一个
        </Button>
        <Button variant="primary" onClick={next} className="flex-1">
          {index + 1 >= unit.words.length ? '完成学习 🎉' : '下一个 ➡️'}
        </Button>
      </div>
    </div>
  )
}
