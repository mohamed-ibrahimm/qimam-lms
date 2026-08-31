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

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Pure luminance calculation
          const luma = (r * 299 + g * 587 + b * 114) / 1000;
          if (luma < 24) {
            data[i + 3] = 0; // 100% transparent background (0 white box, 0 black box, 0 halo)
          } else if (luma < 52) {
            data[i + 3] = Math.floor(((luma - 24) / 28) * 255);
          } else {
            data[i + 3] = 255;
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
      {/* Pure Transparent Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
}