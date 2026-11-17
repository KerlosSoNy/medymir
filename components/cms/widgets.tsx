// One component per TheCoins page-builder widget type (and per MedyMar `variant`).
// Unknown types render nothing, so new widgets added in the dashboard never break a page.
// Field names follow the LIVE API responses (some differ from the docs; see notes inline).
import DOMPurify from "isomorphic-dompurify";
import type { Category } from "@/lib/api";
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { btn } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { ProductCard } from "../ProductCard";
import { Icon, SmartLink } from "../SmartLink";
import { HeroSlider } from "./HeroSlider";
import { CategoryCarousel } from "./CategoryCarousel";
import { BrandCarousel } from "./BrandCarousel";
import { QuoteForm } from "./QuoteForm";
import { card, cardHover, coverImg, eyebrow, initials, noScrollbar, sideCard, sideTitle } from "./classes";

/** Row layout chosen by CmsPage from the widgets a row holds. */
export type RowKind = "full" | "boxed" | "banner" | "compact" | "bleed";

export interface WidgetCtx {
  currency: string | null;
  categories: Category[];
  productCount: number;
  contactEmail: string | null;
  /** Set by CmsPage for each row. */
  row?: RowKind;
  /** The widget's row has more than one column (e.g. products + promo banner). */
  beside?: boolean;
  /** The row also holds the brand carousel, whose arrows sit beside the section header. */
  withArrows?: boolean;
}
type P = { w: any; ctx: WidgetCtx };

const html = (s: unknown) => DOMPurify.sanitize(tr(s), { USE_PROFILES: { html: true } });
const url = (u: unknown) => (typeof u === "string" && /^(https?:|\/)/.test(u) ? u : "");

/* ---------- Section header (text-image, variant "section-header") ---------- */
const LINK_ICON: Record<string, string> = { blue: "arrow-right-blue", gold: "arrow-right-gold", default: "arrow-right-navy" };
const LINK_COLOR: Record<string, string> = { blue: "text-blue-link", gold: "text-gold-link", default: "text-ink-2" };
const TITLE_SIZE: Record<string, string> = {
  md: "text-[26px] md:text-[30px] lg:text-[34px] font-bold",
  lg: "text-[26px] md:text-[30px] lg:text-[40px] font-bold",
  xl: "text-[26px] md:text-[36px] lg:text-[46px] font-semibold",
};

function SectionHeader({ w, ctx }: P) {
  const linkText = tr(w.linkText).replace("{count}", String(ctx.productCount));
  const center = w.align === "center";
  return (
    <header
      className={cn(
        "flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-6",
        center && "items-center text-center md:justify-center",
        // In carousel rows the row has no right padding, so the header adds it (plus room for the brand arrows).
        ctx.row === "bleed" && "pr-4 md:pr-6 lg:pr-14 xl:pr-[132px]",
        ctx.withArrows && "md:pr-[204px] lg:pr-[236px] xl:pr-[312px]",
      )}
    >
      <div className={cn("grid grid-cols-1 gap-2 max-w-[640px]", center && "justify-items-center max-w-[760px]")}>
        {w.eyebrow && (
          <p className={eyebrow(w.eyebrowColor)}>
            {center && <span className="w-[26px] h-[1.5px] bg-current" aria-hidden />}
            {tr(w.eyebrow)}
            {center && <span className="w-[26px] h-[1.5px] bg-current" aria-hidden />}
          </p>
        )}
        {w.title && (
          <h2 className={cn("font-head leading-[1.2] tracking-[-0.01em] text-ink text-balance", TITLE_SIZE[w.size] ?? TITLE_SIZE.md)}>
            {tr(w.title)}
          </h2>
        )}
        {w.content && (
          <div className="text-muted text-[14.5px] leading-[23px]" dangerouslySetInnerHTML={{ __html: html(w.content) }} />
        )}
      </div>
      {linkText && w.linkUrl && (
        <SmartLink
          to={w.linkUrl}
          className={cn(
            "group/link inline-flex shrink-0 items-center gap-2.5 pb-0.5 text-[15px] font-semibold whitespace-nowrap hover:underline underline-offset-4",
            LINK_COLOR[w.linkColor] ?? LINK_COLOR.default,
          )}
        >
          {linkText}
          <span className="transition-transform group-hover/link:translate-x-0.5">
            <Icon name={LINK_ICON[w.linkColor] ?? LINK_ICON.default} size={17} />
          </span>
        </SmartLink>
      )}
    </header>
  );
}

