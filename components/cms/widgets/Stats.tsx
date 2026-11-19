// Stats / Counters (stats-counter) and our variants: chips, tabs, features, checklist, link-cards, route-cards,
// policy-menu, service-bar, steps.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { Icon, SmartLink } from "../../SmartLink";
import { card, goldOutlineBtn, noScrollbar, sideCard, sideTitle } from "../classes";
import { type P } from "./shared";

/* ---------- stats-counter variants ---------- */
const FEATURE_ICON: Record<string, string> = { search: "feature-search", "file-text": "feature-file-text", whatsapp: "feature-whatsapp" };

/** Icons for the info-page cards (Figma About), with their native size. */
const CARD_ICON: Record<string, [string, number]> = {
  cart: ["about-cart", 26],
  "file-text": ["about-file", 26],
  chat: ["about-chat", 26],
  warehouse: ["about-warehouse", 22],
  pin: ["rs-local", 24],
  quantity: ["rs-quantity", 24],
  delivery: ["rs-delivery", 24],
  quote: ["about-quote", 26],
};
const cardIcon = (name: string) => {
  const icon = CARD_ICON[name];
  return icon ? <Icon name={icon[0]} size={icon[1]} /> : null;
};
const infoCard = "rounded-xl border border-line-3 bg-white";

