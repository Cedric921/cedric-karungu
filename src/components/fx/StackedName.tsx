"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * "Full-stack" name: the heading is drawn as three stacked layers — DB
 * (outline), API (accent) and UI (solid) — like an exploded architecture
 * diagram. They start apart and click together on load, separate when the
 * pointer moves over them, and fan out again as the hero scrolls away.
 */
export default function StackedName({ lines, className = "" }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const px = useMotionValue(0); // pointer offset from centre, -1..1
  const py = useMotionValue(0);
  const intro = useMotionValue(1); // 1 = exploded; set to 0 after mount
  const hover = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollOpen = useTransform(scrollY, [0, 450], [0, 1], { clamp: true });

  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const sIntro = useSpring(intro, { stiffness: 55, damping: 12 });
  const sHover = useSpring(hover, { stiffness: 140, damping: 20 });
  const open = useTransform([sIntro, sHover, scrollOpen] as MotionValue<number>[], ([a, b, c]: number[]) =>
    reduce ? 0 : Math.min(1.4, a + b * 0.8 + c),
  );

  useEffect(() => {
    const t = setTimeout(() => intro.set(0), 450);
    return () => clearTimeout(t);
  }, [intro]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
    hover.set(1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  const words = lines.map((l) => (
    <span key={l} className="block w-fit">
      {l}
    </span>
  ));

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative w-fit">
      {/* The real heading is the UI layer: in flow, gives the block its size. */}
      <Layer depth={-2} open={open} sx={sx} sy={sy} tag="DB" className={`${className} text-transparent [-webkit-text-stroke:1.5px_rgb(var(--ink)/0.4)]`}>
        {words}
      </Layer>
      <Layer depth={-1} open={open} sx={sx} sy={sy} tag="API" className={`${className} text-accent-500`}>
        {words}
      </Layer>
      <Layer depth={0} open={open} sx={sx} sy={sy} tag="UI" className={`${className} text-ink`} heading>
        {words}
      </Layer>
    </div>
  );
}

function Layer({
  children,
  depth,
  open,
  sx,
  sy,
  tag,
  className,
  heading,
}: {
  children: React.ReactNode;
  depth: number;
  open: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  tag: string;
  className: string;
  heading?: boolean;
}) {
  // Deeper layers shift further down-right and lean away from the pointer.
  const x = useTransform([open, sx] as MotionValue<number>[], ([o, p]: number[]) => -depth * (o * 22 - p * 8 * o));
  const y = useTransform([open, sy] as MotionValue<number>[], ([o, p]: number[]) => -depth * (o * 16 - p * 6 * o));
  const labelOpacity = useTransform(open, [0.2, 0.6], [0, 1]);
  const labelY = useTransform(open, [0, 1], [6, 0]);
  const Tag = heading ? motion.h1 : motion.div;

  return (
    <Tag
      aria-hidden={heading ? undefined : true}
      style={{ x, y, zIndex: 3 + depth }}
      className={`select-none ${heading ? "relative" : "pointer-events-none absolute left-0 top-0"} ${className}`}
    >
      {children}
      <motion.span
        aria-hidden="true"
        style={{ opacity: labelOpacity, y: labelY }}
        className="absolute -right-3 bottom-[18%] translate-x-full whitespace-nowrap rounded border border-line/15 bg-canvas px-1.5 py-0.5 font-mono text-[10px] font-normal tracking-[0.15em] text-muted [-webkit-text-stroke:0]"
      >
        {tag}
      </motion.span>
    </Tag>
  );
}