function TextImage({ w, ctx }: P) {
  if (w.variant === "section-header") return <SectionHeader w={w} ctx={ctx} />;
  if (w.variant === "payments" || w.variant === "footer-about") return null; // rendered by the footer
  const img = url(w.imageUrl);
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2" style={{ background: w.backgroundColor || undefined }}>
      {img && (
        <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-alt", w.imagePosition !== "left" && "lg:order-last")}>
          <img src={img} alt={tr(w.title)} loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
      )}
      <div>
        {w.title && <h2 className="mb-3 font-head text-[26px] md:text-[30px] lg:text-[34px] font-bold leading-[1.2] text-ink">{tr(w.title)}</h2>}
        <div className="rich" dangerouslySetInnerHTML={{ __html: html(w.content) }} />
      </div>
    </div>
  );
}

/* ---------- stats-counter variants ---------- */
const FEATURE_ICON: Record<string, string> = { search: "feature-search", "file-text": "feature-file-text", whatsapp: "feature-whatsapp" };

function Stats({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
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
    case "announcement":
    case "category-nav":
    case "footer-column":
    case "footer-links":
    case "legal-links":
      return null; // rendered by the site header / footer
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

/* ---------- Hero slider (carousel; live API: type "swiper", images[{desk,tab,mobile,...}]) ---------- */
function Carousel({ w }: P) {
  const raw: any[] = w.slides ?? w.images ?? [];
  const slides = raw
    .map((s) => {
      const desk = url(s.desk ?? s.imageUrl ?? s.image);
      return {
        desk,
        tab: url(s.tab ?? s.tabletImageUrl) || desk,
        mobile: url(s.mobile ?? s.mobileImageUrl) || desk,
        title: tr(s.title),
        link: s.cta_link ?? s.ctaLink ?? s.link ?? "",
      };
    })
    .filter((s) => s.desk);
  if (!slides.length) return null;
  return <HeroSlider slides={slides} autoplay={w.autoplay !== false} interval={Number(w.interval) || 6} />;
}

/* ---------- Image banners (banners; live API: type "small-banner", cards[{image,link,...}]) ---------- */
function Banners({ w, ctx }: P) {
  const cards: any[] = (w.cards ?? w.items ?? [])
    .map((c: any) => ({ ...c, image: url(c.image ?? c.imageUrl), mobile: url(c.mobile_image ?? c.mobileImageUrl) }))
    .filter((c: any) => c.image);
  if (!cards.length) return null;
  const boxed = ctx.row !== "full";
  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((c, i) => (
        <SmartLink
          key={i}
          to={c.link}
          ariaLabel={tr(c.title) || undefined}
          className={cn(
            "group block overflow-hidden",
            boxed && "rounded-2xl shadow-card",
            ctx.row === "banner" && "rounded-[20px] md:rounded-[26px]",
          )}
        >
          <picture>
            {c.mobile && <source media="(max-width:640px)" srcSet={c.mobile} />}
            <img
              src={c.image}
              alt={tr(c.title)}
              loading="lazy"
              className={cn(
                "block h-auto w-full",
                boxed && "transition duration-500 ease-out group-hover:scale-[1.015]",
                // A tall promo poster beside products would stretch to full width on tablets and get very
                // tall, so crop it to the Figma tablet frame (720×560) and keep the brand logo in view.
                ctx.beside && "sm:max-lg:aspect-[720/560] sm:max-lg:object-cover sm:max-lg:object-[50%_8%]",
              )}
            />
          </picture>
        </SmartLink>
      ))}
    </div>
  );
}

