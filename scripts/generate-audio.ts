// 为 L1/L2 词库预生成本地朗读音频（AAC/m4a），解决部分安卓浏览器（如 vivo）
// 完全不支持 window.speechSynthesis 导致朗读功能整体失效的问题。
//
// 用法（仅需在 macOS 上运行一次，生成的音频文件会被提交到仓库）：
//   npx esbuild scripts/generate-audio.ts --bundle --platform=node --format=cjs --outfile=/tmp/generate-audio.cjs
//   node /tmp/generate-audio.cjs
//
// 产出：
//   - public/audio/en/*.m4a          实际音频文件（AAC，64kbps，人声清晰、体积小）
//   - src/data/audioManifest.ts      文本(小写trim) -> 音频URL 的映射表，speech.ts 会优先查这个表

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { L1_UNITS } from '../src/data/levels/l1'
import { L2_UNITS } from '../src/data/levels/l2'

const OUT_DIR = path.resolve(process.cwd(), 'public/audio/en')
const MANIFEST_PATH = path.resolve(process.cwd(), 'src/data/audioManifest.ts')
const VOICE = 'Samantha' // macOS 内置美式英语女声，发音清晰自然，适合儿童英语学习
const RATE = '150' // words per minute，比默认(约180)稍慢，便于孩子跟读

fs.mkdirSync(OUT_DIR, { recursive: true })

// 收集 L1+L2 全部单词 + 例句的去重文本（key 为 trim+lowercase，避免大小写/空格重复生成）
const seen = new Map<string, string>()
function addText(raw: string) {
  const text = raw.trim()
  if (!text) return
  const key = text.toLowerCase()
  if (!seen.has(key)) seen.set(key, text)
}
for (const unit of [...L1_UNITS, ...L2_UNITS]) {
  for (const w of unit.words) {
    addText(w.en)
    addText(w.example.en)
  }
}

console.log(`共需生成 ${seen.size} 条不重复文本的音频...`)

const manifest: Record<string, string> = {}
let i = 0
let generated = 0
let skipped = 0
for (const [key, text] of seen) {
  const filename = `${i}.m4a`
  const outPath = path.join(OUT_DIR, filename)
  const relUrl = `/audio/en/${filename}`
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
    // 已生成过，跳过（支持中断后重新运行继续生成）
    manifest[key] = relUrl
    skipped++
  } else {
    try {
      execFileSync('say', [
        '-v', VOICE,
        '-r', RATE,
        '--file-format=m4af',
        '--data-format=aac',
        '--bit-rate=64000',
        '-o', outPath,
        text,
      ], { stdio: 'ignore' })
      manifest[key] = relUrl
      generated++
    } catch (err) {
      console.error(`生成失败: "${text}"`, err)
    }
  }
  i++
  if (i % 50 === 0) console.log(`进度: ${i}/${seen.size}`)
}

const content = `// 此文件由 scripts/generate-audio.ts 自动生成，请勿手动编辑。\n` +
  `// key: 单词/例句文本(trim + toLowerCase)；value: public/ 下的音频文件路径\n` +
  `export const AUDIO_MANIFEST: Record<string, string> = ${JSON.stringify(manifest, null, 2)}\n`
fs.writeFileSync(MANIFEST_PATH, content)

console.log(`完成。新生成 ${generated} 条，跳过已存在 ${skipped} 条，总计 ${i} 条。`)
console.log(`manifest 已写入: ${MANIFEST_PATH}`)
