"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

/** True once the preloader curtain has lifted (or immediately if there is none). */
export function useIntroReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__introDone || !document.querySelector("[data-preloader]")) {
      const t = setTimeout(() => setReady(true), 80);
      return () => clearTimeout(t);
    }
    const done = () => setReady(true);
    window.addEventListener("preloader:done", done);
    const fallback = setTimeout(done, 3500);
    return () => {
      window.removeEventListener("preloader:done", done);
      clearTimeout(fallback);
    };
  }, []);
  return ready;
}
