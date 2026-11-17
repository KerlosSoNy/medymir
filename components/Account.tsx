"use client";
// Phone + SMS code login (send-otp / verify-otp), then order history and points.
import { useEffect, useState } from "react";
import { authApi, quoteListApi, getAuth, saveAuth } from "@/lib/client-api";
import { money } from "@/lib/format";
import { UI } from "@/lib/ui";
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
      <div className="account">
        <div className="card pad account-head">
          <div>
            <strong>{c.name}</strong>
            <div className="muted small" dir="ltr">
              {c.phone}
            </div>
          </div>
          {c.loyalty_points != null && (
            <div className="points">
              <strong>{c.loyalty_points}</strong> <span className="muted small">{UI.points}</span>
            </div>
          )}
          <button
            className="link-btn"
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
        <h2>{UI.myQuotes}</h2>
        {orders === null ? (
          <p className="muted">{UI.loading}</p>
        ) : orders.length === 0 ? (
          <p className="muted">{UI.noOrders}</p>
        ) : (
          <ul className="orders">
            {orders.map((o) => (
              <li key={o.id} className="card pad order">
                <div>
                  <strong dir="ltr">{o.order_number}</strong>
                  <div className="muted small">{new Date(o.created_at).toLocaleString("en-GB")}</div>
                  <div className="small">{(o.items ?? []).map((i: any) => `${i.quantity}× ${i.name}`).join(", ")}</div>
                </div>
                <div className="order-side">
                  <span className={`status s-${o.status}`}>{o.status}</span>
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
      className="card pad fields login"
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
      <h2>{UI.signIn}</h2>
      <label>
        {UI.phone}
        <input type="tel" required dir="ltr" placeholder="+968…" value={phone} onChange={(e) => setPhone(e.target.value.trim())} disabled={step !== "phone"} autoComplete="tel" />
      </label>
      {step !== "phone" && (
        <label>
          {UI.verificationCode}
          <input inputMode="numeric" pattern="\d{6}" maxLength={6} required dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} disabled={step === "name"} autoComplete="one-time-code" />
        </label>
      )}
      {step === "name" && (
        <label>
          {UI.yourName}
          <input name="name" required autoComplete="name" />
        </label>
      )}
      {err && <p className="notice err">{err}</p>}
      <button className="btn btn-block" disabled={busy}>
        {busy ? UI.loading : step === "phone" ? UI.sendCode : UI.verify}
      </button>
    </form>
  );
}
