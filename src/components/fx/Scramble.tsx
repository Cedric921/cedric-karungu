"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=<>/";

/**
 * Animates `display` from its current value to `target`: characters resolve
 * left to right while the unresolved ones flicker through random glyphs.
 */
export function useScramble(initial: string, duration = 600) {
  const [display, setDisplay] = useState(initial);
  const frame = useRef<number>(0);
  const reduce = usePrefersReducedMotion();

  const run = useCallback(
    (target: string) => {
      cancelAnimationFrame(frame.current);
      if (reduce) return setDisplay(target);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const resolved = Math.floor(p * target.length);
        let out = "";
        for (let i = 0; i < target.length; i++) {
          const ch = target[i];
          out += i < resolved || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setDisplay(out);
        if (p < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [duration, reduce],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return { display, run, setDisplay };
}

/** Text that scrambles and re-resolves itself on hover / focus. */
export function ScrambleHover({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "h3";
}) {
  const { display, run, setDisplay } = useScramble(text, 450);
  useEffect(() => setDisplay(text), [text, setDisplay]);
  return (
    <Tag className={className} onMouseEnter={() => run(text)} onFocus={() => run(text)} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}

/** Cycles through `items` on a timer, scrambling between them. */
export function ScrambleCycle({
  items,
  interval = 3200,
  className,
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const { display, run, setDisplay } = useScramble(items[0] ?? "", 700);
  const key = items.join("|");

  useEffect(() => {
    setI(0);
    setDisplay(items[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setI((prev) => {
        const next = (prev + 1) % items.length;
        run(items[next]);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, interval, run]);

  return (
    <span className={className} aria-live="polite">
      <span className="sr-only">{items[i]}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
