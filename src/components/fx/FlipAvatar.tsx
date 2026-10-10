"use client";

import React, { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useReducedMotion";

/**
 * Avatar card that flips to its "alter ego" side (monogram + nickname) on
 * hover/focus/tap, and on its own every few seconds to hint it's alive.
 */
export default function FlipAvatar({ src, alt, nickname }: { src: string; alt: string; nickname: string }) {
  const [flipped, setFlipped] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || hover) return;
    // Peek: flip for 1.6s, every 7s.
    const id = setInterval(() => {
      setFlipped(true);
      setTimeout(() => setFlipped(false), 1600);
    }, 7000);
    return () => clearInterval(id);
  }, [reduce, hover]);

  const show = hover || flipped;
  return (
    <button
      type="button"
      data-inspect="<Avatar flip />"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={() => setHover((h) => !h)}
      aria-label={alt}
      className="relative h-20 w-20 rounded-2xl [perspective:600px]"
    >
      <span
        className="absolute inset-0 rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.68,-0.3,0.32,1.3)] [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: show ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full rounded-2xl border hairline object-cover object-top [backface-visibility:hidden]"
        />
        <span className="absolute inset-0 grid place-items-center rounded-2xl bg-accent-600 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-center leading-none">
            <span className="block font-display text-2xl font-extrabold tracking-[-0.04em]">
              CK<span className="text-white/60">.</span>
            </span>
            <span className="mt-1 block font-serif text-sm italic">{nickname}</span>
          </span>
        </span>
      </span>
    </button>
  );
}
