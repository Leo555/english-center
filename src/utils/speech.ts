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
// 注意：'google'/'online' 故意不在列表里——这类通常是需要联网请求 Google
// 服务器合成的"云端语音"，在国内大量无 GMS 的安卓机（vivo/OPPO/华为等）上
// 网络不可达，调用会完全静默失败（不报错也不出声），千万不能给它们加分。
const QUALITY_HINTS = [
  'natural', 'neural', 'premium', 'enhanced', 'plus', 'siri',
  'samantha', 'ava', 'zoe', 'allison', 'nova',
  // Edge/Windows 神经网络语音常见命名（如 "Microsoft AriaOnline (Natural)"）
  'aria', 'jenny', 'guy', 'davis', 'sara', 'christopher', 'wavenet', 'neural2',
]
const AVOID_HINTS = ['compact', 'espeak', 'novelty']

function pickBestVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const prefix = lang.toLowerCase().slice(0, 2)
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  if (candidates.length === 0) return undefined

  const scored = candidates.map((v) => {
    const name = v.name.toLowerCase()
    let score = 0
    // 是否需要联网才能合成的语音（Android 上 name 常带 "network"，且非 localService）。
    // 这类语音一旦无法访问对应服务器就会完全静默失败，权重必须远高于其他所有因素，
    // 确保能正常发声的本地语音永远优先于"听起来更好但可能用不了"的云端语音。
    if (v.localService) score += 10
    else score -= 3
    QUALITY_HINTS.forEach((h) => { if (name.includes(h)) score += 3 })
    AVOID_HINTS.forEach((h) => { if (name.includes(h)) score -= 5 })
    if (v.lang.toLowerCase() === lang.toLowerCase()) score += 1 // 完全匹配地区（如 en-US）优先
    if (v.default) score += 0.5
    return { v, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0].v
}

const selectedVoiceCache: Partial<Record<string, SpeechSynthesisVoice | undefined>> = {}
let voicesPrimed = false

// 提前把常用语言的最佳语音选好并缓存，避免真正朗读时才异步等待——
// 因为"等待"会打断用户手势的调用栈，导致部分安卓浏览器判定为非用户触发而静默拦截
async function primeVoices() {
  if (voicesPrimed) return
  voicesPrimed = true
  const voices = await loadVoices()
  ;(['en-US', 'zh-CN'] as const).forEach((lang) => {
    selectedVoiceCache[lang] = pickBestVoice(voices, lang)
  })
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  primeVoices()
}

// vivo/oppo/华为等厂商内置浏览器多基于旧版 WebView 内核，对语音合成执行了
// 与自动播放同等严格的"必须在用户手势的同一调用栈内同步触发"策略：
// 中间只要有 await/setTimeout 之类的异步间隔，就会被判定为非用户触发而静默无声。
// 桌面 Chrome 则相反，存在 cancel() 后立刻 speak() 偶发不出声的已知 bug，
// 需要错开一个宏任务才稳定——因此这里按平台区分处理方式。
const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)

export function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  try {
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    // 部分安卓浏览器在页面切后台或空闲一段时间后会让 speechSynthesis 卡在
    // paused 状态，导致后续 speak 静默无声，先尝试恢复
    if (synth.paused) synth.resume()
    synth.cancel()

    const voice = selectedVoiceCache[lang]
    if (!voice && !voicesPrimed) primeVoices() // 兜底：正常情况下页面加载时已完成选音

    let fallbackTried = false
    const buildUtterance = (useVoice: boolean) => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      // 单词 vs 句子分别调速：单词稍快更干脆，句子放慢一点便于孩子跟读听清每个音节
      u.rate = text.trim().includes(' ') ? 0.8 : 0.92
      u.pitch = 1.0 // 使用自然音调，避免偏高显得尖锐/机械
      if (useVoice && voice) u.voice = voice
      // 万一选中的 voice 是需要联网的云端语音、在当前设备/网络下不可用，
      // 会触发 error 事件而不是静默成功——此时立即改用系统默认语音（不指定 voice）重试一次
      u.onerror = () => {
        if (fallbackTried || !useVoice || !voice) return
        fallbackTried = true
        synth.speak(buildUtterance(false))
      }
      return u
    }

    if (isAndroid) {
      // 安卓平台不需要 setTimeout 规避 Chrome 的竞态 bug，
      // 且必须同步调用才能保留用户手势上下文，否则会静默无声
      synth.speak(buildUtterance(true))
    } else {
      // Chrome 桌面端：用一个 0ms 的宏任务错开 cancel/speak，规避已知竞态问题
      setTimeout(() => synth.speak(buildUtterance(true)), 0)
    }
  } catch {
    // 静默失败：部分环境/浏览器不支持语音合成
  }
}