/* ---------- Categories (categories-grid; live API: data[{id,slug,title,image,link}]) ---------- */
function Categories({ w, ctx }: P) {
  const byId = new Map(ctx.categories.map((c) => [c.id, c]));
  const cats = (w.data ?? w.categories ?? []).map((c: any) => {
    const full = byId.get(c.id);
    return {
      id: c.id,
      name: tr(c.title ?? c.name) || full?.name || "",
      description: w.showDescription === false ? "" : full?.description ?? "",
      image: url(c.image || c.image_url || full?.image_url),
      href: `/category/${c.slug ?? full?.slug ?? c.id}`,
    };
  });
  if (!cats.length) return null;
  return <CategoryCarousel cats={cats} label={UI.exploreCategory} footnote={UI.exploreCategories(cats.length)} />;
}

/* ---------- Product grids (products-by-category / featured / recommended; live: data[]) ---------- */
function Products({ w, ctx }: P) {
  const products: any[] = w.data ?? [];
  if (!products.length)
    return (
      <div className="grid grid-cols-1 h-full min-h-60 place-items-center rounded-[14px] border border-dashed border-[#c9d2de] p-8 text-center text-sm text-muted-3">
        {UI.productsComing}
      </div>
    );
  return (
    <div
      className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ ["--cols" as any]: w.columns ?? 2 }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} p={p} currency={ctx.currency} />
      ))}
    </div>
  );
}

/* ---------- testimonials variants: brand carousel, exclusive brands, solutions ---------- */
const BRAND_STYLE: Record<string, string> = {
  bold: "font-bold",
  semibold: "font-semibold",
  "bold-italic": "font-bold italic",
  italic: "font-sans italic",
};

function Testimonials({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  if (w.variant === "brand-carousel") {
    const cards = items.map((it) => ({ name: tr(it.name), image: url(it.avatar), link: it.link ?? "" })).filter((c) => c.image || c.name);
    if (!cards.length) return null;
    return <BrandCarousel cards={cards} />;
  }
  if (w.variant === "exclusive-brands")
    return (
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const img = url(it.avatar);
          const name = tr(it.name);
          return (
            <article key={i} className={cn("group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white", cardHover)}>
              <div className="flex min-h-[60px] items-center justify-between gap-3 py-4 pl-[18px] pr-4">
                <span
                  className={cn("min-w-0 truncate pr-1 font-head text-[19px] leading-7", BRAND_STYLE[it.brandStyle] ?? BRAND_STYLE.bold)}
                  style={{ color: it.brandColor || undefined }}
                >
                  {name}
                </span>
                {it.badge && (
                  <span className="shrink-0 rounded border border-dark px-2 py-1 text-[10px] font-semibold tracking-[0.04em] text-dark">
                    {tr(it.badge)}
                  </span>
                )}
              </div>
              <div className="relative h-[171px] overflow-hidden bg-[linear-gradient(135deg,#c9d4e3,#aebdd2)]">
                {img ? (
                  <img src={img} alt={name} loading="lazy" className={coverImg} />
                ) : (
                  <span aria-hidden className="absolute inset-0 grid grid-cols-1 place-items-center font-head text-5xl font-bold text-white/70">
                    {initials(name)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-[15px] font-semibold text-ink-2">{tr(it.text)}</p>
                {it.buttonText && (
                  <SmartLink to={it.link} className={btn("navy", "md", "mt-auto w-full text-[13px]")}>
                    {tr(it.buttonText)}
                    <Icon name="arrow-right-white-sm" size={15} />
                  </SmartLink>
                )}
              </div>
            </article>
          );
        })}
      </div>
    );
  if (w.variant === "solutions")
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const img = url(it.avatar);
          const name = tr(it.name);
          return (
            <article key={i} className={cn("group flex flex-col overflow-hidden rounded-[14px] border border-[#e7e3da] bg-white", cardHover)}>
              <div className="relative h-[187px] overflow-hidden bg-[linear-gradient(135deg,#efebe3,#ddd6c8)]">
                {img ? (
                  <img src={img} alt={name} loading="lazy" className={coverImg} />
                ) : (
                  <span aria-hidden className="absolute inset-0 grid grid-cols-1 place-items-center font-head text-5xl font-bold text-white/80">
                    {initials(name)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 px-[17px] pb-[22px] pt-4">
                <h3 className="text-[17px] font-semibold text-ink-2">{name}</h3>
                <p className="text-[13px] leading-5 text-muted-2">{tr(it.text)}</p>
                {Array.isArray(it.tags) && it.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {it.tags.map((t: string, j: number) => (
                      <li key={j} className="rounded-full border border-[#e3ded3] bg-[#fbfaf7] px-2.5 py-[5px] text-[11px] font-medium text-[#3a4252]">
                        {tr(t)}
                      </li>
                    ))}
                  </ul>
                )}
                {it.linkText && (
                  <SmartLink
                    to={it.link}
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-1 text-sm font-semibold text-gold-link hover:underline underline-offset-4"
                  >
                    {tr(it.linkText)}
                    <Icon name="arrow-right-gold-sm" size={14} />
                  </SmartLink>
                )}
              </div>
            </article>
          );
        })}
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]" style={{ ["--cols" as any]: Math.min(items.length, 3) }}>
      {items.map((it, i) => (
        <blockquote key={i} className={cn(card, "grid grid-cols-1 gap-3 p-6")}>
          <p className="text-[15px] leading-relaxed text-ink-3">{tr(it.text)}</p>
          <cite className="text-sm font-semibold not-italic text-ink-2">{tr(it.name)}</cite>
        </blockquote>
      ))}
    </div>
  );
}

