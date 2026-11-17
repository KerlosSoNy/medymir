"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { quoteListApi, type QuoteListResponse } from "@/lib/client-api";

interface Ctx {
  data: QuoteListResponse | null;
  count: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (p: Parameters<typeof quoteListApi.add>[0]) => Promise<void>;
  update: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

const QuoteCtx = createContext<Ctx | null>(null);

export function QuoteListProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<QuoteListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<QuoteListResponse>) => {
    setError(null);
    try {
      setData(await fn());
    } catch (e: any) {
      setError(e?.message ?? "error");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => run(quoteListApi.get).catch(() => {}), [run]);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const count = data?.items?.reduce((n, i) => n + (i.quantity ?? 0), 0) ?? 0;

  return (
    <QuoteCtx.Provider
      value={{
        data,
        count,
        loading,
        error,
        refresh,
        add: (p) => run(() => quoteListApi.add(p)),
        update: (id, q) => run(() => quoteListApi.update(id, q)),
        remove: (id) => run(() => quoteListApi.remove(id)),
        clear: async () => {
          await quoteListApi.clear().catch(() => {});
          await refresh();
        },
      }}
    >
      {children}
    </QuoteCtx.Provider>
  );
}

export function useQuoteList() {
  const c = useContext(QuoteCtx);
  if (!c) throw new Error("useQuoteList must be used inside QuoteListProvider");
  return c;
}
