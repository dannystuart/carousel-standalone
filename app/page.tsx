"use client";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import CarouselScene from "./components/CarouselScene";
import ThemeToggle from "./components/ThemeToggle";
import GuideDrawer from "./components/GuideDrawer";
import StarField from "./components/StarField";
import { motion, AnimatePresence } from "framer-motion";

function CarouselPage() {
  const { theme } = useTheme();

  return (
    <div className={theme === "fantasy" ? "bg-fantasy" : "bg-cosmos"}>
      {/* Background transitions */}
      <AnimatePresence>
        {theme === "cosmos" && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StarField />
          </motion.div>
        )}
      </AnimatePresence>

      <CarouselScene />
      <ThemeToggle />
      <GuideDrawer />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <CarouselPage />
    </ThemeProvider>
  );
}
