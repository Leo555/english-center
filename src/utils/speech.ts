// 使用浏览器内置 Web Speech API 朗读单词/句子，无需联网/无需音频素材
//
// 说明：此前尝试过"按音质关键词打分挑选最佳语音"的复杂方案，结果在 vivo 等
// 国产安卓浏览器上反而没有声音——因为这类设备的语音列表里常混有需要联网
// 才能合成的云端语音，一旦被判定为"更优"选中，而设备又无法访问对应服务器，
// 就会静默失败。参考实测在 vivo 上能正常发声的极简实现（不做任何音质打分，
// 也不做平台特判/延迟规避），只做最基础的"精确匹配 -> 前缀匹配"选音，
// 交给浏览器/系统自身处理兼容性，反而更稳。

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let voices: SpeechSynthesisVoice[] = []

function loadVoices() {
  if (!canSpeak()) return
  voices = window.speechSynthesis.getVoices()
}

if (canSpeak()) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

function pick(lang: string): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices()
  const want = lang.toLowerCase()
  return (
    voices.find((v) => v.lang.toLowerCase() === want) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(want.slice(0, 2)))
  )
}

export function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  if (!canSpeak()) return
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    // 单词稍快更干脆，句子放慢一点便于孩子跟读听清每个音节
    u.rate = text.trim().includes(' ') ? 0.8 : 0.9
    u.pitch = 1.0
    const v = pick(lang)
    if (v) u.voice = v
    window.speechSynthesis.speak(u)
  } catch {
    // 静默失败：部分环境/浏览器不支持语音合成
  }
}
