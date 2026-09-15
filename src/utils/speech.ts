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
let primed = false

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

// 已知 Android Chrome / 国产定制浏览器（vivo、OPPO 等内核基于 Chromium）存在一个
// 长期未修复的引擎初始化 bug：一个页面/标签生命周期内，第一次调用
// speechSynthesis.speak() 会被静默吞掉、完全没有声音，从第二次调用开始才正常。
// 表现正好符合实际反馈——"只有学习模式（往往是本次会话里第一个朗读的地方）没声音，
// 后面进入的游戏/单词表都正常"，因为那些页面的朗读其实是这次会话里的"第二次及以后"调用。
// 解决办法：用一个几乎静音的哑元朗读尽早"预热"一次引擎，把这个 bug 消耗掉。
function primeSpeech() {
  if (!canSpeak() || primed) return
  primed = true
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
  } catch {
    // ignore
  }
}

if (canSpeak()) {
  // 页面加载时立即预热一次
  primeSpeech()
  if (typeof document !== 'undefined') {
    // 部分设备上，非用户手势触发的 speak() 调用可能完全不进入引擎状态机，
    // 再叠加一次"首次用户手势时预热"作为兜底
    const onFirstGesture = () => {
      primeSpeech()
      document.removeEventListener('touchstart', onFirstGesture)
      document.removeEventListener('click', onFirstGesture)
    }
    document.addEventListener('touchstart', onFirstGesture, { once: true, passive: true })
    document.addEventListener('click', onFirstGesture, { once: true })
  }
}

export function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  if (!canSpeak()) return
  try {
    // 双重保险：如果前面的预热由于某些时机问题没有真正生效，这里在真正朗读前
    // 再补发一次静音哑元 + cancel，确保"被吞掉的第一次"消耗在哑元上，而不是
    // 消耗在孩子真正要听的这句话上
    if (!primed) primeSpeech()
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