export function Stats({ w, ctx }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length || w.variant === "quote-next") return null; // quote-next: placed by the quote list page
  switch (w.variant) {
    case "chips":
      return (
        <div className="flex flex-col items-start gap-3 border-b border-line-2 pb-[22px] md:flex-row md:flex-wrap md:items-center">
          {w.title && <h2 className="text-[19px] font-bold text-ink-2 md:mr-[26px]">{tr(w.title)}</h2>}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {items.map((it, i) => (
              <SmartLink
                key={i}
                to={it.link}
                className="whitespace-nowrap rounded-full border border-chip-border bg-chip-bg px-4 py-2.5 text-[13px] font-medium text-ink-3 transition-colors hover:border-ink-3 hover:bg-white md:px-[22px] md:py-[11px] md:text-sm"
              >
                {tr(it.label)}
              </SmartLink>
            ))}
          </div>
        </div>
      );
    case "tabs":
      return (
        <div className={cn("-mr-4 flex gap-2 overflow-x-auto pr-4 md:mr-0 md:flex-wrap md:pr-0", noScrollbar)} role="list">
          {items.map((it, i) => (
            <SmartLink
              key={i}
              to={it.link}
              className={cn(
                "shrink-0 rounded-full border px-[17px] py-[11px] text-[13px] font-semibold transition-colors",
                i === 0 ? "border-dark bg-dark text-white" : "border-[#e3ded3] bg-[#f7f5f0] text-ink-3 hover:border-ink-3",
              )}
            >
              {tr(it.label)}
            </SmartLink>
          ))}
        </div>
      );
    case "features":
      return (
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3 lg:gap-0">
          {items.map((it, i) => (
            <div key={i} className={cn("flex items-start gap-[18px] lg:pr-6", i > 0 && "lg:border-l lg:border-line-2 lg:pl-10")}>
              {FEATURE_ICON[it.icon] && <Icon name={FEATURE_ICON[it.icon]} size={28} />}
              <div className="min-w-0 flex-1">
                <h3 className="mb-1.5 text-[17px] font-semibold text-ink-2">{tr(it.label)}</h3>
                <p className="max-w-[330px] text-sm leading-[22px] text-muted-2">{tr(it.value)}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case "checklist":
      return (
        <div className={sideCard}>
          {w.title && <h3 className={sideTitle}>{tr(w.title)}</h3>}
          <ul className="grid grid-cols-1 gap-4 text-[14.5px] text-[#3a4252]">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="grid grid-cols-1 size-[30px] shrink-0 place-items-center rounded-full bg-[#e3f4ec]">
                  <Icon name="check" size={14} />
                </span>
                {tr(it.label)}
              </li>
            ))}
          </ul>
        </div>
      );
    case "link-cards":
      // Figma About "Cards": icon, title, text and an underlined link. label = title, value = text.
      return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className={cn(infoCard, "flex flex-col px-[19px] py-[27px] md:p-[27px]")}>
              {CARD_ICON[it.icon] && <span className="grid size-11 place-items-center">{cardIcon(it.icon)}</span>}
              <h3 className="mt-2 font-head text-[17px] font-bold text-navy-deep">{tr(it.label)}</h3>
              {it.value && <p className="mt-2 text-[14.5px] leading-normal text-slate">{tr(it.value)}</p>}
              {it.linkText && (
                <SmartLink
                  to={it.link}
                  className="mt-3 self-start text-[14.5px] font-semibold text-gold-link underline underline-offset-2 hover:no-underline"
                >
                  {tr(it.linkText)} <span aria-hidden>→</span>
                </SmartLink>
              )}
            </div>
          ))}
        </div>
      );
    case "route-cards":
      // Figma About "Two ways to buy": icon in a gold square, title, text and an outlined button.
      // tone "plain" (Figma Contact "Have a product list?"): icon without the square, button with an arrow.
      {
        const plain = w.tone === "plain";
        return (
        <div className={cn("grid grid-cols-1 gap-4", items.length > 1 && "md:grid-cols-2")}>
          {items.map((it, i) => (
            <div key={i} className={cn(infoCard, "flex items-start gap-4", plain ? "p-5 md:p-[27px]" : "px-[18px] py-[26px] md:p-[26px]")}>
              {CARD_ICON[it.icon] && (
                <span className={cn("grid shrink-0 place-items-center", plain ? "size-11" : "size-10 rounded-lg bg-gold-tint")}>{cardIcon(it.icon)}</span>
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-head text-[17px] font-bold text-navy-deep">{tr(it.label)}</h3>
                {it.value && <p className={cn("leading-normal text-slate", plain ? "mt-1.5 text-[14.5px]" : "mt-2 text-[15px]")}>{tr(it.value)}</p>}
                {it.linkText && (
                  <SmartLink to={it.link} className={cn(goldOutlineBtn, plain ? "mt-4 h-12 gap-2.5 px-[22px]" : "mt-[18px]")}>
                    {tr(it.linkText)}
                    {plain && <Icon name="arrow-right-gold-14" size={14} />}
                  </SmartLink>
                )}
              </div>
            </div>
          ))}
        </div>
        );
      }
    case "service-bar":
      // Figma Ready Stock "Service bar": three promises side by side in one white box (stacked on phones).
      return (
        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#e3e8ef] bg-white md:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className={cn("flex items-start gap-3.5 px-5 py-[18px]", i > 0 && "border-t border-[#e3e8ef] md:border-t-0 md:border-l")}>
              {CARD_ICON[it.icon] && <span className="flex shrink-0">{cardIcon(it.icon)}</span>}
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-[3px]">
                <p className="text-[15px] font-semibold text-[#202b40]">{tr(it.label)}</p>
                {it.value && <p className="text-[13px] leading-[1.35] text-[#5f6b7d]">{tr(it.value)}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    case "steps":
      // Figma Ready Stock "How it works": title, then numbered steps (01, 02, 03) in one white box.
      return (
        <div className="flex flex-col gap-5 rounded-xl border border-[#e6eaf0] bg-white px-[22px] py-[22px] lg:flex-row lg:items-center lg:gap-6">
          {w.title && <h2 className="shrink-0 font-head text-[17px] font-bold text-[#202b40]">{tr(w.title)}</h2>}
          {items.map((it, i) => (
            <div key={i} className="flex min-w-0 flex-1 items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fbf1dc] text-[13px] font-bold text-[#8a6a23]">{String(i + 1).padStart(2, "0")}</span>
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-[3px]">
                <p className="text-[15px] font-semibold text-[#202b40]">{tr(it.label)}</p>
                {it.value && <p className="text-[13px] leading-[1.35] text-[#5f6b7d]">{tr(it.value)}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    case "policy-menu":
      // Figma Policy pages: side menu on desktop, pill buttons on tablet/phone. The page it is on is highlighted.
      return (
        <nav aria-label={tr(w.title) || undefined}>
          <ul className="flex flex-wrap gap-2 lg:w-[240px] lg:flex-col lg:gap-0 lg:overflow-hidden lg:rounded-[10px] lg:border lg:border-line-3">
            {items.map((it, i) => {
              const active = !!ctx.path && it.link === ctx.path;
              return (
                <li key={i} className="lg:border-b lg:border-line-3 lg:last:border-b-0">
                  <SmartLink
                    to={it.link}
                    className={cn(
                      "flex items-center rounded-full border px-[17px] py-[11px] text-[14.5px] text-navy-deep transition lg:h-[49px] lg:rounded-none lg:border-0 lg:px-[21px] lg:py-0",
                      active
                        ? "border-gold-btn bg-[#fbf5ea] font-bold lg:border-l-[3px] lg:border-solid lg:pl-[18px]"
                        : "border-[#d5dce6] bg-white hover:border-navy-deep lg:hover:bg-surface-alt",
                    )}
                  >
                    {tr(it.label)}
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </nav>
      );
    case "announcement":
    case "category-nav":
    case "footer-column":
    case "footer-links":
    case "legal-links":
      return null;
    default:
      return (
        <div className="grid grid-cols-1 gap-4">
          {w.title && <h2 className="font-head text-[26px] font-bold text-ink lg:text-[34px]">{tr(w.title)}</h2>}
          <div
            className="grid grid-cols-2 gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
            style={{ ["--cols" as any]: w.columns ?? 3 }}
          >
            {items.map((it, i) => (
              <div key={i} className={cn(card, "grid grid-cols-1 gap-1 p-5")}>
                <strong className="font-head text-[28px] font-bold text-ink lg:text-[34px]">
                  {it.prefix}
                  {it.value}
                  {it.suffix}
                </strong>
                <span className="text-sm text-muted">{tr(it.label)}</span>
              </div>
            ))}
          </div>
        </div>
      );
  }
}
