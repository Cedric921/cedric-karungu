"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { socialPlatformOf } from "../lib/analytics";

type EventType = "pageview" | "cv_download" | "social_click";

function visitorId(): string {
  try {
    let id = localStorage.getItem("ck_vid");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("ck_vid", id);
    }
    return id;
  } catch {
    return "anonymous-session";
  }
}

/** The referrer is only meaningful on the first page of a visit. */
function firstReferrer(): string {
  try {
    if (sessionStorage.getItem("ck_ref_sent")) return "";
    sessionStorage.setItem("ck_ref_sent", "1");
  } catch {
    // storage blocked: send it every time, the server keeps the host only
  }
  return document.referrer;
}

function send(type: EventType, extra: { target?: string; referrer?: string } = {}) {
  const path = window.location.pathname;
  const body = JSON.stringify({ type, visitorId: visitorId(), path, locale: path.split("/")[1], ...extra });
  const blob = new Blob([body], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/public/track", blob)) {
    fetch("/api/public/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

/** Counts page views, CV downloads and clicks on social links (anywhere on the public site). */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (/^\/(en|fr|es)\/admin/.test(pathname)) return;
    send("pageview", { referrer: firstReferrer() });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href;
      if (/\.pdf($|[?#])/i.test(href) && /\/document\//.test(href)) {
        send("cv_download", { target: a.getAttribute("href") ?? href });
      } else if (socialPlatformOf(href)) {
        send("social_click", { target: href });
      }
    };
    // Capture phase + auxclick: middle-clicks and links opened in a new tab count too.
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
