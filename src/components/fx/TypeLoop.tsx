"use client";

import React, { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Types each phrase, holds, deletes it, moves to the next — with a block
 * caret. Screen readers get the full list once.
 */
export default function TypeLoop({ words, className }: { words: string[]; className?: string }) {
  const reduce = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[i] ?? "";

  useEffect(() => {
    if (reduce) return;
    let delay = deleting ? 28 : 55 + Math.random() * 50;
    if (!deleting && n === word.length) delay = 1700;
    if (deleting && n === 0) delay = 250;
    const id = setTimeout(() => {
      if (!deleting && n === word.length) setDeleting(true);
      else if (deleting && n === 0) {
        setDeleting(false);
        setI((x) => (x + 1) % words.length);
      } else setN((x) => x + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(id);
  }, [n, deleting, word, words.length, reduce]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">{reduce ? words[0] : word.slice(0, n)}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[0.8em] w-[0.42em] translate-y-[0.08em] animate-pulse bg-accent-500/80 align-baseline"
      />
    </span>
  );
}
