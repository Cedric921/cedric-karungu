"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedBackground from "./AnimatedBackground";
import CursorGlow from "./CursorGlow";
import ScrollProgress from "./ScrollProgress";
import SmoothScroll, { scrollToTarget } from "./motion/SmoothScroll";
import Cursor from "./motion/Cursor";
import Preloader from "./motion/Preloader";
import { Icons } from "../constants";

/** Shared public chrome: theme, smooth scroll, cursor, nav, footer. */
export default function SiteShell({
  children,
  preloader = false,
}: {
  children: React.ReactNode;
  preloader?: boolean;
}) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setShowScrollUp(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-accent-500/30 selection:text-accent-900 dark:selection:text-white overflow-x-clip">
      <SmoothScroll />
      {preloader && <Preloader />}
      <ScrollProgress />
      <AnimatedBackground />
      <CursorGlow />
      <Cursor />
      <Navbar theme={theme} toggleTheme={() => setTheme((p) => (p === "dark" ? "light" : "dark"))} />
      <main>{children}</main>
      <Footer />

      <motion.button
        onClick={() => scrollToTarget(0)}
        className="fixed bottom-8 right-8 p-3 rounded-full bg-accent-600 text-white shadow-lg hover:bg-accent-500 transition-colors duration-300 z-40"
        animate={{
          y: showScrollUp ? 0 : 100,
          opacity: showScrollUp ? 1 : 0,
          pointerEvents: showScrollUp ? "auto" : "none",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <Icons.ArrowUp />
      </motion.button>
    </div>
  );
}
