import { findLevel } from '../data/levels'
import { speak } from '../utils/speech'
import Mascot from './common/Mascot'

export default function VocabList({ levelId, onBack }: { levelId: string; onBack: () => void }) {
  const level = findLevel(levelId)

  if (!level) return null

  const totalWords = level.units.reduce((sum, u) => sum + u.words.length, 0)

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      <button onClick={onBack} className="self-start text-slate-400 font-bold">
        ⬅️ 返回地图
      </button>
      <div className="text-center">
        <div className="text-sm text-slate-400 font-bold">
          {level.name} · CEFR {level.cefr} · 剑桥 {level.cambridge}
        </div>
        <div className="text-2xl font-extrabold text-slate-700">📖 词汇表</div>
        <div className="text-xs text-slate-400 mt-1">共 {totalWords} 个单词（点击可听发音）</div>
      </div>

      <div className="flex flex-col gap-4 w-full pb-6">
        {level.units.map((u) => {
          const isDev = u.words.length === 0
          return (
            <div key={u.id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-extrabold text-slate-700">
                  第 {u.index} 关 · {u.title}
                </div>
                {u.titleEn && <div className="text-xs text-slate-400">{u.titleEn}</div>}
              </div>
              {isDev ? (
                <div className="text-xs text-slate-400">🚧 内容开发中</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {u.words.map((wd) => (
                    <button
                      key={wd.id}
                      onClick={() => speak(wd.en)}
                      className="flex items-center gap-2 bg-slate-50 hover:bg-amber-50 rounded-xl px-3 py-2 text-left transition-colors"
                    >
                      <span className="text-xl shrink-0">{wd.emoji}</span>
                      <span className="min-w-0">
                        <span className="block font-bold text-slate-700 truncate">
                          {wd.en} <span className="font-normal text-slate-400">🔊</span>
                        </span>
                        <span className="block text-xs text-slate-400 truncate">
                          {wd.ipa} {wd.cn}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalWords === 0 && <Mascot emoji="🚧" message="这个级别的词汇正在开发中，敬请期待～" size="lg" />}
    </div>
  )
}
