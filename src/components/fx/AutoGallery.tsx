"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Image frame that plays through a gallery on its own (crossfade + slow
 * Ken Burns zoom). Only runs while visible; hovering a `group` parent
 * advances faster. Shows small progress ticks when there are several images.
 */
export default function AutoGallery({
  images,
  alt = "",
  interval = 3200,
  offset = 0,
  className = "",
}: {
  images: string[];
  alt?: string;
  interval?: number;
  /** Stagger start so neighbouring frames don't change in sync (ms). */
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = usePrefersReducedMotion();
  const list = images.filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible || list.length < 2) return;
    const wait = hover ? 1200 : interval;
    const id = setTimeout(() => setI((n) => (n + 1) % list.length), i === 0 && !hover ? wait + offset : wait);
    return () => clearTimeout(id);
  }, [i, visible, hover, reduce, list.length, interval, offset]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AnimatePresence initial={false}>
        {list[i] && (
          <motion.img
            key={list[i]}
            src={list[i]}
            alt={alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: reduce ? 1 : 1.12 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9 }, scale: { duration: (interval + 1500) / 1000, ease: "linear" } }}
          />
        )}
      </AnimatePresence>
      {list.length > 1 && (
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-1">
          {list.map((src, n) => (
            <span
              key={src}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${n === i ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
