'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function LumaKeyMotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Track theme changes dynamically (Light Mode vs Dark Mode)
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (video.readyState >= 2) {
        const isDark = document.documentElement.classList.contains('dark');
        const w = canvas.width;
        const h = canvas.height;
        ctx.drawImage(video, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const luma = (r * 299 + g * 587 + b * 114) / 1000;

          if (luma < 22) {
            data[i + 3] = 0; // Seamless transparent background
          } else {
            if (isDark) {
              // DARK MODE: Bright luminous neon RGB particles
              if (luma < 50) {
                data[i + 3] = Math.floor(((luma - 22) / 28) * 255);
              } else {
                data[i + 3] = 255;
              }
            } else {
              // LIGHT MODE: Deep, rich, high-contrast royal indigo & crimson tones
              // Prevents washed-out colors against light backgrounds
              const dominantColor = Math.max(r, g, b);
              if (dominantColor === r) {
                // Rich Crimson / Rose Red
                data[i] = Math.floor(r * 0.85);
                data[i + 1] = Math.floor(g * 0.15);
                data[i + 2] = Math.floor(b * 0.25);
              } else if (dominantColor === g) {
                // Deep Emerald / Teal Green
                data[i] = Math.floor(r * 0.1);
                data[i + 1] = Math.floor(g * 0.7);
                data[i + 2] = Math.floor(b * 0.45);
              } else {
                // Deep Royal Blue / Sapphire
                data[i] = Math.floor(r * 0.2);
                data[i + 1] = Math.floor(g * 0.25);
                data[i + 2] = Math.floor(b * 0.9);
              }
              // Strong solid opacity for clean crisp outline on light backgrounds
              data[i + 3] = Math.min(255, Math.floor((luma / 55) * 255) + 60);
            }
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      animId = requestAnimationFrame(render);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] aspect-square flex items-center justify-center pointer-events-none select-none">
      {/* Hidden local video source */}
      <video
        ref={videoRef}
        src="/assets/motion-art.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden"
      />
      {/* Dynamic Adaptive Canvas (Crystal crisp in Light & Dark Mode) */}
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
}