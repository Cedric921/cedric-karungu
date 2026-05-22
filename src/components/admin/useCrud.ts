"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export function useCrud<T extends { _id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch<T[]>(endpoint);
    if (res.ok === true) {
      setItems(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (body: Partial<T>) => {
      const res = await adminFetch<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (res.ok) setItems((prev) => [...prev, res.data]);
      return res;
    },
    [endpoint],
  );

  const update = useCallback(
    async (id: string, body: Partial<T>) => {
      const res = await adminFetch<T>(`${endpoint}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (res.ok)
        setItems((prev) => prev.map((it) => (it._id === id ? res.data : it)));
      return res;
    },
    [endpoint],
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await adminFetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((it) => it._id !== id));
      return res;
    },
    [endpoint],
  );

  return { items, loading, error, reload: load, create, update, remove };
}
