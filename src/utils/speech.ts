// 使用浏览器内置 Web Speech API 朗读单词/句子，无需联网/无需音频素材
//
// 说明：此前尝试过"按音质关键词打分挑选最佳语音""预热引擎"等方案都没能解决
// vivo 浏览器无声音的问题。最终通过声音诊断面板在真机上做了对照实验才找到
// 真正原因：诊断面板里"只设置 utterance.lang、完全不设置 utterance.voice"的
// 测试用例能正常出声；而这里一旦显式赋值 `u.voice = 某个 getVoices() 里的对象`，
// 合成就会静默失败——说明 vivo 浏览器把 JS 层拿到的 voice 对象重新绑定回原生
// TTS 引擎时存在兼容性问题。因此干脆不指定 voice，只设置 lang，交给浏览器/
// 系统自己按语言选择默认语音，兼容性反而更好。

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
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
    // 注意：故意不设置 u.voice。显式指定 voice 对象在部分国产安卓浏览器
    // （如 vivo）上会导致 speak() 静默失败，不指定则由浏览器按 lang 自动
    // 选择系统默认语音，兼容性更好、更稳定。
    window.speechSynthesis.speak(u)
  } catch {
    // 静默失败：部分环境/浏览器不支持语音合成
  }
}
