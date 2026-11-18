// Testimonials and our variants: brand-carousel, exclusive-brands, solutions.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { btn } from "@/lib/styles";
import { Icon, SmartLink } from "../../SmartLink";
import { BrandCarousel } from "../BrandCarousel";
import { card, cardHover, coverImg, initials } from "../classes";
import { type P, url } from "./shared";

/* ---------- testimonials variants: brand carousel, exclusive brands, solutions ---------- */
export const BRAND_STYLE: Record<string, string> = {
  bold: "font-bold",
  semibold: "font-semibold",
  "bold-italic": "font-bold italic",
  italic: "font-sans italic",
};

export function Testimonials({ w, ctx }: P) {
  const items: any[] = w.items ?? [];
  if (!items.length) return null;
  if (w.variant === "brand-carousel") {
    // Name, tagline, link and (optional) photo come from the CMS; the logo comes from the store's Brand list.
    const logoOf = (link: string) => ctx.brands.find((b) => link === `/brand/${b.slug}`)?.logo ?? null;
    const cards = items
      .map((it) => ({ name: tr(it.name), image: url(it.avatar), link: it.link ?? "", logo: logoOf(it.link ?? "") }))
      .filter((c) => c.image || c.name);
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
