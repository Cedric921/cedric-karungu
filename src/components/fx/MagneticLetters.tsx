"use client";

import React, { useRef } from "react";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Splits a heading into letters that rise and tint toward the accent colour
 * as the pointer passes over them, falling off with distance.
 */
export default function MagneticLetters({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    ref.current.querySelectorAll<HTMLSpanElement>("[data-l]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const f = Math.max(0, 1 - d / 160); // 0..1 influence
      el.style.transform = `translateY(${(-f * 0.12).toFixed(3)}em)`;
      el.style.color = f > 0.55 ? "rgb(139 92 246)" : "";
    });
  };
  const reset = () =>
    ref.current?.querySelectorAll<HTMLSpanElement>("[data-l]").forEach((el) => {
      el.style.transform = "";
      el.style.color = "";
    });

  const words = text.split(" ");
  return (
    <span ref={ref} className={className} onPointerMove={onMove} onPointerLeave={reset} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {[...w].map((ch, ci) => (
            <span key={ci} data-l className="inline-block transition-[transform,color] duration-300 ease-out">
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
