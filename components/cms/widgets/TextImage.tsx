// Text + Image (text-image). Variant "section-header" → SectionHeader, "split-hero" → SplitHero.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { Icon, SmartLink } from "../../SmartLink";
import { goldBtn } from "../classes";
import { type P, html, url } from "./shared";
import { SectionHeader } from "./SectionHeader";

export function TextImage({ w, ctx }: P) {
  if (w.variant === "section-header") return <SectionHeader w={w} ctx={ctx} />;
  if (w.variant === "split-hero") return <SplitHero w={w} />;
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

/**
 * text-image variant "split-hero" (Figma About hero): navy box, eyebrow + big title + text + gold button
 * on the left, picture on the right. Phone/tablet: text on top, picture below. The page's main heading (h1).
 * Fields: eyebrow, title, content (plain or rich text), linkText, linkUrl, imageUrl, tabletImageUrl, mobileImageUrl.
 */
function SplitHero({ w }: { w: any }) {
  const desk = url(w.imageUrl);
  const tab = url(w.tabletImageUrl);
  const mobile = url(w.mobileImageUrl);
  const title = tr(w.title);
  if (!title) return null;
  return (
    <article className={cn("flex flex-col gap-3 overflow-hidden rounded-[14px] bg-navy-deep lg:flex-row lg:gap-0", desk && "lg:min-h-[496px]")}>
      <div className={cn("flex flex-col justify-center px-6 pt-9 sm:px-[39px] md:px-14 md:pt-12 lg:py-14", desk ? "pb-4 lg:w-1/2" : "pb-10 md:pb-12")}>
        {w.eyebrow && <p className="text-[15px] font-bold tracking-[0.08em] text-gold-soft uppercase md:text-lg">{tr(w.eyebrow)}</p>}
        <h1 className="mt-5 font-head text-[38px] leading-[1.04] font-bold text-balance text-white md:text-[46px] lg:text-[54px]">{title}</h1>
        {w.content && (
          <div
            className="mt-5 text-base leading-normal text-mist md:text-lg [&_p+p]:mt-3"
            dangerouslySetInnerHTML={{ __html: html(w.content) }}
          />
        )}
        {w.linkText && (
          <SmartLink to={w.linkUrl} className={cn(goldBtn, "mt-7")}>
            {tr(w.linkText)}
            <Icon name="arrow-right-white-14" size={14} />
          </SmartLink>
        )}
      </div>
      {desk && (
        <div className="relative h-[251px] shrink-0 sm:h-[300px] md:h-[360px] lg:h-auto lg:w-1/2">
          <picture>
            {mobile && <source media="(max-width:640px)" srcSet={mobile} />}
            {tab && <source media="(max-width:1024px)" srcSet={tab} />}
            <img src={desk} alt="" className="absolute inset-0 size-full object-cover" />
          </picture>
        </div>
      )}
    </article>
  );
}
