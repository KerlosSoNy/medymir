// One component per TheCoins page-builder widget type (and per MedyMar `variant`).
// Unknown types render nothing, so new widgets added in the dashboard never break a page.
// Field names follow the LIVE API responses (some differ from the docs; see notes inline).
import DOMPurify from "isomorphic-dompurify";
import type { Category } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { ProductCard } from "../ProductCard";
import { Icon, SmartLink } from "../SmartLink";
import { HeroSlider } from "./HeroSlider";
import { CategoryCarousel } from "./CategoryCarousel";
import { BrandCarousel } from "./BrandCarousel";
import { QuoteForm } from "./QuoteForm";

export interface WidgetCtx {
  currency: string | null;
  categories: Category[];
  productCount: number;
  contactEmail: string | null;
}
type P = { w: any; ctx: WidgetCtx };

const html = (s: unknown) => DOMPurify.sanitize(tr(s), { USE_PROFILES: { html: true } });
const url = (u: unknown) => (typeof u === "string" && /^(https?:|\/)/.test(u) ? u : "");

/* ---------- Section header (text-image, variant "section-header") ---------- */
const LINK_ICON: Record<string, string> = { blue: "arrow-right-blue", gold: "arrow-right-gold", default: "arrow-right-navy" };

function SectionHeader({ w, ctx }: P) {
  const linkText = tr(w.linkText).replace("{count}", String(ctx.productCount));
  return (
    <header className={`sec-head ${w.align === "center" ? "center" : ""} size-${w.size ?? "md"}`}>
      <div className="sec-head-text">
        {w.eyebrow && (
          <p className={`eyebrow eb-${w.eyebrowColor ?? "grey"}`}>
            {w.align === "center" && <span className="eb-line" aria-hidden />}
            {tr(w.eyebrow)}
            {w.align === "center" && <span className="eb-line" aria-hidden />}
          </p>
        )}
        {w.title && <h2>{tr(w.title)}</h2>}
        {w.content && <div className="sec-sub" dangerouslySetInnerHTML={{ __html: html(w.content) }} />}
      </div>
      {linkText && w.linkUrl && (
        <SmartLink to={w.linkUrl} className={`sec-link lc-${w.linkColor ?? "default"}`}>
          {linkText}
          <Icon name={LINK_ICON[w.linkColor] ?? LINK_ICON.default} size={17} />
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
    <div className={`text-image pos-${w.imagePosition ?? "right"}`} style={{ background: w.backgroundColor || undefined }}>
      {img && <img src={img} alt={tr(w.title)} loading="lazy" />}
      <div>
        {w.title && <h2>{tr(w.title)}</h2>}
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
        <div className="chips-row">
          {w.title && <h2 className="chips-title">{tr(w.title)}</h2>}
          <div className="chips">
            {items.map((it, i) => (
              <SmartLink key={i} to={it.link} className="chip">
                {tr(it.label)}
              </SmartLink>
            ))}
          </div>
        </div>
      );
    case "tabs":
      return (
        <div className="tabs" role="list">
          {items.map((it, i) => (
            <SmartLink key={i} to={it.link} className={`tab ${i === 0 ? "on" : ""}`}>
              {tr(it.label)}
            </SmartLink>
          ))}
        </div>
      );
    case "features":
      return (
        <div className="features">
          {items.map((it, i) => (
            <div key={i} className="feature">
              {FEATURE_ICON[it.icon] && <Icon name={FEATURE_ICON[it.icon]} size={28} />}
              <div>
                <h3>{tr(it.label)}</h3>
                <p>{tr(it.value)}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case "checklist":
      return (
        <div className="card side-card">
          {w.title && <h3 className="side-title">{tr(w.title)}</h3>}
          <ul className="checklist">
            {items.map((it, i) => (
              <li key={i}>
                <span className="check-dot">
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
        <div className="stats">
          {w.title && <h2>{tr(w.title)}</h2>}
          <div className="grid" style={{ ["--cols" as any]: w.columns ?? 3 }}>
            {items.map((it, i) => (
              <div key={i} className="stat">
                <strong>
                  {it.prefix}
                  {it.value}
                  {it.suffix}
                </strong>
                <span>{tr(it.label)}</span>
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
function Banners({ w }: P) {
  const cards: any[] = (w.cards ?? w.items ?? [])
    .map((c: any) => ({ ...c, image: url(c.image ?? c.imageUrl), mobile: url(c.mobile_image ?? c.mobileImageUrl) }))
    .filter((c: any) => c.image);
  if (!cards.length) return null;
  return (
    <div className="banners">
      {cards.map((c, i) => (
        <SmartLink key={i} to={c.link} className="banner" ariaLabel={tr(c.title) || undefined}>
          <picture>
            {c.mobile && <source media="(max-width:640px)" srcSet={c.mobile} />}
            <img src={c.image} alt={tr(c.title)} loading="lazy" />
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
  if (!products.length) return <div className="products-empty">{UI.productsComing}</div>;
  return (
    <div className="pgrid" style={{ ["--cols" as any]: w.columns ?? 2 }}>
      {products.map((p) => (
        <ProductCard key={p.id} p={p} currency={ctx.currency} />
      ))}
    </div>
  );
}

/* ---------- testimonials variants: brand carousel, exclusive brands, solutions ---------- */
function Testimonials({ w }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  if (w.variant === "brand-carousel") {
    const cards = items.map((it) => ({ name: tr(it.name), image: url(it.avatar), link: it.link ?? "" })).filter((c) => c.image);
    if (!cards.length) return null;
    return <BrandCarousel cards={cards} />;
  }
  if (w.variant === "exclusive-brands")
    return (
      <div className="xbrands">
        {items.map((it, i) => (
          <article key={i} className="xbrand">
            <div className="xbrand-top">
              <span className={`xbrand-name bs-${it.brandStyle ?? "bold"}`} style={{ color: it.brandColor || undefined }}>
                {tr(it.name)}
              </span>
              {it.badge && <span className="xbrand-badge">{tr(it.badge)}</span>}
            </div>
            <div className="xbrand-img">{url(it.avatar) && <img src={url(it.avatar)} alt={tr(it.name)} loading="lazy" />}</div>
            <div className="xbrand-body">
              <p>{tr(it.text)}</p>
              {it.buttonText && (
                <SmartLink to={it.link} className="btn btn-navy btn-block">
                  {tr(it.buttonText)}
                  <Icon name="arrow-right-white-sm" size={15} />
                </SmartLink>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  if (w.variant === "solutions")
    return (
      <div className="solutions">
        {items.map((it, i) => (
          <article key={i} className="solution">
            <div className="solution-img">{url(it.avatar) && <img src={url(it.avatar)} alt={tr(it.name)} loading="lazy" />}</div>
            <div className="solution-body">
              <h3>{tr(it.name)}</h3>
              <p>{tr(it.text)}</p>
              {Array.isArray(it.tags) && it.tags.length > 0 && (
                <ul className="tags">
                  {it.tags.map((t: string, j: number) => (
                    <li key={j}>{tr(t)}</li>
                  ))}
                </ul>
              )}
              {it.linkText && (
                <SmartLink to={it.link} className="solution-link">
                  {tr(it.linkText)}
                  <Icon name="arrow-right-gold-sm" size={14} />
                </SmartLink>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  return (
    <div className="grid" style={{ ["--cols" as any]: Math.min(items.length, 3) }}>
      {items.map((it, i) => (
        <blockquote key={i} className="card testimonial">
          <p>{tr(it.text)}</p>
          <cite>{tr(it.name)}</cite>
        </blockquote>
      ))}
    </div>
  );
}

/* ---------- button-cta variants: note, callout ---------- */
function ButtonCta({ w }: P) {
  const btnCls = w.style === "outline" ? "btn btn-outline" : "btn btn-dark";
  const arrow = w.style === "outline" ? "arrow-right-outline" : "arrow-right-white";
  if (w.variant === "note")
    return (
      <div className="note">
        <p>
          {w.title && <strong>{tr(w.title)} </strong>}
          {tr(w.subtitle)}
        </p>
        {w.text && (
          <SmartLink to={w.link} className={btnCls}>
            {tr(w.text)}
          </SmartLink>
        )}
      </div>
    );
  if (w.variant === "callout")
    return (
      <div className={`callout ${w.tone === "light" ? "light" : ""}`}>
        <div className="callout-text">
          <Icon name={w.tone === "light" ? "case-file-text" : "callout-file-text"} size={w.tone === "light" ? 24 : 34} />
          {w.tone !== "light" && <span className="callout-sep" aria-hidden />}
          <div>
            <strong>{tr(w.title)}</strong>
            <span>{tr(w.subtitle)}</span>
          </div>
        </div>
        {w.text && (
          <SmartLink to={w.link} className={btnCls}>
            {tr(w.text)}
            <Icon name={arrow} size={16} />
          </SmartLink>
        )}
      </div>
    );
  if (!w.text) return null;
  return (
    <div style={{ textAlign: w.align ?? "center" }}>
      <SmartLink to={w.link} className={btnCls}>
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
      <div className="card side-card">
        {w.title && <h3 className="side-title">{tr(w.title)}</h3>}
        <dl className="contact-list">
          {(w.contactInfo ?? []).map((c: any, i: number) => (
            <div key={i}>
              <dt>
                <Icon name={CONTACT_ICON[String(c.icon).toLowerCase()] ?? "reply"} size={18} />
                {tr(c.label)}
              </dt>
              <dd>{/@/.test(c.value) ? <a href={`mailto:${c.value}`}>{tr(c.value)}</a> : tr(c.value)}</dd>
            </div>
          ))}
        </dl>
        {Array.isArray(w.offices) && w.offices.length > 0 && (
          <ul className="offices">
            {w.offices.map((o: any, i: number) => (
              <li key={i}>
                <span>
                  <Icon name="map-pin" size={16} />
                  {tr(o.city)}
                </span>
                <small>{tr(o.note)}</small>
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
    <div className="faq">
      {w.title && <h2>{tr(w.title)}</h2>}
      {items.map((it, i) => (
        <details key={i}>
          <summary>{tr(it.question)}</summary>
          <div className="rich" dangerouslySetInnerHTML={{ __html: html(it.answer) }} />
        </details>
      ))}
    </div>
  );
}

function Gallery({ w }: P) {
  const imgs = (w.images ?? []).filter((i: any) => url(i.url));
  if (!imgs.length) return null;
  return (
    <div className="grid" style={{ ["--cols" as any]: w.columns ?? 3 }}>
      {imgs.map((i: any, k: number) => (
        <SmartLink key={k} to={i.linkUrl ?? i.link}>
          <img src={i.url} alt={tr(i.caption)} loading="lazy" className="gallery-img" />
        </SmartLink>
      ))}
    </div>
  );
}

const Spacer = ({ w }: P) => <div style={{ height: Number(w.height) || 0 }} aria-hidden />;
const Divider = () => <hr className="divider" />;

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
