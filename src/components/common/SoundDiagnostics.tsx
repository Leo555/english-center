import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

// 临时诊断工具：把声音相关的环境信息和实测结果直观地展示出来，
// 方便在无法连接远程调试的手机（如 vivo）上直接截图反馈，定位"没有声音"的真实原因。
export default function SoundDiagnostics({ open, onClose }: Props) {
  const [log, setLog] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  if (!open) return null

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window
  const voices = hasSpeech ? window.speechSynthesis.getVoices() : []
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const hasAudioContext =
    typeof window !== 'undefined' &&
    !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext)

  function appendLog(line: string) {
    setLog((l) => [...l, `${new Date().toLocaleTimeString()} ${line}`])
  }

  function testSpeak() {
    setTesting(true)
    setLog([])
    appendLog(`speechSynthesis 存在: ${hasSpeech}`)
    appendLog(`voices 数量: ${voices.length}`)
    if (!hasSpeech) {
      appendLog('❌ 当前浏览器不支持 speechSynthesis，无法朗读')
      setTesting(false)
      return
    }
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance('hello')
      u.lang = 'en-US'
      u.volume = 1
      u.onstart = () => appendLog('✅ onstart 已触发（浏览器认为已开始播放）')
      u.onend = () => {
        appendLog('✅ onend 已触发（播放正常结束）')
        setTesting(false)
      }
      u.onerror = (e) => {
        appendLog(`❌ onerror 已触发: ${(e as SpeechSynthesisErrorEvent).error ?? '未知错误'}`)
        setTesting(false)
      }
      appendLog('调用 speechSynthesis.speak(...) ...')
      window.speechSynthesis.speak(u)
      setTimeout(() => {
        appendLog(`speaking 状态: ${window.speechSynthesis.speaking}, pending: ${window.speechSynthesis.pending}`)
      }, 300)
      setTimeout(() => {
        setTesting(false)
        appendLog('（3 秒超时，若上面没有 onstart/onend/onerror，说明浏览器完全没有响应调用）')
      }, 3000)
    } catch (err) {
      appendLog(`❌ 调用抛出异常: ${String(err)}`)
      setTesting(false)
    }
  }

  function testBeep() {
    appendLog('--- 测试 Web Audio 音效 ---')
    appendLog(`AudioContext 支持: ${hasAudioContext}`)
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) {
        appendLog('❌ 不支持 AudioContext')
        return
      }
      const ctx = new AC()
      appendLog(`AudioContext state: ${ctx.state}`)
      ctx.resume().then(() => appendLog(`resume 后 state: ${ctx.state}`))
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      gain.gain.value = 0.3
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
      appendLog('已调用 oscillator.start()，若听到 "嘟" 声即为正常')
    } catch (err) {
      appendLog(`❌ 调用抛出异常: ${String(err)}`)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-bold text-lg text-slate-700 text-center mb-3">🔊 声音诊断</div>

        <div className="text-xs text-slate-500 break-all bg-slate-50 rounded-xl p-2 mb-3">{ua}</div>

        <div className="text-sm text-slate-600 space-y-1 mb-3">
          <div>speechSynthesis 支持：{String(hasSpeech)}</div>
          <div>语音列表数量：{voices.length}</div>
          <div>AudioContext 支持：{String(hasAudioContext)}</div>
        </div>

        {voices.length > 0 && (
          <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-2 mb-3 max-h-28 overflow-y-auto">
            {voices.map((v, i) => (
              <div key={i}>
                {v.name} | {v.lang} | local:{String(v.localService)}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <button
            disabled={testing}
            onClick={testSpeak}
            className="flex-1 bg-amber-400 text-white font-bold rounded-xl py-2 disabled:opacity-50"
          >
            测试朗读
          </button>
          <button onClick={testBeep} className="flex-1 bg-sky-400 text-white font-bold rounded-xl py-2">
            测试音效
          </button>
        </div>

        <div className="text-xs font-mono bg-slate-900 text-emerald-300 rounded-xl p-2 min-h-[100px] max-h-56 overflow-y-auto whitespace-pre-wrap">
          {log.length === 0 ? '点击上方按钮开始测试...' : log.join('\n')}
        </div>

        <button onClick={onClose} className="w-full mt-3 rounded-2xl border-2 border-slate-200 py-2 font-bold text-slate-400">
          关闭
        </button>
      </div>
    </div>
  )
}
