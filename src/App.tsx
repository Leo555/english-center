import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { GameType } from './types'
import { findLevel, findUnit, getAllUnits } from './data/levels'
import { findVideo } from './data/videos'
import { useProgress } from './store/useProgress'
import { useUsers } from './store/useUsers'
import { hasStoredProgress, VIDEO_PROGRESS_STORAGE_PREFIX } from './store/userSession'
import Home from './components/Home'
import LevelMap from './components/LevelMap'
import VocabList from './components/VocabList'
import UnitHub from './components/UnitHub'
import LearnMode from './components/learn/LearnMode'
import GamePlayer from './components/games/GamePlayer'
import GameResult from './components/games/GameResult'
import ReviewMode from './components/review/ReviewMode'
import CreateProfile from './components/onboarding/CreateProfile'
import CloudRestore from './components/onboarding/CloudRestore'
import VideoZone from './components/videos/VideoZone'
import VideoPlayer from './components/videos/VideoPlayer'
import SpeechFallbackBanner from './components/common/SpeechFallbackBanner'
import BindPhoneDialog from './components/common/BindPhoneDialog'

interface GameResultState {
  stars: number
  correct: number
  total: number
  unlockedNext: boolean
}

function HomeRoute() {
  const navigate = useNavigate()
  return (
    <Home
      onEnterMap={() => navigate('/map')}
      onEnterReview={() => navigate('/review')}
      onEnterVideos={() => navigate('/videos')}
    />
  )
}

function LevelMapRoute() {
  const navigate = useNavigate()
  const { levelId } = useParams()
  return (
    <LevelMap
      levelId={levelId}
      onSelectLevel={(id) => navigate(`/map/${id}`)}
      onEnterUnit={(unitId) => navigate(`/unit/${unitId}`)}
      onViewVocab={(id) => navigate(`/map/${id}/words`)}
      onBack={() => navigate(levelId ? '/map' : '/')}
    />
  )
}

function VocabListRoute() {
  const navigate = useNavigate()
  const { levelId = '' } = useParams()
  if (!findLevel(levelId)) return <Navigate to="/map" replace />
  return <VocabList levelId={levelId} onBack={() => navigate(`/map/${levelId}`)} />
}

function UnitRoute() {
  const navigate = useNavigate()
  const { unitId = '' } = useParams()
  const unit = findUnit(unitId)
  if (!unit) return <Navigate to="/map" replace />
  return (
    <UnitHub
      unitId={unitId}
      onLearn={() => navigate(`/unit/${unitId}/learn`)}
      onPlay={(gameType) => navigate(`/unit/${unitId}/game/${gameType}`)}
      onBack={() => navigate(`/map/${unit.levelId}`)}
    />
  )
}

function LearnRoute() {
  const navigate = useNavigate()
  const markLearned = useProgress((s) => s.markLearned)
  const { unitId = '' } = useParams()
  const unit = findUnit(unitId)
  if (!unit) return <Navigate to="/map" replace />
  return (
    <LearnMode unit={unit} onDone={() => markLearned(unitId)} onBack={() => navigate(`/unit/${unitId}`)} />
  )
}

function GameRoute() {
  const navigate = useNavigate()
  const { unitId = '', gameType = '' } = useParams()
  const recordAnswer = useProgress((s) => s.recordAnswer)
  const setGameStars = useProgress((s) => s.setGameStars)
  const [gameResult, setGameResult] = useState<GameResultState | null>(null)

  const unit = findUnit(unitId)
  const isValidGameType = gameType === 'picture' || gameType === 'match' || gameType === 'elim'
  if (!unit || !isValidGameType) return <Navigate to="/map" replace />
  const gt = gameType as GameType

  if (gameResult) {
    return (
      <GameResult
        stars={gameResult.stars}
        correct={gameResult.correct}
        total={gameResult.total}
        unlockedNext={gameResult.unlockedNext}
        onRetry={() => setGameResult(null)}
        onBack={() => navigate(`/unit/${unitId}`)}
        backLabel="返回单元"
      />
    )
  }

  return (
    <GamePlayer
      gameType={gt}
      words={unit.words}
      onAnswer={(wordId, correct) => recordAnswer(wordId, unit.levelId, unit.id, correct)}
      onExit={() => navigate(`/unit/${unitId}`)}
      onFinish={(stars, correct, total) => {
        const allUnits = getAllUnits()
        const idx = allUnits.findIndex((u) => u.id === unit.id)
        const nextUnit = allUnits[idx + 1]
        const wasUnlocked = nextUnit ? useProgress.getState().isUnitUnlocked(nextUnit.id) : true
        setGameStars(unit.id, gt, stars)
        const isUnlockedNow = nextUnit ? useProgress.getState().isUnitUnlocked(nextUnit.id) : true
        setGameResult({ stars, correct, total, unlockedNext: !wasUnlocked && isUnlockedNow })
      }}
    />
  )
}

