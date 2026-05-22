"use client";

import { useEffect, useRef, useState } from "react";

type ApiEnvelope<T> = { ok: true; data: T } | { ok: false; error: string };

export type FetchState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  fromFallback: boolean;
};

/**
 * Fetches a public API endpoint and falls back to a static value on error
 * or empty payload. Re-fetches when `endpoint` changes.
 */
export function usePublicData<T>(endpoint: string, fallback: T): FetchState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fromFallback, setFromFallback] = useState<boolean>(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    const ctrl = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(endpoint, {
          signal: ctrl.signal,
          cache: "no-store",
        });
        const json = (await res.json()) as ApiEnvelope<T>;
        if (!aliveRef.current) return;
        if (json.ok === true) {
          const payload = json.data;
          const isEmptyArray =
            Array.isArray(payload) && (payload as unknown[]).length === 0;
          if (isEmptyArray) {
            setData(fallback);
            setFromFallback(true);
          } else {
            setData(payload);
            setFromFallback(false);
          }
        } else {
          setData(fallback);
          setFromFallback(true);
        }
      } catch (e) {
        if (!aliveRef.current) return;
        setError(e instanceof Error ? e.message : "fetch error");
        setData(fallback);
        setFromFallback(true);
      } finally {
        if (aliveRef.current) setLoading(false);
      }
    })();

    return () => {
      aliveRef.current = false;
      ctrl.abort();
    };
  }, [endpoint]);

  return { data, loading, error, fromFallback };
}
