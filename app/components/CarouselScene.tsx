"use client";

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FantasyCard from "./FantasyCard";
import { useTheme } from "../context/ThemeContext";
import { fantasyCards } from "../data/fantasyCards";
import { cosmosCards } from "../data/cosmosCards";

/**
 * Returns visual style for a card at the given offset from center.
 * `directionSign` flips the diagonal: +1 = down-right (fantasy), -1 = up-left (cosmos).
 */
function getCardStyle(offset: number, mobile: boolean, directionSign: 1 | -1) {
  const absOffset = Math.abs(offset);

  if (mobile && absOffset > 1) {
    return { scale: 0.3, opacity: 0, x: offset * 200, y: 0, rotate: 0, zIndex: 0, blur: 10 };
  }

  const scale = absOffset === 0 ? 1 : absOffset === 1 ? (mobile ? 0.75 : 0.7) : 0.45;
  const opacity = absOffset === 0 ? 1 : absOffset === 1 ? (mobile ? 0.6 : 0.7) : 0.4;
  const blur = absOffset === 0 ? 0 : absOffset === 1 ? 2 : 5;
  const zIndex = 10 - absOffset * 2;

  const x = offset * (mobile ? 200 : 280);
  const y = mobile ? 0 : offset * 40 * directionSign;
  const rotate = mobile ? offset * 1.5 : offset * 2.5 * directionSign;

  return { scale, opacity, x, y, rotate, zIndex, blur };
}

// Module-scoped subscribe/snapshot for useSyncExternalStore (stable references)
function subscribeMobile(cb: () => void) {
  const mql = window.matchMedia("(max-width: 767px)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}
function subscribeReducedMotion(cb: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const serverFalse = () => false;

export default function CarouselScene() {
  const { theme } = useTheme();
  const cards = theme === "fantasy" ? fantasyCards : cosmosCards;
  const directionSign = theme === "fantasy" ? 1 : -1;

  const [activeIndex, setActiveIndex] = useState(Math.floor(cards.length / 2));
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFirstMount = useRef(true);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, serverFalse);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, serverFalse);

  // Reset to center card when theme changes (state-based render-time derivation)
  const [prevTheme, setPrevTheme] = useState(theme);
  if (prevTheme !== theme) {
    setPrevTheme(theme);
    setActiveIndex(Math.floor(cards.length / 2));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
      // Mark first mount done after entrance animation completes
      setTimeout(() => { isFirstMount.current = false; }, 400);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = useCallback((cardIndex: number) => {
    setActiveIndex(cardIndex);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => Math.min(cards.length - 1, prev + 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards.length]);

  return (
    <motion.div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      role="region"
      aria-label="Card carousel"
      aria-roledescription="carousel"
      onPanEnd={(_e, info) => {
        if (info.offset.x < -50) {
          setActiveIndex((prev) => Math.min(cards.length - 1, prev + 1));
        } else if (info.offset.x > 50) {
          setActiveIndex((prev) => Math.max(0, prev - 1));
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          const offset = index - activeIndex;
          if (Math.abs(offset) > 2) return null;

          const style = getCardStyle(offset, isMobile, directionSign);

          return (
            <motion.div
              key={card.id}
              className="absolute cursor-pointer"
              role="group"
              aria-roledescription="slide"
              aria-label={`Card ${index + 1} of ${cards.length}: ${card.title}`}
              tabIndex={offset === 0 ? 0 : -1}
              initial={isFirstMount.current ? { opacity: 0, y: 60 * directionSign } : false}
              animate={{
                x: style.x,
                y: hasLoaded ? style.y : style.y + 60 * directionSign,
                scale: style.scale,
                opacity: hasLoaded ? style.opacity : 0,
                rotate: style.rotate,
                filter: `blur(${style.blur}px)`,
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 260,
                      damping: 30,
                      mass: 1,
                      delay: hasLoaded ? 0 : Math.abs(offset) * 0.1,
                    }
              }
              style={{ zIndex: style.zIndex, perspective: 800 }}
              onClick={() => handleCardClick(index)}
            >
              <FantasyCard card={card} isActive={offset === 0} reducedMotion={reducedMotion} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