/* ---------- button-cta variants: note, callout ---------- */
function ButtonCta({ w }: P) {
  const outline = w.style === "outline";
  const btnCls = (extra?: string) => btn(outline ? "outline" : "dark", "md", extra);
  const arrow = outline ? "arrow-right-outline" : "arrow-right-white";
  if (w.variant === "note")
    return (
      <div className="flex flex-col items-stretch gap-4 rounded-[10px] border border-dashed border-[#dcd6c8] bg-[#f5f3ee] px-[22px] py-4 text-[13px] text-muted-2 md:flex-row md:items-center md:justify-between">
        <p>
          {w.title && <strong className="text-ink-2">{tr(w.title)} </strong>}
          {tr(w.subtitle)}
        </p>
        {w.text && (
          <SmartLink to={w.link} className={btnCls("w-full md:w-auto")}>
            {tr(w.text)}
          </SmartLink>
        )}
      </div>
    );
  if (w.variant === "callout") {
    const light = w.tone === "light";
    return (
      <div
        className={cn(
          "flex flex-col items-stretch gap-4 rounded-xl md:flex-row md:items-center md:justify-between",
          light
            ? "border border-[#e3e7ed] bg-white p-[18px] md:py-3.5 md:pl-6 md:pr-[22px]"
            : "bg-[linear-gradient(90deg,#ebf0f7,#f3f6fa)] p-[18px] md:py-4 md:pl-[26px] md:pr-6",
        )}
      >
        <div className={cn("flex items-center", light ? "gap-[18px]" : "gap-5")}>
          <Icon name={light ? "case-file-text" : "callout-file-text"} size={light ? 24 : 34} />
          {!light && <span className="hidden h-[38px] w-px shrink-0 bg-[#cbd3df] md:block" aria-hidden />}
          <div className="grid grid-cols-1 gap-[3px]">
            <strong className={cn("font-semibold text-ink-2", light ? "text-[14.5px]" : "text-base")}>{tr(w.title)}</strong>
            <span className="text-[13px] text-muted">{tr(w.subtitle)}</span>
          </div>
        </div>
        {w.text && (
          <SmartLink to={w.link} className={btnCls("w-full md:w-auto")}>
            {tr(w.text)}
            <Icon name={arrow} size={16} />
          </SmartLink>
        )}
      </div>
    );
  }
  if (!w.text) return null;
  return (
    <div style={{ textAlign: w.align ?? "center" }}>
      <SmartLink to={w.link} className={btnCls()}>
        {tr(w.text)}
      </SmartLink>
    </div>
  );
}

/* ---------- contact-form variants: quote form, contact card ---------- */
const CONTACT_ICON: Record<string, string> = { email: "email", mail: "email", hours: "hours", clock: "hours", reply: "reply" };

