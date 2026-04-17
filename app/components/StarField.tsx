"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  radius: number;
  opacity: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate stars once with normalized coordinates
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    }

    function draw() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const star of starsRef.current) {
        ctx!.beginPath();
        ctx!.arc(
          star.x * window.innerWidth,
          star.y * window.innerHeight,
          star.radius,
          0,
          Math.PI * 2
        );
        ctx!.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
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
