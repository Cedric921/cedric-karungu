"use client";

import { useCallback, useEffect, useState } from "react";

/** Reads/writes the `dark` class on <html> (set before paint by the layout script). */
export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
