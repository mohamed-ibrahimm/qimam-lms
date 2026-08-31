'use client';

import React, { useRef, useEffect } from 'react';

export default function LumaKeyMotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (video.readyState >= 2) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.drawImage(video, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;
        const len = data.length;

        // Auto-detect corner background luminance (from top-left pixel)
        const cornerLuma = (data[0] * 299 + data[1] * 587 + data[2] * 114) / 1000;
        const isWhiteBg = cornerLuma > 128;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const luma = (r * 299 + g * 587 + b * 114) / 1000;

          if (isWhiteBg) {
            // White background: key out white, make the Bot lines luminous white/gold
            const diff = 255 - luma;
            if (diff < 22) {
              data[i + 3] = 0; // Transparent background
            } else {
              // Glowing clean white-gold Bot icon
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
              data[i + 3] = Math.min(255, Math.floor((diff / 180) * 255));
            }
          } else {
            // Black background: key out dark
            if (luma < 18) {
              data[i + 3] = 0;
            } else if (luma < 45) {
              data[i + 3] = Math.floor(((luma - 18) / 27) * 255);
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
    <div className="relative w-full max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] aspect-square flex items-center justify-center">
      {/* Local Video Source: Grok Bot Icon Animation */}
      <video
        ref={videoRef}
        src="/assets/grok-bot.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden"
      />
      {/* Crystal Clear Transparent Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]"
      />
    </div>
  );
}