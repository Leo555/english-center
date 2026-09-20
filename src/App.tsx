import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { GameType } from './types'
import { findLevel, findUnit, getAllUnits } from './data/levels'
import { findVideo } from './data/videos'
import { useProgress } from './store/useProgress'
import { useUsers } from './store/useUsers'
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
