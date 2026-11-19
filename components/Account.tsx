"use client";
// Account page (Figma "Account — Signed out / Signed in, with orders / no orders yet", nodes 102:3, 102:174, 102:478;
// phones turn the menu into pill buttons and the orders table into cards). Sign-in is phone + SMS code
// (send-otp / verify-otp; Figma says email, the store signs in by phone). Signed in: a side menu with
// Overview (summary cards, recent orders, quotation note), Orders, Quotation requests, Addresses
// (customer-addresses: add, edit, delete, default) and Account details (name, email via update-customer-profile).
// Figma only designs Overview; the other sections are built in the same style.
import Link from "next/link";
import { useEffect, useState } from "react";
import { authApi, customerApi, getAuth, quoteListApi, saveAuth, type Address } from "@/lib/client-api";
import { money } from "@/lib/format";
import { cn } from "@/lib/cn";
import { field, input, notice } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { useQuoteList } from "./QuoteListProvider";
import { Icon } from "./SmartLink";

const A = UI.acct;
const card = "rounded-xl border border-line-3 bg-white";
const h2 = "font-head text-lg font-bold text-navy-deep";
const goldBtn = "inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-gold-btn bg-gold-btn px-[22px] text-[15px] font-bold whitespace-nowrap text-white transition hover:brightness-110 disabled:opacity-60";
const goldOutline = "inline-flex h-12 items-center justify-center rounded-lg border border-gold-btn bg-white px-[22px] text-[15px] font-bold whitespace-nowrap text-[#8a6212] transition hover:bg-gold-tint";
const chip = "inline-flex h-[22px] items-center rounded-full bg-[#eef1f6] px-[9px] text-xs font-semibold whitespace-nowrap text-[#3b4a63]";
const textLink = "text-[14.5px] font-semibold text-[#8a6212] underline underline-offset-2 hover:no-underline";

