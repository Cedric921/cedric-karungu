"use client";

import { useEffect, useRef } from "react";

const GENERIC = "a, button, h1, h2, h3, img, li.chip, input, textarea, select";

/** Label shown in the overlay: the element's data-inspect, else its JSX-ish tag. */
function describe(el: Element): string {
  return el.getAttribute("data-inspect") || `<${el.tagName.toLowerCase()}>`;
}

const isComponentSized = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width * r.height < window.innerWidth * window.innerHeight * 0.45;
};

/**
 * Developer-themed cursor: hovering an element shows a DevTools-like
 * inspect overlay (dashed outline + "<h3> 320×48" label) that glides
 * from element to element. Fine pointers only; the native cursor stays.
 */
export default function InspectorCursor() {
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const tag = tagRef.current;
    if (!box || !tag) return;
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    let current: Element | null = null;
    const cur = { x: 0, y: 0, w: 0, h: 0, o: 0 };
    const tgt = { x: 0, y: 0, w: 0, h: 0, o: 0 };
    let raf = 0;

    const measure = () => {
      if (!current || !current.isConnected) {
        tgt.o = 0;
        return;
      }
      const r = current.getBoundingClientRect();
      tgt.x = r.left - 4;
      tgt.y = r.top - 4;
      tgt.w = r.width + 8;
      tgt.h = r.height + 8;
      tgt.o = 1;
      tag.textContent = `${describe(current)}  ${Math.round(r.width)}×${Math.round(r.height)}`;
    };

    const loop = () => {
      measure(); // follows scrolling / layout changes
      const k = 0.25;
      // Snap instead of gliding in from (0,0) when appearing.
      if (cur.o < 0.05 && tgt.o > 0) Object.assign(cur, { x: tgt.x, y: tgt.y, w: tgt.w, h: tgt.h });
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      cur.w += (tgt.w - cur.w) * k;
      cur.h += (tgt.h - cur.h) * k;
      cur.o += (tgt.o - cur.o) * 0.2;
      box.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      box.style.width = `${cur.w}px`;
      box.style.height = `${cur.h}px`;
      box.style.opacity = String(cur.o);
      // Keep the label inside the viewport: below the box when there is no room above.
      tag.style.top = cur.y < 28 ? "calc(100% + 6px)" : "-24px";
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;
      // Annotated components win over generic tags, unless they're section-sized.
      const tagged = t?.closest?.("[data-inspect]") ?? null;
      const generic = t?.closest?.(GENERIC) ?? null;
      current = tagged && isComponentSized(tagged) ? tagged : generic && isComponentSized(generic) ? generic : null;
    };
    const onLeave = () => (current = null);

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-md border border-dashed border-accent-500/70 bg-accent-500/[0.04] opacity-0 [@media(pointer:fine)]:block print:hidden"
    >
      <span
        ref={tagRef}
        className="absolute left-0 whitespace-nowrap rounded bg-accent-600 px-1.5 py-0.5 font-mono text-[10px] leading-4 text-white shadow-sm"
      />
    </div>
  );
}