function ContactForm({ w, ctx }: P) {
  if (w.variant === "footer-contact") return null; // rendered by the footer
  if (w.variant === "contact-card")
    return (
      <div className={sideCard}>
        {w.title && <h3 className={sideTitle}>{tr(w.title)}</h3>}
        <dl className="grid grid-cols-1 gap-4 border-b border-line pb-4">
          {(w.contactInfo ?? []).map((c: any, i: number) => (
            <div key={i} className="flex gap-3.5 text-[14.5px]">
              <dt className="flex w-[82px] shrink-0 items-center gap-3.5 text-muted">
                <Icon name={CONTACT_ICON[String(c.icon).toLowerCase()] ?? "reply"} size={18} />
                {tr(c.label)}
              </dt>
              <dd className="min-w-0 break-words font-medium text-ink-2">
                {/@/.test(c.value) ? (
                  <a href={`mailto:${c.value}`} className="hover:underline underline-offset-2">
                    {tr(c.value)}
                  </a>
                ) : (
                  tr(c.value)
                )}
              </dd>
            </div>
          ))}
        </dl>
        {Array.isArray(w.offices) && w.offices.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {w.offices.map((o: any, i: number) => (
              <li key={i} className="grid grid-cols-1 gap-[3px] rounded-lg bg-surface-alt py-3 pl-4 pr-3">
                <span className="flex items-center gap-2.5 text-[15px] font-semibold text-ink-2">
                  <Icon name="map-pin" size={16} />
                  {tr(o.city)}
                </span>
                <small className="text-[11px] text-muted-3">{tr(o.note)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  return (
    <QuoteForm
      anchor={w.anchor ?? "quote"}
      eyebrow={tr(w.eyebrow)}
      title={tr(w.title)}
      subtitle={tr(w.subtitle)}
      attachTitle={tr(w.attachTitle)}
      attachText={tr(w.attachText)}
      submitText={tr(w.submitText)}
      privacyNote={tr(w.privacyNote)}
      fallbackEmail={ctx.contactEmail}
    />
  );
}

/* ---------- generic widgets ---------- */
function Faq({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  return (
    <div>
      {w.title && <h2 className="mb-4 font-head text-[26px] font-bold text-ink lg:text-[34px]">{tr(w.title)}</h2>}
      {items.map((it, i) => (
        <details key={i} className="group border-b border-line py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-2 [&::-webkit-details-marker]:hidden">
            {tr(it.question)}
            <img src="/icons/chevron-down.svg" width={14} height={14} alt="" className="block shrink-0 grow-0 max-w-none size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="rich pt-3" dangerouslySetInnerHTML={{ __html: html(it.answer) }} />
        </details>
      ))}
    </div>
  );
}

function Gallery({ w }: P) {
  const imgs = (w.images ?? []).filter((i: any) => url(i.url));
  if (!imgs.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]" style={{ ["--cols" as any]: w.columns ?? 3 }}>
      {imgs.map((i: any, k: number) => (
        <SmartLink key={k} to={i.linkUrl ?? i.link} className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-surface-alt">
          <img src={i.url} alt={tr(i.caption)} loading="lazy" className={coverImg} />
        </SmartLink>
      ))}
    </div>
  );
}

const Spacer = ({ w }: P) => <div style={{ height: Number(w.height) || 0 }} aria-hidden />;
const Divider = () => <hr className="border-0 border-t border-line" />;

const REGISTRY: Record<string, React.FC<P>> = {
  carousel: Carousel,
  "stats-counter": Stats,
  "text-image": TextImage,
  "categories-grid": Categories,
  banners: Banners,
  "products-by-category": Products,
  "featured-products": Products,
  "recommended-products": Products,
  testimonials: Testimonials,
  "button-cta": ButtonCta,
  "contact-form": ContactForm,
  "faq-accordion": Faq,
  gallery: Gallery,
  spacer: Spacer,
  divider: Divider,
};

export function WidgetRenderer({ w, ctx }: P) {
  const C = REGISTRY[w?.widget_type ?? w?.type];
  return C ? <C w={w} ctx={ctx} /> : null;
}
