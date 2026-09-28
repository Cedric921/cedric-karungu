"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;
const SESSION_KEY = "ck_preloaded";

/**
 * Intro curtain: a 000→100 counter and the name, then the panel lifts away.
 * Shown once per browser session and skipped for reduced-motion users.
 */
export default function Preloader({ name = "Cédric Karungu" }: { name?: string }) {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable: just play it */
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const duration = 1500;
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out so the count lingers near 100
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 250);
    });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      window.__introDone = true;
      window.dispatchEvent(new Event("preloader:done"));
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          data-preloader
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-surface-950 px-6 py-8 text-zinc-100 md:px-12"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          aria-hidden="true"
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            <span>Portfolio</span>
            <span>Goma · Remote</span>
          </div>
          <div className="overflow-hidden">
            <motion.p
              className="text-5xl font-bold tracking-tight md:text-8xl"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "-110%" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            >
              {name}
              <span className="text-lume">.</span>
            </motion.p>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-white/10">
              <div className="h-px bg-lume" style={{ width: `${count}%` }} />
            </div>
            <span className="font-mono text-4xl tabular-nums md:text-6xl">{String(count).padStart(3, "0")}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
