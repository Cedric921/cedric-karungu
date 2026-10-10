import React from "react";

/** "CK." wordmark — same mark as the favicon and social cards. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-xl font-extrabold tracking-[-0.04em] text-ink ${className}`}>
      CK<span className="text-accent-500">.</span>
    </span>
  );
}
