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
  // 朗读期间短暂锁定"下一个"：读单词锁 1 秒、读例句锁 2 秒。
  // 用固定时长而不是等音频播完，避免音频缺失/被拦截时按钮一直不可用
  // （之前那种"像卡住"的体验）。
  const [nextLocked, setNextLocked] = useState(false)

  const word = unit.words[index]

  // 进入单词卡：自动朗读单词两遍，并锁"下一个" 1 秒；
  // 翻到例句：自动朗读例句一遍，并锁"下一个" 2 秒。
  useEffect(() => {
    if (finished || !word) return
    let cancelled = false
    let repeatTimer: number | undefined

    setNextLocked(true)
    const unlockTimer = window.setTimeout(() => {
      if (!cancelled) setNextLocked(false)
    }, flipped ? 2000 : 1000)

    if (flipped) {
      speak(word.example.en)
    } else {
      // 单词读两遍：第一遍播完停顿一下再播第二遍。
      // 注意不能连着调两次 speak——内部会 cancel 上一次，结果只响一遍。
      speak(word.en, 'en-US', () => {
        if (cancelled) return
        repeatTimer = window.setTimeout(() => {
          if (cancelled) return
          speak(word.en)
        }, 400)
      })
    }

    return () => {
      cancelled = true
      window.clearTimeout(unlockTimer)
      if (repeatTimer) window.clearTimeout(repeatTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, flipped, finished])

  // 两步式：先认词 -> 点"下一个"进入读例句 -> 再点一次才翻到下一个单词
  function next() {
    if (!flipped) {
      setFlipped(true)
      return
    }
    if (index + 1 >= unit.words.length) {
      setFinished(true)
      onDone()
    } else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }
  // 与 next 对称：例句态 -> 回到单词卡；单词卡态 -> 上一个单词的例句态
  function prev() {
    if (flipped) {
      setFlipped(false)
      return
    }
    if (index === 0) return
    setIndex((i) => i - 1)
    setFlipped(true)
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
        <Button variant="ghost" onClick={prev} disabled={index === 0 && !flipped} className="flex-1">
          ⬅️ 上一个
        </Button>
        <Button variant="primary" onClick={next} disabled={nextLocked} className="flex-1">
          {nextLocked
            ? flipped
              ? '🔊 听例句…'
              : '🔊 听单词…'
            : flipped && index + 1 >= unit.words.length
              ? '完成学习 🎉'
              : '下一个 ➡️'}
        </Button>
      </div>
    </div>
  )
}
