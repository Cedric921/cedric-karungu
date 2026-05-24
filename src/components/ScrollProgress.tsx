"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-accent-500 via-accent-400 to-highlight-500 dark:from-accent-500 dark:via-accent-300 dark:to-highlight-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
