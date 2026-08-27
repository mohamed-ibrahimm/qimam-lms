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
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { formatSeconds, maskEmail } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  courseSlug: string;
  userWatermark?: {
    username: string;
    email: string;
  };
  initialWatchedSeconds?: number;
  onProgressUpdate?: (watchedSec: number, totalSec: number, percent: number, completed: boolean) => void;
}

export default function VideoPlayer({
  videoUrl,
  lessonId,
  userWatermark,
  initialWatchedSeconds = 0,
  onProgressUpdate
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
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  // Resume last position
  useEffect(() => {
    if (videoRef.current && initialWatchedSeconds > 0) {
      videoRef.current.currentTime = initialWatchedSeconds;
    }
  }, [initialWatchedSeconds]);

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
          body: JSON.stringify({
            lessonId,
            watchedSeconds: curr,
            totalSeconds: dur,
            watchedPercent: percent,
            isCompleted,
          })
        }).catch(() => {});

        if (onProgressUpdate) {
          onProgressUpdate(curr, dur, percent, isCompleted);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lessonId, duration, onProgressUpdate]);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
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
    setShowSettings(false);
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
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  const watermarkText = userWatermark
    ? `${userWatermark.username} • ${maskEmail(userWatermark.email)}`
    : 'أكاديمية قِمَم للتعليم';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
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

      {/* Floating Dynamic Watermark (Security Layer) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <div className="video-watermark absolute px-3 py-1 rounded bg-black/35 text-white/50 text-[11px] font-mono border border-white/10 shadow-sm">
          {watermarkText}
        </div>
      </div>

      {/* Large Center Play Button on Pause */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-16 h-16 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 mr-1 fill-white" />
          </div>
        </div>
      )}

      {/* Controls Bar Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] font-mono text-zinc-300">{formatSeconds(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-700 accent-primary-500 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-zinc-400">{formatSeconds(duration)}</span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary-400 transition-colors p-1"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-zinc-300 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-700 accent-primary-500 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed / Quality Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-2.5 py-1 rounded-md bg-surface-raised/80 hover:bg-surface-card text-xs font-semibold text-zinc-200 border border-border flex items-center gap-1"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{playbackRate}x</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-10 left-0 bg-surface-card border border-border rounded-xl p-2 w-32 shadow-xl space-y-1 text-xs z-50">
                  <p className="text-[10px] text-zinc-400 px-2 py-1 font-bold">سرعة التشغيل:</p>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full text-right px-2 py-1 rounded text-xs transition-colors ${
                        playbackRate === s ? 'bg-primary-600 text-white font-bold' : 'text-zinc-300 hover:bg-surface-raised'
                      }`}
                    >
                      {s === 1 ? 'عادي (1x)' : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-zinc-300 hover:text-white transition-colors p-1"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}