"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { pick, type LocalizedString } from "../lib/public-data";
import type { Locale } from "../lib/models/shared";

type SiteContentDoc = {
  _id?: string;
  key: string;
  group?: string;
  value: LocalizedString | string;
};

type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: string };

export type SiteContentMap = Map<string, LocalizedString | string>;

export type UseSiteContent = {
  get: (key: string) => string | undefined;
  loading: boolean;
  ready: boolean;
};

/**
 * Fetches site content key/value docs once and returns a resolver that picks
 * the current locale. Components overlay this on top of next-intl:
 *   const c = useSiteContent();
 *   c.get('hero.description') ?? t('hero.description')
 */
export function useSiteContent(): UseSiteContent {
  const locale = useLocale() as Locale;
  const [map, setMap] = useState<SiteContentMap>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/public/content", {
          signal: ctrl.signal,
          cache: "no-store",
        });
        const json = (await res.json()) as ApiEnvelope<SiteContentDoc[]>;
        if (!aliveRef.current) return;
        if (json.ok === true && Array.isArray(json.data)) {
          const next: SiteContentMap = new Map();
          for (const d of json.data) {
            if (d && typeof d.key === "string") next.set(d.key, d.value);
          }
          setMap(next);
        }
      } catch {
        // silent — overlay is optional
      } finally {
        if (aliveRef.current) {
          setLoading(false);
          setReady(true);
        }
      }
    })();

    return () => {
      aliveRef.current = false;
      ctrl.abort();
    };
  }, []);

  return {
    get: (key: string) => {
      const v = map.get(key);
      if (v === undefined) return undefined;
      const resolved = pick(v, locale);
      return resolved || undefined;
    },
    loading,
    ready,
  };
}
