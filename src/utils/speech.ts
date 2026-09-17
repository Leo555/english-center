// 朗读单词/句子。
//
// 背景：真机排查发现部分安卓浏览器（尤其某些 vivo 浏览器版本）压根不存在
// window.speechSynthesis 这个 API（不是语音列表为空、不是被吞、不是选错语音，
// 是 API 本身没有），代码层面无法修复浏览器缺失的能力。
// 因此改为"本地预生成音频优先"方案：L1/L2 词库的单词与例句已用 macOS `say`
// 预先合成为 AAC 音频文件（见 scripts/generate-audio.ts），朗读时优先查
// AUDIO_MANIFEST 用 <audio> 播放，在所有设备上体验一致，不依赖浏览器 TTS
// 能力。只有文本不在 manifest 里（比如尚未预生成音频的 L3~L6）时，才回退到
// 浏览器自带的 speechSynthesis（不设置 utterance.voice，只设置 lang——
// 此前对照实验证实显式赋值 voice 会导致部分安卓浏览器静默失败）。

import { AUDIO_MANIFEST } from '../data/audioManifest'

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// 极简事件总线：当文本既没有预生成音频、又没有浏览器 TTS 能力时触发，
// 用事件而不是直接依赖 React，避免 utils 反向依赖组件层。
type Unsupported = () => void
const unsupportedListeners = new Set<Unsupported>()
export function onSpeechUnsupported(listener: Unsupported): () => void {
  unsupportedListeners.add(listener)
  return () => unsupportedListeners.delete(listener)
}

let currentAudio: HTMLAudioElement | null = null

function playLocalAudio(url: string): boolean {
  try {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    const audio = new Audio(url)
    currentAudio = audio
    // play() 返回的 Promise 在部分浏览器上可能被拒绝（如被自动播放策略拦截），
    // 这里静默捕获，不影响主流程；用户点击触发的调用一般不会被拦截。
    audio.play().catch(() => {})
    return true
  } catch {
    return false
  }
}

export function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  const trimmed = text.trim()
  if (!trimmed) return

  // 1. 优先使用本地预生成音频（目前覆盖 L1/L2 词库的单词与例句）
  if (lang === 'en-US') {
    const url = AUDIO_MANIFEST[trimmed.toLowerCase()]
    if (url && playLocalAudio(url)) return
  }

  // 2. 回退到浏览器内置 Web Speech API
  if (!canSpeak()) {
    unsupportedListeners.forEach((fn) => fn())
    return
  }
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    // 单词稍快更干脆，句子放慢一点便于孩子跟读听清每个音节
    u.rate = text.trim().includes(' ') ? 0.8 : 0.9
    u.pitch = 1.0
    // 注意：故意不设置 u.voice。显式指定 voice 对象在部分国产安卓浏览器
    // （如 vivo）上会导致 speak() 静默失败，不指定则由浏览器按 lang 自动
    // 选择系统默认语音，兼容性更好、更稳定。
    window.speechSynthesis.speak(u)
  } catch {
    // 静默失败：部分环境/浏览器不支持语音合成
  }
}
