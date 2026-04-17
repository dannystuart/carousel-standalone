"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface AccordionItem {
  title: string;
  content: string;
}

const sections: AccordionItem[] = [
  {
    title: "Start with screenshots",
    content:
      "Drop an inspiration image into Claude Code. Name your project folder. That's literally it — you've started. The AI will analyze what you shared and begin asking questions about what you want to build.",
  },
  {
    title: "Pick your fidelity",
    content:
      "Pixel-perfect recreates the design closely. Spirit of the design captures the vibe but gives you creative freedom. Springboard uses the screenshot as a jumping-off point — the final result can look completely different.",
  },
  {
    title: "Have a conversation",
    content:
      "The AI asks you questions one at a time — fonts, colors, layout, animation ideas. You pick from options, push back on things you don't like, or redirect entirely. It's a back-and-forth, not a one-shot prompt.",
  },
  {
    title: "Get a design doc",
    content:
      "All your decisions get captured in a structured design document — your blueprint. Colors, typography, layout rules, animation plans. Everything the AI needs to start building, and everything you need to stay aligned.",
  },
  {
    title: "Watch it build",
    content:
      "The AI breaks the design doc into small tasks and builds them one by one. You can watch it work, jump in with feedback at any point, or let it run. Each task gets committed separately so you can track progress.",
  },
  {
    title: "Polish together",
    content:
      'You describe what feels off — "the spacing is too tight," "that animation feels sluggish," "the colors clash." The AI fixes it. Back and forth until it feels right. You don\'t need to know CSS to give good feedback.',
  },
  {
    title: "Tips from the trenches",
    content:
      "Ask for ASCII diagrams when words fail. Make one change per feedback loop — stacking changes leads to confusion. Describe outcomes, not CSS properties (\"make it feel lighter\" not \"reduce the font-weight\"). Keep your inspiration image open while reviewing.",
  },
];

export default function GuideDrawer() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  const isFantasy = theme === "fantasy";

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-50 text-xs px-3 py-2 rounded-full backdrop-blur-md transition-colors"
        style={{
          color: isFantasy ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
          backgroundColor: isFantasy ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
          border: isFantasy ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        How this was made
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[200]"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[450px] overflow-y-auto"
              style={{
                backgroundColor: isFantasy ? "#f0ece4" : "#0a0a0f",
                color: isFantasy ? "#1a1a1a" : "#e0e0e8",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-lg font-bold font-[family-name:var(--font-fraunces)]">
                  How this was made
                </h2>
                <button
                  onClick={close}
                  className="text-2xl leading-none opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Close guide"
                >
                  &times;
                </button>
              </div>

              <p className="px-6 pb-4 text-sm opacity-60 leading-relaxed">
                This carousel was designed and built entirely through conversation with an AI coding assistant. Here&apos;s the workflow.
              </p>

              {/* Accordion */}
              <div className="px-6 pb-8">
                {sections.map((section, i) => {
                  const isExpanded = openSection === i;
                  return (
                    <div
                      key={i}
                      className="border-t"
                      style={{
                        borderColor: isFantasy ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
                      }}
                    >
                      <button
                        onClick={() => setOpenSection(isExpanded ? null : i)}
                        className="w-full flex items-center justify-between py-4 text-sm font-medium text-left"
                      >
                        <span>
                          <span className="opacity-40 mr-2">{i + 1}.</span>
                          {section.title}
                        </span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 45 : 0 }}
                          className="text-lg opacity-40"
                        >
                          +
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 text-sm opacity-70 leading-relaxed">
                              {section.content}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
