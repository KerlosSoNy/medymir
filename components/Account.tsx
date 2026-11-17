"use client";
// Phone + SMS code login (send-otp / verify-otp), then order history and points.
import { useEffect, useState } from "react";
import { authApi, quoteListApi, getAuth, saveAuth } from "@/lib/client-api";
import { money } from "@/lib/format";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { btn, field, input, linkBtn, notice } from "@/lib/styles";

const panel = "mb-4 rounded-2xl border border-line bg-white p-5 sm:p-[22px]";
import { useQuoteList } from "./QuoteListProvider";

export function Account({ currency }: { currency: string | null }) {
  const { refresh } = useQuoteList();
  const [auth, setAuth] = useState<ReturnType<typeof getAuth>>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<"phone" | "code" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [orders, setOrders] = useState<any[] | null>(null);

  useEffect(() => {
    setAuth(getAuth());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!auth) return;
    authApi
      .orders(auth.session.token)
      .then((r) => setOrders(r.orders ?? []))
      .catch(() => setOrders([]));
  }, [auth]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr("");
    try {
      await fn();
    } catch (e: any) {
      setErr(e?.body?.error_code === "CUSTOMER_BLOCKED" ? UI.error : e?.message ?? UI.error);
    } finally {
      setBusy(false);
    }
  };

  async function verify(name?: string) {
    const r = await authApi.verifyOtp(phone, code, name);
    if (r.needsName) return setStep("name");
    if (r.session && r.customer) {
      await quoteListApi.mergeIntoCustomer(r.customer.id).catch(() => {});
      saveAuth(r.session, r.customer);
      setAuth(getAuth());
      refresh();
    }
  }

  if (!ready) return null;

  if (auth) {
    const c = auth.customer ?? {};
    return (
      <div className="mb-14 md:mb-[72px]">
        <div className={cn(panel, "flex flex-wrap items-center justify-between gap-4")}>
          <div>
            <strong>{c.name}</strong>
            <div className="text-[13px] text-muted" dir="ltr">
              {c.phone}
            </div>
          </div>
          {c.loyalty_points != null && (
            <div>
              <strong>{c.loyalty_points}</strong> <span className="text-[13px] text-muted">{UI.points}</span>
            </div>
          )}
          <button
            type="button"
            className={linkBtn}
            onClick={() => {
              saveAuth(null, null);
              setAuth(null);
              setOrders(null);
              setStep("phone");
              refresh();
            }}
          >
            {UI.signOut}
          </button>
        </div>
        <h2 className="mt-8 mb-4 font-head text-xl font-bold text-ink">{UI.myQuotes}</h2>
        {orders === null ? (
          <p className="text-muted">{UI.loading}</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">{UI.noOrders}</p>
        ) : (
          <ul className="m-0 list-none p-0">
            {orders.map((o) => (
              <li key={o.id} className={cn(panel, "flex flex-col justify-between gap-3 sm:flex-row sm:gap-4")}>
                <div className="min-w-0">
                  <strong dir="ltr">{o.order_number}</strong>
                  <div className="text-[13px] text-muted">{new Date(o.created_at).toLocaleString("en-GB")}</div>
                  <div className="text-[13px]">{(o.items ?? []).map((i: any) => `${i.quantity}× ${i.name}`).join(", ")}</div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-1 sm:justify-items-end">
                  <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-bold capitalize">{o.status}</span>
                  <strong>{money(o.total, currency)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <form
      className={cn(panel, "mx-auto mb-14 grid grid-cols-1 max-w-[440px] gap-3.5 md:mb-[72px]")}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (step === "phone") run(async () => {
          await authApi.sendOtp(phone);
          setStep("code");
        });
        else if (step === "code") run(() => verify());
        else run(() => verify(String(fd.get("name") ?? "")));
      }}
    >
      <h2 className="font-head text-xl font-bold text-ink">{UI.signIn}</h2>
      <label className={field}>
        {UI.phone}
        <input className={input} type="tel" required dir="ltr" placeholder="+968…" value={phone} onChange={(e) => setPhone(e.target.value.trim())} disabled={step !== "phone"} autoComplete="tel" />
      </label>
      {step !== "phone" && (
        <label className={field}>
          {UI.verificationCode}
          <input className={input} inputMode="numeric" pattern="\d{6}" maxLength={6} required dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} disabled={step === "name"} autoComplete="one-time-code" />
        </label>
      )}
      {step === "name" && (
        <label className={field}>
          {UI.yourName}
          <input className={input} name="name" required autoComplete="name" />
        </label>
      )}
      {err && <p className={notice("err")}>{err}</p>}
      <button className={btn("dark", "md", "w-full")} disabled={busy}>
        {busy ? UI.loading : step === "phone" ? UI.sendCode : UI.verify}
      </button>
    </form>
  );
}
