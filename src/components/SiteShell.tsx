"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InspectorCursor from "./fx/InspectorCursor";
import ScrollProgress from "./fx/ScrollProgress";

/** Public page chrome: progress bar, inspector cursor, top bar, content, footer. */
export default function SiteShell({ children }: { children: React.ReactNode; preloader?: boolean }) {
  const t = useTranslations("ui");
  return (
    <div id="top" className="relative min-h-screen overflow-x-clip bg-canvas text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-canvas">
        {t("skipToContent")}
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <InspectorCursor />
    </div>
  );
}
