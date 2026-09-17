import { useEffect, useState } from 'react'
import { onSpeechUnsupported } from '../../utils/speech'

// 部分设备/浏览器版本（实测某些 vivo 浏览器）压根没有实现 speechSynthesis API，
// 这种情况下朗读功能无法通过代码修复。与其让点击🔊按钮毫无反应显得"卡死"，
// 不如全局监听一次并弹出友好提示，告知用户换个浏览器即可正常使用朗读功能。
export default function SpeechFallbackBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const off = onSpeechUnsupported(() => setVisible(true))
    return off
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 w-[92%] max-w-sm rounded-2xl bg-amber-50 border-2 border-amber-300 px-4 py-3 shadow-lg flex items-start gap-2 animate-pop"
      role="alert"
    >
      <span className="text-xl leading-none">🔈</span>
      <div className="flex-1 text-sm font-bold text-amber-700">
        当前浏览器不支持朗读功能，建议用微信内置浏览器、Chrome 或 UC 浏览器打开体验完整发音～
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="关闭提示"
        className="text-amber-400 font-bold text-lg leading-none px-1"
      >
        ×
      </button>
    </div>
  )
}
