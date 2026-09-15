// 轻量游戏音效：使用 Web Audio API 实时合成短音效，无需外部音频素材，
// 零加载延迟、零体积开销，音量刻意克制，避免对孩子造成刺激。

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  // 浏览器自动播放策略：AudioContext 可能处于 suspended，需在用户手势触发的回调里 resume
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

const MASTER_VOLUME = 0.22

interface Note {
  freq: number
  start: number // 相对起始时间（秒）
  duration: number
  gain?: number
  type?: OscillatorType
}

function playNotes(notes: Note[]) {
  const audio = getCtx()
  if (!audio) return
  try {
    const now = audio.currentTime
    notes.forEach(({ freq, start, duration, gain = 1, type = 'triangle' }) => {
      const osc = audio.createOscillator()
      const gainNode = audio.createGain()
      osc.type = type
      osc.frequency.value = freq
      const t0 = now + start
      const peak = MASTER_VOLUME * gain
      gainNode.gain.setValueAtTime(0.0001, t0)
      gainNode.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
      osc.connect(gainNode)
      gainNode.connect(audio.destination)
      osc.start(t0)
      osc.stop(t0 + duration + 0.03)
    })
  } catch {
    // 静默失败：部分环境不支持 Web Audio API
  }
}

/** 答对：清脆上扬的双音，给予即时正向反馈 */
export function playCorrect() {
  playNotes([
    { freq: 987.77, start: 0, duration: 0.11, type: 'triangle' }, // B5
    { freq: 1318.51, start: 0.09, duration: 0.16, type: 'triangle' }, // E6
  ])
}

/** 答错：低沉短促的双音，提示但不刺耳，避免打击孩子的积极性 */
export function playWrong() {
  playNotes([
    { freq: 233.08, start: 0, duration: 0.14, gain: 0.85, type: 'sine' }, // A#3
    { freq: 195.99, start: 0.1, duration: 0.16, gain: 0.7, type: 'sine' }, // G3
  ])
}

/** 通关庆祝音，星级越高音阶越丰富 */
export function playWin(stars: number) {
  const fanfare: Note[] = [
    { freq: 523.25, start: 0, duration: 0.14, type: 'triangle' }, // C5
    { freq: 659.25, start: 0.12, duration: 0.14, type: 'triangle' }, // E5
    { freq: 783.99, start: 0.24, duration: 0.14, type: 'triangle' }, // G5
    { freq: 1046.5, start: 0.36, duration: 0.34, gain: 1.15, type: 'triangle' }, // C6
  ]
  if (stars >= 3) playNotes(fanfare)
  else if (stars === 2) playNotes(fanfare.slice(0, 3))
  else playNotes(fanfare.slice(0, 2))
}
