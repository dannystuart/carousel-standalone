"use client";

import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isFantasy = theme === "fantasy";

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 flex items-center gap-1 rounded-full px-1 py-1 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: isFantasy ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
        border: isFantasy ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
      }}
      aria-label={`Switch to ${isFantasy ? "Cosmos" : "Fantasy"} theme`}
    >
      <span className="relative flex">
        {["Fantasy", "Cosmos"].map((label) => {
          const isSelected = (label === "Fantasy") === isFantasy;
          return (
            <span key={label} className="relative px-3 py-1.5 text-xs font-medium z-10 select-none">
              {isSelected && (
                <motion.span
                  layoutId="toggle-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: isFantasy ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className="relative"
                style={{
                  color: isSelected
                    ? isFantasy ? "#f0ece4" : "#ffffff"
                    : isFantasy ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.35)",
                }}
              >
                {label}
              </span>
            </span>
          );
        })}
      </span>
    </button>
  );
}
