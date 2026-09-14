import { useMemo, useState } from 'react'
import type { WordItem, GameType } from '../../types'
import { GAME_META } from '../../types'
import { useProgress } from '../../store/useProgress'
import { findWord } from '../../data/levels'
import { isDue } from '../../utils/srs'
import GamePlayer from '../games/GamePlayer'
import GameResult from '../games/GameResult'
import Mascot from '../common/Mascot'
import Button from '../common/Button'

interface Session {
  gameType: GameType
  words: WordItem[]
}

export default function ReviewMode({ onBack }: { onBack: () => void }) {
  const wrongBook = useProgress((s) => s.wrongBook)
  const recordAnswer = useProgress((s) => s.recordAnswer)

  const dueWords = useMemo(() => {
    const items = Object.values(wrongBook)
      .filter((it) => isDue(it))
      .sort((a, b) => b.wrongCount - a.wrongCount || a.nextReview - b.nextReview)
      .slice(0, 12)
    return items.map((it) => findWord(it.wordId)).filter((w): w is WordItem => !!w)
  }, [wrongBook])

  const [session, setSession] = useState<Session | null>(null)
  const [result, setResult] = useState<{ stars: number; correct: number; total: number } | null>(null)

  function handleAnswer(wordId: string, correct: boolean) {
    const item = wrongBook[wordId]
    if (item) recordAnswer(wordId, item.levelId, item.unitId, correct)
  }

  if (!session) {
    const hasWrongEver = Object.keys(wrongBook).length > 0
    return (
      <div className="flex flex-col items-center gap-5 text-center w-full max-w-sm mx-auto pt-4">
        <button onClick={onBack} className="self-start text-slate-400 font-bold">
          ⬅️ 返回首页
        </button>
        {dueWords.length === 0 ? (
          <>
            <Mascot
              emoji="🌟"
              message={hasWrongEver ? '今天要复习的都做完啦，明天再来吧～' : '还没有错题哦，继续加油学习新单词吧！'}
              size="lg"
            />
            <Button onClick={onBack}>返回首页</Button>
          </>
        ) : (
          <>
            <Mascot emoji="🧠" message={`发现 ${dueWords.length} 个需要巩固的单词，选一个玩法开始吧！`} size="lg" />
            <div className="flex flex-col gap-3 w-full">
              {(Object.keys(GAME_META) as GameType[]).map((gt) => (
                <Button key={gt} variant="secondary" onClick={() => setSession({ gameType: gt, words: dueWords })}>
                  {GAME_META[gt].icon} {GAME_META[gt].name}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (result) {
    return (
      <GameResult
        stars={result.stars}
        correct={result.correct}
        total={result.total}
        onRetry={() => setResult(null)}
        onBack={() => {
          setResult(null)
          setSession(null)
        }}
        backLabel="返回复习首页"
      />
    )
  }

  return (
    <GamePlayer
      gameType={session.gameType}
      words={session.words}
      onAnswer={handleAnswer}
      onFinish={(stars, correct, total) => setResult({ stars, correct, total })}
    />
  )
}
