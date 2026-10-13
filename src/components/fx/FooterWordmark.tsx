"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "./useReducedMotion";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Oversized name sitting in the footer background: sized to span the full
 * width, it rises out of the bottom edge as the footer scrolls into view,
 * and letters lift toward the pointer.
 */
export default function FooterWordmark({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Fit: measure at 100px and scale so the line fills the container width.
  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    const el = textRef.current;
    if (!wrap || !el) return;
    const fit = () => {
      el.style.fontSize = "100px";
      const w = el.scrollWidth;
      const cs = getComputedStyle(wrap);
      const inner = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // Applied directly: the measurement above overwrote the inline size.
      if (w) el.style.fontSize = `${Math.floor((inner / w) * 100 * 0.99)}px`;
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [text]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    textRef.current?.querySelectorAll<HTMLSpanElement>("[data-l]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const f = Math.max(0, 1 - d / 220);
      el.style.transform = `translateY(${(-f * 0.12).toFixed(3)}em)`;
      el.style.color = f > 0.6 ? "rgb(139 92 246 / 0.35)" : "";
    });
  };
  const reset = () =>
    textRef.current?.querySelectorAll<HTMLSpanElement>("[data-l]").forEach((el) => {
      el.style.transform = "";
      el.style.color = "";
    });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="wrap relative select-none overflow-hidden"
    >
      <motion.div style={reduce ? undefined : { y, opacity }} className="translate-y-[18%]">
        <span
          ref={textRef}
          className="inline-block w-max whitespace-nowrap font-display font-extrabold leading-[0.8] tracking-[-0.045em] text-ink/[0.07]"
        >
          {[...text].map((ch, i) => (
            <span key={i} data-l className="inline-block transition-[transform,color] duration-500 ease-out">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      </motion.div>
    </div>
  );
}
