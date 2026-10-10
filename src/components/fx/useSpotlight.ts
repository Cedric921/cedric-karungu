"use client";

import type React from "react";

/** Pointer handler that feeds --mx/--my to a `.spotlight` element. */
export function spotlightMove(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
