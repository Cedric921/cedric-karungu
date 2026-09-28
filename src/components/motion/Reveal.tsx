"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Masked line reveal: each line slides up from behind its own clip.
 * Plays when scrolled into view, or when `play` flips true.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  play,
  as: Tag = "span",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
  as?: "span" | "h1" | "h2" | "p" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const active = (play ?? true) && inView;
  const MotionTag = motion[Tag] as typeof motion.span;

  return (
    <MotionTag ref={ref as React.Ref<HTMLSpanElement>} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={reduce ? false : { y: "110%", rotate: 2 }}
            animate={active || reduce ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * Image that wipes open (clip-path) when it enters the viewport and then
 * drifts slightly against the scroll for a parallax feel.
 */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = 40,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-parallax, parallax]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className ?? ""}`}
      initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12% round 24px)" }}
      animate={inView || reduce ? { clipPath: "inset(0% 0% 0% 0% round 16px)" } : undefined}
      transition={{ duration: 1.2, ease: EASE_OUT }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        style={{ y, scale: 1 + (parallax * 2.5) / 1000 }}
        initial={reduce ? false : { scale: 1.25 }}
        animate={inView || reduce ? { scale: 1 + (parallax * 2.5) / 1000 } : undefined}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        className={`h-full w-full object-cover ${imgClassName ?? ""}`}
      />
    </motion.div>
  );
}
