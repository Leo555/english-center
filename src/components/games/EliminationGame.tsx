import { useMemo, useState } from 'react'
import type { WordItem } from '../../types'
import { calcStars, chunk, shuffle } from '../../utils/gameEngine'
import { speak } from '../../utils/speech'
import type { GameProps } from './PictureChoiceGame'

const ROUND_SIZE = 6 // 每轮 6 个词 = 12 张卡片

interface Tile {
  key: string
  wordId: string
  type: 'word' | 'pic'
  label: string
}

function buildTiles(roundWords: WordItem[]): Tile[] {
  const tiles: Tile[] = []
  roundWords.forEach((w) => {
    tiles.push({ key: `${w.id}-word`, wordId: w.id, type: 'word', label: w.en })
    tiles.push({ key: `${w.id}-pic`, wordId: w.id, type: 'pic', label: w.emoji })
  })
  return shuffle(tiles)
}

export default function EliminationGame({ words, onAnswer, onFinish }: GameProps) {
  const rounds = useMemo(() => chunk(shuffle(words), ROUND_SIZE), [words])
  const [roundIndex, setRoundIndex] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(rounds[0] ?? []))
  const [selected, setSelected] = useState<string | null>(null)
  const [eliminated, setEliminated] = useState<Set<string>>(new Set())
  const [wrongKeys, setWrongKeys] = useState<Set<string>>(new Set())
  const [combo, setCombo] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const totalWords = words.length

  function goNextRoundOrFinish(finalMistakes: number, finalCorrect: number) {
    if (roundIndex + 1 >= rounds.length) {
      onFinish(calcStars(totalWords, finalMistakes), finalCorrect, totalWords)
    } else {
      const nextIdx = roundIndex + 1
      setRoundIndex(nextIdx)
      setTiles(buildTiles(rounds[nextIdx]))
      setSelected(null)
      setEliminated(new Set())
      setCombo(0)
    }
  }

  function pickTile(tile: Tile) {
    if (eliminated.has(tile.key) || wrongKeys.size > 0) return
    if (tile.type === 'word') speak(tile.label)

    if (!selected) {
      setSelected(tile.key)
      return
    }
    if (selected === tile.key) {
      setSelected(null)
      return
    }
    const first = tiles.find((t) => t.key === selected)!
    const isPair = first.wordId === tile.wordId && first.type !== tile.type
    onAnswer(tile.wordId, isPair)

    if (isPair) {
      const nextElim = new Set(eliminated)
      nextElim.add(first.key)
      nextElim.add(tile.key)
      setEliminated(nextElim)
      setSelected(null)
      setCombo((c) => c + 1)
      const newCorrect = correctCount + 1
      setCorrectCount(newCorrect)
      if (nextElim.size === tiles.length) {
        setTimeout(() => goNextRoundOrFinish(mistakes, newCorrect), 500)
      }
    } else {
      setWrongKeys(new Set([first.key, tile.key]))
      setCombo(0)
      const newMistakes = mistakes + 1
      setMistakes(newMistakes)
      setTimeout(() => {
        setWrongKeys(new Set())
        setSelected(null)
      }, 450)
    }
  }

  const round = rounds[roundIndex]
  if (!round) return null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full text-slate-500 font-bold">
        <span>
          第 {roundIndex + 1} / {rounds.length} 组
        </span>
        {combo >= 2 && <span className="text-orange-500 animate-pop">🔥 连击 x{combo}</span>}
      </div>
      <div className="grid grid-cols-4 gap-3 w-full">
        {tiles.map((tile) => {
          const isGone = eliminated.has(tile.key)
          const isSelected = selected === tile.key
          const isWrong = wrongKeys.has(tile.key)
          return (
            <button
              key={tile.key}
              onClick={() => pickTile(tile)}
              disabled={isGone}
              className={`aspect-square rounded-2xl flex items-center justify-center font-bold shadow-md border-4 transition-all
                ${isGone ? 'opacity-0 pointer-events-none' : 'bg-white'}
                ${isSelected ? 'border-amber-400 scale-95' : 'border-white'}
                ${isWrong ? 'border-rose-400 animate-shake' : ''}
                ${tile.type === 'pic' ? 'text-3xl' : 'text-sm px-1 text-center'}
              `}
            >
              {tile.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
