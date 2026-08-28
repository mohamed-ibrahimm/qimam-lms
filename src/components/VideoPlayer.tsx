'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
  Sparkles,
  Unlock,
  Check,
  Zap,
  Gauge
} from 'lucide-react';
import { formatSeconds, maskEmail } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  courseSlug: string;
  isFreePreview?: boolean;
  isEnrolled?: boolean;
  userWatermark?: {
    username: string;
    email: string;
  };
  initialWatchedSeconds?: number;
  onProgressUpdate?: (watchedSec: number, totalSec: number, percent: number, completed: boolean) => void;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const QUALITIES = ['Auto', '1080p', '720p', '480p', '360p'];

export default function VideoPlayer({
  videoUrl,
  lessonId,
  isFreePreview = false,
  isEnrolled = true,
  userWatermark,
  initialWatchedSeconds = 0,
  onProgressUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<any>(null);

  // Settings dropdown states
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'main' | 'speed' | 'quality'>('main');
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  // Dynamic Floating Watermark Coordinates
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', left: '20%' });

  // Check if URL is YouTube or Vimeo embed
  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const isVimeo = videoUrl && videoUrl.includes('vimeo.com');

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    const videoId = match ? match[3] : '';
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`;
  };

  // Resume last position
  useEffect(() => {
    if (videoRef.current && initialWatchedSeconds > 0) {
      videoRef.current.currentTime = initialWatchedSeconds;
    }
  }, [initialWatchedSeconds]);

  // Periodic Watermark Position Randomizer
  useEffect(() => {
    const wInterval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 70 + 10) + '%';
      const randomLeft = Math.floor(Math.random() * 60 + 10) + '%';
      setWatermarkPos({ top: randomTop, left: randomLeft });
    }, 12000);

    return () => clearInterval(wInterval);
  }, []);

  // Periodic progress saving
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        const curr = Math.floor(videoRef.current.currentTime);
        const dur = Math.floor(duration);
        const percent = Math.min(100, (curr / dur) * 100);
        const isCompleted = percent >= 80;

        fetch('/api/progress/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            lessonId,
            watchedSeconds: curr,
            totalSeconds: dur,
            watchedPercent: percent,
            isCompleted,
          }),
        }).catch(() => {});

        if (onProgressUpdate) {
          onProgressUpdate(curr, dur, percent, isCompleted);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lessonId, duration, onProgressUpdate]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skip(-5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skip(5);
      } else if (e.key === 'j') {
        skip(-10);
      } else if (e.key === 'l') {
        skip(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        changeVolume(Math.min(1, volume + 0.1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        changeVolume(Math.max(0, volume - 0.1));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isFullscreen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      const targetTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeVolume = (val: number) => {
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
    setSettingsTab('main');
  };

  const handleQualityChange = (q: string) => {
    setSelectedQuality(q);
    setShowSettingsMenu(false);
    setSettingsTab('main');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying && !showSettingsMenu) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  const watermarkText = userWatermark
    ? `${userWatermark.username} • ${maskEmail(userWatermark.email)}`
    : 'أكاديمية م / محمد إبراهيم';

  // If YouTube embed
  if (isYouTube) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {isFreePreview && (
          <div className="absolute top-3 right-3 z-30 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-black text-xs shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>معاينة مجانية مفتوحة</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // If Vimeo embed
  if (isVimeo) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
        <iframe
          src={getVimeoEmbedUrl(videoUrl)}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {isFreePreview && (
          <div className="absolute top-3 right-3 z-30 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-black text-xs shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>معاينة مجانية مفتوحة</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !showSettingsMenu && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 group select-none max-h-[75vh]"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer bg-black"
        playsInline
        webkit-playsinline="true"
      />

      {/* Floating Dynamic Watermark (Security Layer against screen recording) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <div
          style={{ top: watermarkPos.top, left: watermarkPos.left }}
          className="absolute px-3 py-1 rounded-full bg-black/40 text-white/40 text-[10px] font-mono border border-white/10 shadow-sm backdrop-blur-[2px] transition-all duration-1000 select-none"
        >
          {watermarkText}
        </div>
      </div>

      {/* Free Preview Floating Tag */}
      {isFreePreview && (
        <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 font-black text-xs shadow-lg flex items-center gap-1.5 backdrop-blur-md">
            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            <span>معاينة مجانية مفتوحة</span>
          </span>
        </div>
      )}

      {/* Quality Indicator Top Left */}
      <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none">
        <span className="px-2.5 py-1 rounded-lg bg-black/60 text-zinc-300 border border-zinc-700/80 font-bold text-[10px] shadow backdrop-blur-sm">
          {selectedQuality} • {playbackRate}x
        </span>
      </div>

      {/* Large Center Play Button on Pause */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-zinc-950" />
          </div>
        </div>
      )}

      {/* Controls Bar Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 sm:p-5 transition-opacity duration-300 z-30 ${
          showControls || showSettingsMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar / Seek Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-mono text-zinc-300 font-bold shrink-0">{formatSeconds(currentTime)}</span>
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-700 accent-amber-400 rounded-lg cursor-pointer hover:h-2 transition-all"
            />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 shrink-0">{formatSeconds(duration)}</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left Controls: Play, Skip, Volume */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-amber-400 transition-colors p-1"
              title={isPlaying ? 'إيقاف مؤقت (Space)' : 'تشغيل (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />}
            </button>

            {/* 10s Rewind */}
            <button
              type="button"
              onClick={() => skip(-10)}
              className="text-zinc-300 hover:text-amber-400 transition-colors p-1 relative"
              title="تأخير 10 ثوانٍ (J أو ←)"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">10</span>
            </button>

            {/* 10s Fast Forward */}
            <button
              type="button"
              onClick={() => skip(10)}
              className="text-zinc-300 hover:text-amber-400 transition-colors p-1 relative"
              title="تقديم 10 ثوانٍ (L أو →)"
            >
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">10</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="text-zinc-300 hover:text-white"
                title={isMuted ? 'إلغاء كتم الصوت (M)' : 'كتم الصوت (M)'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-20 h-1 bg-zinc-700 accent-amber-400 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls: Quality, Speed, Settings, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Speed Switcher Pill */}
            <button
              type="button"
              onClick={() => {
                const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRate);
                const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
                handleSpeedChange(PLAYBACK_SPEEDS[nextIndex]);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 flex items-center gap-1 transition-colors"
              title="الضغط للتبديل السريع بين السرعات"
            >
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>{playbackRate}x</span>
            </button>

            {/* Settings Menu Dropdown (Speed & Quality) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  setSettingsTab('main');
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showSettingsMenu
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-800/90 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title="إعدادات الفيديو (السرعة والجودة)"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Menu Panel */}
              {showSettingsMenu && (
                <div className="absolute bottom-12 left-0 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 w-48 shadow-2xl space-y-2 z-50 text-xs text-right">
                  {settingsTab === 'main' && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 pb-1 border-b border-zinc-800">
                        إعدادات العرض
                      </p>

                      {/* Speed item */}
                      <button
                        type="button"
                        onClick={() => setSettingsTab('speed')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800 text-zinc-200 transition-colors"
                      >
                        <span className="text-amber-400 font-bold font-mono">{playbackRate}x ←</span>
                        <span>سرعة التشغيل</span>
                      </button>

                      {/* Quality item */}
                      <button
                        type="button"
                        onClick={() => setSettingsTab('quality')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800 text-zinc-200 transition-colors"
                      >
                        <span className="text-amber-400 font-bold font-mono">{selectedQuality} ←</span>
                        <span>دقة العرض</span>
                      </button>
                    </div>
                  )}

                  {/* Speed submenu */}
                  {settingsTab === 'speed' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setSettingsTab('main')}
                          className="text-amber-400 font-bold text-[11px] hover:underline"
                        >
                          ← رجوع
                        </button>
                        <span className="text-[10px] font-bold text-zinc-400">اختر سرعة الفيديو</span>
                      </div>

                      {PLAYBACK_SPEEDS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSpeedChange(s)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                            playbackRate === s
                              ? 'bg-amber-500 text-black font-black'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          {playbackRate === s && <Check className="w-3.5 h-3.5" />}
                          <span className="mr-auto">{s === 1 ? 'عادي (1.0x)' : `${s}x`}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quality submenu */}
                  {settingsTab === 'quality' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setSettingsTab('main')}
                          className="text-amber-400 font-bold text-[11px] hover:underline"
                        >
                          ← رجوع
                        </button>
                        <span className="text-[10px] font-bold text-zinc-400">اختر دقة الفيديو</span>
                      </div>

                      {QUALITIES.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleQualityChange(q)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                            selectedQuality === q
                              ? 'bg-amber-500 text-black font-black'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                          <span className="mr-auto">{q}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="text-zinc-300 hover:text-white transition-colors p-1"
              title={isFullscreen ? 'تصغير الشاشة (F)' : 'شاشة كاملة (F)'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}