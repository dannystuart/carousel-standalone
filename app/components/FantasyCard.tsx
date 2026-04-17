"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { CardItem } from "../data/fantasyCards";
import { useTheme } from "../context/ThemeContext";

const COLLAPSED_W = 340;
const COLLAPSED_H = 430;
const EXPANDED_W = 520;
const EXPANDED_H = 660;

const springCard = { type: "spring" as const, stiffness: 300, damping: 28 };

interface FantasyCardProps {
  card: CardItem;
  isActive?: boolean;
  reducedMotion?: boolean;
}

export default function FantasyCard({ card, isActive = false, reducedMotion = false }: FantasyCardProps) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (expanded) {
      video.play();
    } else {
      video.pause();
    }
  }, [expanded]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!isActive || reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }

  function handleMouseLeave() {
    setMousePos({ x: 0, y: 0 });
  }

  function handleCtaClick(e: React.MouseEvent) {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  }

  const w = expanded ? EXPANDED_W : COLLAPSED_W;
  const h = expanded ? EXPANDED_H : COLLAPSED_H;

  // Theme-driven styling
  const isFantasy = theme === "fantasy";
  const borderClass = isFantasy ? "border-2 border-[#1a1a1a]" : "border border-[rgba(150,180,255,0.15)]";
  const shadow = isFantasy
    ? isActive
      ? "0 8px 16px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.4), 0 50px 100px rgba(0,0,0,0.25)"
      : "0 10px 30px rgba(0,0,0,0.3), 0 30px 60px rgba(0,0,0,0.15)"
    : isActive
      ? "0 8px 16px rgba(100,140,255,0.08), 0 30px 60px rgba(100,140,255,0.06), 0 50px 100px rgba(100,140,255,0.04)"
      : "0 10px 30px rgba(100,140,255,0.04), 0 30px 60px rgba(100,140,255,0.02)";
  const subtitleColor = isFantasy ? "#a0a0a0" : "#707080";
  const taglineOpacity = isFantasy ? "text-white/80" : "text-blue-100/50";

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden ${borderClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isActive && !reducedMotion ? { scale: 1.03, rotateY: 2, rotateX: -1 } : undefined}
      animate={{ width: w, height: h }}
      transition={springCard}
      style={{ boxShadow: shadow, perspective: 800 }}
    >
      {/* Video background (fantasy cards only — cosmos cards have no video) */}
      {card.video && (
        <motion.video
          ref={videoRef}
          src={card.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          animate={
            isActive && !reducedMotion
              ? { x: mousePos.x * 10, y: mousePos.y * 10, scale: 1.1 }
              : { x: 0, y: 0, scale: 1.05 }
          }
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      )}

      {/* Gradient fallback (always visible on cosmos, behind video on fantasy) */}
      <div className="absolute inset-0 -z-[1]" style={{ background: card.gradient }} />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
        style={{
          height: "65%",
          background: isFantasy
            ? "linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.85) 30%, rgba(10,10,10,0.5) 55%, rgba(10,10,10,0.15) 80%, transparent 100%)"
            : "linear-gradient(to top, rgba(5,5,15,0.97) 0%, rgba(5,5,15,0.85) 30%, rgba(5,5,15,0.5) 55%, rgba(5,5,15,0.15) 80%, transparent 100%)",
        }}
      />

      {/* Tagline */}
      <span className={`absolute top-4 left-4 z-10 ${taglineOpacity} text-sm italic font-[family-name:var(--font-fraunces)]`}>
        {card.tagline}
      </span>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-4 flex flex-col gap-2">
        <div style={{ maxWidth: COLLAPSED_W - 40 }}>
          <h2 className="text-white text-2xl font-bold font-[family-name:var(--font-fraunces)] leading-tight">
            {card.title}
          </h2>
          <p className="text-sm leading-relaxed mt-2" style={{ color: subtitleColor }}>
            {card.subtitle}
          </p>
        </div>
        <button
          onClick={handleCtaClick}
          className="mt-1 self-start border border-white/30 text-white text-xs px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {expanded ? "Close" : card.cta}
        </button>
        <div className="flex items-center justify-between text-[10px] text-[#666] mt-2">
          <span>{card.brand}</span>
          <span>{card.tags.join(" + ")}</span>
        </div>
      </div>
    </motion.div>
  );
}
