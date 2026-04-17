"use client";

import { useRef, useEffect } from "react";

/**
 * Canvas-based star field for the Cosmos theme.
 * Renders ~200 tiny white dots at random positions with varying opacity.
 * Static (no animation) — purely decorative.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const starCount = 200;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const radius = Math.random() * 1.2 + 0.3;
        const opacity = Math.random() * 0.5 + 0.3; // 0.3–0.8

        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx!.fill();
      }
    }

    draw();

    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
