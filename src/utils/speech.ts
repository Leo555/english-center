// 使用浏览器内置 Web Speech API 朗读单词/句子，无需联网/无需音频素材
// 优化点：自动挑选系统中更自然、音质更好的语音（而不是默认的机械音）

let cachedVoices: SpeechSynthesisVoice[] = []
let voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!('speechSynthesis' in window)) return Promise.resolve([])
  if (voicesReadyPromise) return voicesReadyPromise

  voicesReadyPromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length > 0) {
      cachedVoices = existing
      resolve(existing)
      return
    }
    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices()
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(cachedVoices)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    // 部分浏览器（如 Safari）不一定触发 voiceschanged，兜底轮询一次
    setTimeout(() => {
      if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices()
      }
      resolve(cachedVoices)
    }, 500)
  })
  return voicesReadyPromise
}

// 页面加载时就预热一次语音列表，避免首次朗读时才去加载导致延迟
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
}

// 按音质关键词打分：优先选择听感更自然、更接近真人的语音，
// 避开明显机械音的引擎（如老式 espeak / compact 语音）
const QUALITY_HINTS = [
  'natural', 'neural', 'premium', 'enhanced', 'plus', 'siri',
  'google', 'samantha', 'ava', 'zoe', 'allison', 'nova', 'online',
]
const AVOID_HINTS = ['compact', 'espeak', 'novelty']

function pickBestVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.toLowerCase().slice(0, 2)
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  if (candidates.length === 0) return undefined

  const scored = candidates.map((v) => {
    const name = v.name.toLowerCase()
    let score = 0
    QUALITY_HINTS.forEach((h) => { if (name.includes(h)) score += 3 })
    AVOID_HINTS.forEach((h) => { if (name.includes(h)) score -= 5 })
    if (v.localService) score += 1 // 本地语音延迟更低、更稳定
    if (v.lang.toLowerCase() === lang.toLowerCase()) score += 1 // 完全匹配地区（如 en-US）优先
    if (v.default) score += 0.5
    return { v, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0].v
}

const selectedVoiceCache: Partial<Record<string, SpeechSynthesisVoice | undefined>> = {}

export async function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    if (!(lang in selectedVoiceCache)) {
      const voices = await loadVoices()
      selectedVoiceCache[lang] = pickBestVoice(voices, lang)
    }

    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.85
    u.pitch = 1.0 // 使用自然音调，避免偏高显得尖锐/机械
    const voice = selectedVoiceCache[lang]
    if (voice) u.voice = voice

    window.speechSynthesis.speak(u)
  } catch {
    // 静默失败：部分环境/浏览器不支持语音合成
  }
}
