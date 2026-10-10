import React from "react";

/**
 * Hover "roll": the label slides up and an identical copy (in the accent
 * colour) rolls in from below. Needs a `group` ancestor (the link/button).
 */
export default function RollText({ children, accent = true }: { children: string; accent?: boolean }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom leading-[1.2]">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 motion-reduce:transition-none ${
          accent ? "text-accent-500" : ""
        }`}
      >
        {children}
      </span>
    </span>
  );
}