function ReviewRoute() {
  const navigate = useNavigate()
  return <ReviewMode onBack={() => navigate('/')} />
}

function VideoZoneRoute() {
  const navigate = useNavigate()
  return <VideoZone onBack={() => navigate('/')} onOpenVideo={(videoId) => navigate(`/videos/${videoId}`)} />
}

function VideoPlayerRoute() {
  const navigate = useNavigate()
  const { videoId = '' } = useParams()
  if (!findVideo(videoId)) return <Navigate to="/videos" replace />
  return <VideoPlayer videoId={videoId} onBack={() => navigate('/videos')} />
}

function OnboardingRoute() {
  const [mode, setMode] = useState<'create' | 'restore'>('create')

  if (mode === 'restore') {
    return <CloudRestore onDone={() => {}} onCancel={() => setMode('create')} />
  }

  return (
    <>
      <CreateProfile mode="onboarding" />
      <div className="text-center mt-4">
        <button onClick={() => setMode('restore')} className="text-sm text-slate-400 underline">
          ☁️ 已绑定过手机号？点此找回学习进度
        </button>
      </div>
    </>
  )
}

// ============================================================================
// ⚠️ 临时迁移逻辑（TEMPORARY MIGRATION CODE）—— 手机号改为必填之前的存量用户补录
// ----------------------------------------------------------------------------
// 背景：手机号云同步上线初期是选填的，一部分老用户已经在本机积累了学习进度，
// 但资料上并没有绑定手机号，云端完全没有这些人的存档。
// 现在新建资料时手机号已改为必填（见 CreateProfile.tsx），但"必填"只对新建
// 资料生效，无法覆盖这些已经存在的老资料——他们不会再经过 CreateProfile 页面。
// 所以这里加一个启动时的强制补录弹窗：只要当前资料"本地已有学习进度/视频进度
// 数据，但没有绑定手机号"，就弹出手机号绑定框（背景点击/无操作都不可关闭），
// 绑完后立即触发一次云端同步（bindPhone 内部已包含 syncNow 逻辑），把这份老
// 数据补传上去。全新创建的空资料不会触发（因为在 CreateProfile 里已经强制填过手机号）。
//
// 何时可以删除：等这次改动上线并稳定运行一段时间、老用户基本都补录完手机号后，
// 直接删除 <LegacyPhoneMigrationGate /> 这个组件定义、以及下面在 App() 里对它的
// 渲染即可，不需要保留（新建资料从创建时起就必然有手机号，不会再产生"本地有
// 进度但没绑手机号"的存量用户）。
// ============================================================================
function hasAnyLocalData(userId: string): boolean {
  if (hasStoredProgress(userId)) return true
  try {
    return localStorage.getItem(`${VIDEO_PROGRESS_STORAGE_PREFIX}:${userId}`) != null
  } catch {
    return false
  }
}

function LegacyPhoneMigrationGate() {
  const profile = useUsers((s) => s.getCurrentProfile())
  const bindPhone = useUsers((s) => s.bindPhone)

  if (!profile || profile.phone) return null
  if (!hasAnyLocalData(profile.id)) return null

  return (
    <BindPhoneDialog
      open
      onConfirm={(phone) => bindPhone(profile.id, phone)}
      onCancel={() => {
        // 有意留空：手机号必填，不允许跳过；点击背景/取消都不会关闭弹窗，
        // 弹窗会在 profile.phone 变为非空后（即绑定成功）随下一次渲染自动消失。
      }}
    />
  )
}

export default function App() {
  const currentUserId = useUsers((s) => s.currentUserId)

  // 首次进入或所有账号都被删除时，先引导用户创建/输入昵称，再进入闯关地图
  if (!currentUserId) {
    return (
      <div className="min-h-screen w-full px-4 py-6 pb-16">
        <div className="max-w-lg mx-auto">
          <OnboardingRoute />
        </div>
      </div>
    )
  }

  return (
    <HashRouter>
      <div className="min-h-screen w-full px-4 py-6 pb-16">
        <SpeechFallbackBanner />
        <LegacyPhoneMigrationGate />
        <div className="max-w-lg mx-auto">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/map" element={<LevelMapRoute />} />
            <Route path="/map/:levelId" element={<LevelMapRoute />} />
            <Route path="/map/:levelId/words" element={<VocabListRoute />} />
            <Route path="/unit/:unitId" element={<UnitRoute />} />
            <Route path="/unit/:unitId/learn" element={<LearnRoute />} />
            <Route path="/unit/:unitId/game/:gameType" element={<GameRoute />} />
            <Route path="/review" element={<ReviewRoute />} />
            <Route path="/videos" element={<VideoZoneRoute />} />
            <Route path="/videos/:videoId" element={<VideoPlayerRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}