/** "out_for_delivery" → "Out for delivery". */
const pretty = (s?: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "–");
const date = (s?: string) => (s ? new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");
const orderNo = (o: any) => (String(o.order_number ?? "").startsWith("#") ? o.order_number : `#${o.order_number}`);

type Tab = "" | "orders" | "quotes" | "addresses" | "details";

export function Account({ currency, tab }: { currency: string | null; tab: string }) {
  const { refresh } = useQuoteList();
  const [auth, setAuth] = useState<ReturnType<typeof getAuth>>(null);
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  useEffect(() => {
    setAuth(getAuth());
    setReady(true);
  }, []);

  const token = auth?.session.token;
  const loadAddresses = () =>
    token &&
    customerApi
      .addresses(token)
      .then(setAddresses)
      .catch(() => setAddresses([]));

  useEffect(() => {
    if (!token) return;
    authApi
      .orders(token)
      .then((r) => setOrders(r.orders ?? []))
      .catch(() => setOrders([]));
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function signOut() {
    saveAuth(null, null);
    setAuth(null);
    setOrders(null);
    setAddresses(null);
    refresh();
  }

  if (!ready) return null;
  if (!auth) return <SignedOut onSignedIn={() => (setAuth(getAuth()), refresh())} />;

  const t = (A.menu.some(([k]) => k === tab) ? tab : "") as Tab;
  const c = auth.customer ?? {};

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
      <nav aria-label={A.menuLabel} className="flex flex-wrap gap-2 lg:block lg:overflow-hidden lg:rounded-xl lg:border lg:border-line-3 lg:bg-white">
        {A.menu.map(([k, label]) => (
          <Link
            key={k}
            href={k ? `/account?tab=${k}` : "/account"}
            aria-current={t === k ? "page" : undefined}
            className={cn(
              "flex h-10 items-center rounded-full border px-4 text-[14.5px] text-navy-deep transition lg:h-[49px] lg:rounded-none lg:border-0 lg:border-b lg:border-line-3 lg:px-5",
              t === k ? "border-gold-btn bg-[#fbf5ea] font-bold lg:border-l-[3px] lg:border-l-gold-btn" : "border-line-3 bg-white hover:bg-surface-alt",
            )}
          >
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={signOut}
          className="flex h-10 cursor-pointer items-center rounded-full border border-line-3 bg-white px-4 text-[14.5px] text-navy-deep transition hover:bg-surface-alt lg:h-[49px] lg:w-full lg:rounded-none lg:border-0 lg:px-5"
        >
          {UI.signOut}
        </button>
      </nav>

      <div className="grid min-w-0 gap-4">
        <header className="mb-1.5 grid gap-1.5">
          <p className="text-xs font-bold tracking-[0.1em] text-[#8a6212] uppercase">{A.eyebrow}</p>
          <h1 className="font-head text-[32px] leading-tight font-bold text-navy-deep md:text-[40px]">{A.title}</h1>
          <p className="mt-0.5 text-base text-slate">{A.intro}</p>
          {c.name && <p className="mt-1 text-sm text-slate">{A.signedInAs(c.name)}</p>}
        </header>

        {t === "" && (
          <>
            <div className="grid gap-3.5 md:grid-cols-3">
              <Summary icon="ac-orders" title={A.orders} value={orders?.length ?? "…"} text={A.ordersText} href="/account?tab=orders" />
              <Summary icon="ac-file" title={A.quotes} value="–" text={A.quotesText} href="/account?tab=quotes" />
              <Summary icon="ac-pin" title={A.addresses} value={addresses?.length ?? "…"} text={A.addressesText} href="/account?tab=addresses" />
            </div>
            <section className={cn(card, "grid p-[18px] sm:p-6")}>
              <h2 className={h2}>{A.recent}</h2>
              <Orders orders={orders?.slice(0, 5) ?? null} currency={currency} />
              {(orders?.length ?? 0) > 0 && (
                <Link href="/account?tab=orders" className={cn(textLink, "mt-3 self-start")}>
                  {A.viewAllOrders} →
                </Link>
              )}
              <p className="mt-[18px] flex items-start gap-2.5 rounded-lg bg-surface-alt px-4 py-3 text-sm text-slate">
                <span className="flex shrink-0 pt-px">
                  <Icon name="ac-info" size={16} />
                </span>
                {A.separateNote}
              </p>
            </section>
            <QuotesCard />
          </>
        )}

        {t === "orders" && (
          <section className={cn(card, "grid p-[18px] sm:p-6")}>
            <h2 className={h2}>{A.orders}</h2>
            <Orders orders={orders} currency={currency} withItems />
          </section>
        )}

        {t === "quotes" && <QuotesCard />}

        {t === "addresses" && token && <Addresses token={token} list={addresses} reload={loadAddresses} />}

        {t === "details" && token && (
          <Details
            token={token}
            customer={c}
            onSaved={(customer) => {
              saveAuth(auth.session, { ...c, ...customer });
              setAuth(getAuth());
            }}
          />
        )}
      </div>
    </div>
  );
}

function Summary({ icon, title, value, text, href }: { icon: string; title: string; value: React.ReactNode; text: string; href: string }) {
  return (
    <Link href={href} className={cn(card, "flex items-start gap-4 p-[22px] transition hover:border-[#cfd6e0] hover:shadow-card sm:p-[26px]")}>
      <span className="flex shrink-0">
        <Icon name={icon} size={22} />
      </span>
      <span className="grid gap-0.5">
        <span className="font-head text-sm font-semibold text-navy-deep">{title}</span>
        <span className="font-head text-[22px] font-bold text-navy-deep">{value}</span>
        <span className="mt-1.5 text-sm text-slate">{text}</span>
      </span>
    </Link>
  );
}

function QuotesCard() {
  return (
    <section className={cn(card, "grid gap-2 p-[18px] sm:p-6")}>
      <h2 className={h2}>{A.quotes}</h2>
      <p className="max-w-[630px] text-[15px] leading-[1.55] text-slate">{A.quotesInfo}</p>
      <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
        <Link href="/quote" className={goldBtn}>
          {A.startQuote}
          <Icon name="ac-arrow-white" size={14} />
        </Link>
        <Link href="/contact" className={goldOutline}>
          {A.contactTeam}
        </Link>
      </div>
    </section>
  );
}

/** Orders table (Figma "Orders table"); on phones each order is a small card. withItems adds the product lines. */
function Orders({ orders, currency, withItems }: { orders: any[] | null; currency: string | null; withItems?: boolean }) {
  if (orders === null) return <p className="mt-3.5 text-muted">{UI.loading}</p>;
  if (!orders.length)
    return (
      <div className="mt-3.5 grid gap-4">
        <p className="text-[15px] text-slate">{A.noOrders}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/category/ready-stock-offers" className={goldBtn}>
            {A.browseReadyStock}
          </Link>
          <Link href="/products" className={goldOutline}>
            {A.buildQuoteList}
          </Link>
        </div>
      </div>
    );
  const col = "text-left text-xs font-semibold tracking-[0.06em] text-slate uppercase";
  return (
    <div className="mt-3.5">
      <div className="hidden grid-cols-[90px_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-3 border-b border-[#d5dce6] px-2 py-2.5 lg:grid">
        <span className={col}>{A.colOrder}</span>
        <span className={col}>{A.colDate}</span>
        <span className={col}>{A.colTotal}</span>
        <span className={col}>{A.colPayment}</span>
        <span className={col}>{A.colStatus}</span>
      </div>
      <ul>
        {orders.map((o) => (
          <li key={o.id} id={o.id} className="scroll-mt-6 border-b border-[#e6eaf0] py-3 lg:px-2 lg:py-0">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[14.5px] text-[#2d3b55] lg:min-h-[45px] lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <span className="text-sm font-bold text-navy-deep underline underline-offset-2">{orderNo(o)}</span>
              <span className="text-right lg:text-left">{date(o.created_at)}</span>
              <span>{money(o.total, currency)}</span>
              <span className="flex items-center justify-end gap-2 lg:justify-start">
                <span className="text-[13px] text-slate lg:hidden">{A.payment}:</span>
                <span className={chip}>{pretty(o.payment_status)}</span>
              </span>
              <span className="col-span-2 flex items-center gap-2 lg:col-span-1">
                <span className="text-[13px] text-slate lg:hidden">{A.colStatus}:</span>
                <span className={chip}>{pretty(o.status)}</span>
              </span>
            </div>
            {withItems && (o.items ?? []).length > 0 && (
              <p className="pt-1 pb-3 text-[13px] text-slate lg:pt-0">
                {A.items}: {(o.items ?? []).map((i: any) => `${i.quantity} × ${i.name}`).join(", ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const EMPTY_ADDRESS = { label: "", address: "", area_name: "", governorate_name: "", landmark: "", is_default: false };

function Addresses({ token, list, reload }: { token: string; list: Address[] | null; reload: () => unknown }) {
  const [editing, setEditing] = useState<(typeof EMPTY_ADDRESS & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setErr("");
    try {
      await fn();
      await reload();
      setEditing(null);
    } catch (e: any) {
      setErr(e?.message ?? UI.error);
    } finally {
      setBusy(false);
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const body = { ...editing, city: editing.area_name, state: editing.governorate_name };
    run(() => (editing.id ? customerApi.updateAddress(token, { ...body, id: editing.id }) : customerApi.addAddress(token, body)));
  }

  return (
    <section className={cn(card, "grid gap-4 p-[18px] sm:p-6")}>
      <h2 className={h2}>{A.addresses}</h2>
      {err && <p className={notice("err")}>{err}</p>}
      {list === null ? (
        <p className="text-muted">{UI.loading}</p>
      ) : list.length === 0 && !editing ? (
        <p className="text-[15px] text-slate">{A.noAddresses}</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className="grid content-start gap-1 rounded-lg border border-line-3 p-4 text-sm text-[#2d3b55]">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-navy-deep">
                {a.label}
                {a.is_default && <span className={chip}>{A.default}</span>}
              </p>
              <p>{a.address}</p>
              {[a.area_name || a.city, a.governorate_name].filter(Boolean).length > 0 && <p>{[a.area_name || a.city, a.governorate_name].filter(Boolean).join(", ")}</p>}
              {a.landmark && <p className="text-slate">{a.landmark}</p>}
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <button
                  type="button"
                  className={cn(textLink, "cursor-pointer text-sm")}
                  onClick={() =>
                    setEditing({
                      id: a.id,
                      label: a.label ?? "",
                      address: a.address ?? "",
                      area_name: a.area_name || a.city || "",
                      governorate_name: a.governorate_name ?? "",
                      landmark: a.landmark ?? "",
                      is_default: !!a.is_default,
                    })
                  }
                >
                  {A.edit}
                </button>
                {!a.is_default && (
                  <button type="button" disabled={busy} className={cn(textLink, "cursor-pointer text-sm")} onClick={() => run(() => customerApi.updateAddress(token, { id: a.id, is_default: true }))}>
                    {A.setDefault}
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  className="cursor-pointer text-sm text-muted underline hover:text-ink-2"
                  onClick={() => confirm(A.deleteConfirm) && run(() => customerApi.deleteAddress(token, a.id))}
                >
                  {A.delete}
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}

      {editing ? (
        <form onSubmit={save} className="grid gap-4 rounded-lg bg-surface-alt p-4 sm:p-5 md:grid-cols-2">
          <p className="font-semibold text-navy-deep md:col-span-2">{editing.id ? A.editAddress : A.addAddress}</p>
          {(
            [
              ["label", A.addressLabel, true],
              ["address", A.addressLine, true],
              ["area_name", A.city, false],
              ["governorate_name", A.region, false],
              ["landmark", A.landmark, false],
            ] as const
          ).map(([k, label, required]) => (
            <label key={k} className={cn(field, k === "address" && "md:col-span-2")}>
              <span>
                {label}
                {required && <span className="text-[#d92d20]"> *</span>}
              </span>
              <input className={input} required={required} value={editing[k]} onChange={(e) => setEditing({ ...editing, [k]: e.target.value })} />
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 md:col-span-2">
            <input type="checkbox" className="size-4 accent-[#b8862b]" checked={editing.is_default} onChange={(e) => setEditing({ ...editing, is_default: e.target.checked })} />
            {A.makeDefault}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button className={goldBtn} disabled={busy}>
              {busy ? UI.loading : A.save}
            </button>
            <button type="button" className={goldOutline} onClick={() => setEditing(null)}>
              {A.cancel}
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className={cn(goldOutline, "self-start")} onClick={() => setEditing({ ...EMPTY_ADDRESS, is_default: !list?.length })}>
          + {A.addAddress}
        </button>
      )}
    </section>
  );
}

function Details({ token, customer, onSaved }: { token: string; customer: any; onSaved: (c: any) => void }) {
  const [name, setName] = useState(customer.name ?? "");
  const [email, setEmail] = useState(customer.email ?? "");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    customerApi
      .profile(token)
      .then((r) => {
        if (!r.customer) return;
        setName((n: string) => n || r.customer.name || "");
        setEmail((e: string) => e || r.customer.email || "");
      })
      .catch(() => {});
  }, [token]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setErr("");
    try {
      const r = await customerApi.update(token, { name: name.trim(), ...(email.trim() ? { email: email.trim() } : {}) });
      onSaved(r.customer ?? { name, email });
      setState("done");
    } catch (e: any) {
      setErr(e?.message ?? UI.error);
      setState("error");
    }
  }

  return (
    <section className={cn(card, "p-[18px] sm:p-6")}>
      <h2 className={h2}>{UI.acct.menu[4][1]}</h2>
      <form onSubmit={save} className="mt-4 grid max-w-[560px] gap-4">
        <label className={field}>
          {A.name}
          <input className={input} required minLength={2} value={name} onChange={(e) => (setName(e.target.value), setState("idle"))} autoComplete="name" />
        </label>
        <label className={field}>
          {A.email}
          <input className={input} type="email" value={email} onChange={(e) => (setEmail(e.target.value), setState("idle"))} autoComplete="email" />
        </label>
        <label className={field}>
          {A.phone}
          <input className={cn(input, "bg-surface-alt")} value={customer.phone ?? ""} readOnly dir="ltr" />
          <span className="text-xs font-normal text-muted">{A.phoneNote}</span>
        </label>
        {state === "error" && <p className={notice("err")}>{err}</p>}
        {state === "done" && <p className={notice("ok")}>{A.saved}</p>}
        <button className={cn(goldBtn, "self-start")} disabled={state === "busy"}>
          {state === "busy" ? UI.loading : A.save}
        </button>
      </form>
    </section>
  );
}

/** Signed out (Figma 102:3): intro, "Sign in" (opens the phone + SMS code form) and "Build a quote list". */
function SignedOut({ onSignedIn }: { onSignedIn: () => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"phone" | "code" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr("");
    try {
      await fn();
    } catch (e: any) {
      setErr(e?.body?.error_code === "CUSTOMER_BLOCKED" ? UI.error : (e?.message ?? UI.error));
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
      onSignedIn();
    }
  }

  return (
    <div className="mx-auto grid max-w-[620px] justify-items-center gap-2.5 pt-10 text-center md:pt-[70px]">
      <p className="text-xs font-bold tracking-[0.1em] text-slate uppercase">{A.eyebrow}</p>
      <h1 className="font-head text-[32px] leading-tight font-bold text-navy-deep md:text-[40px]">{A.title}</h1>
      <p className="text-base text-slate">{A.signedOutText}</p>
      {!open ? (
        <div className="mt-[14px] flex w-full flex-col justify-center gap-3 sm:flex-row">
          <button type="button" className={goldBtn} onClick={() => setOpen(true)}>
            <Icon name="ac-user-white" size={16} />
            {UI.signIn}
          </button>
          <Link href="/products" className={goldOutline}>
            {A.buildQuoteList}
          </Link>
        </div>
      ) : (
        <form
          className={cn(card, "mt-[14px] grid w-full max-w-[440px] gap-3.5 p-5 text-left sm:p-6")}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            if (step === "phone")
              run(async () => {
                await authApi.sendOtp(phone);
                setStep("code");
              });
            else if (step === "code") run(() => verify());
            else run(() => verify(String(fd.get("name") ?? "")));
          }}
        >
          <label className={field}>
            {UI.phone}
            <input
              className={input}
              type="tel"
              required
              dir="ltr"
              placeholder="+968…"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              disabled={step !== "phone"}
              autoComplete="tel"
              autoFocus
            />
          </label>
          {step !== "phone" && (
            <label className={field}>
              {UI.verificationCode}
              <input
                className={input}
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                dir="ltr"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={step === "name"}
                autoComplete="one-time-code"
              />
            </label>
          )}
          {step === "name" && (
            <label className={field}>
              {UI.yourName}
              <input className={input} name="name" required autoComplete="name" />
            </label>
          )}
          {err && <p className={notice("err")}>{err}</p>}
          <button className={goldBtn} disabled={busy}>
            {busy ? UI.loading : step === "phone" ? UI.sendCode : UI.verify}
          </button>
        </form>
      )}
      <p className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-lg bg-surface-alt px-4 py-3 text-sm text-slate">
        <Icon name="ac-info" size={16} />
        {A.noAccountNeeded}
      </p>
    </div>
  );
}
