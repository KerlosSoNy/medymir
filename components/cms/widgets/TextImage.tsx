// Text + Image (text-image). Variant "section-header" → SectionHeader, "split-hero" → SplitHero, "policy" → policy text,
// "stock-hero" → Ready Stock hero, "offers" → Ready Stock offers area (Text + Image keeps all our settings in the
// public output; Products by Category drops them, so the offers area lives here).
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { Icon, SmartLink } from "../../SmartLink";
import { goldBtn } from "../classes";
import { OfferListing } from "../../OfferListing";
import { type P, html, url } from "./shared";
import { SectionHeader } from "./SectionHeader";

const policyText = cn(
  "mt-[18px] max-w-[727px] text-base leading-[1.7] text-[#2d3b55]",
  "[&_h2]:mt-7 [&_h2]:mb-3.5 [&_h2]:font-head [&_h2]:text-[21px] [&_h2]:leading-[1.3] [&_h2]:font-bold [&_h2]:text-navy-deep [&_h2:first-child]:mt-0",
  "[&_h3]:mt-[26px] [&_h3]:mb-3.5 [&_h3]:font-head [&_h3]:text-lg [&_h3]:leading-[1.3] [&_h3]:font-bold [&_h3]:text-navy-deep",
  "[&_p+p]:mt-3.5 [&_strong]:font-bold [&_strong]:text-navy-deep",
  "[&_ul]:my-3.5 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-[24px] [&_li]:marker:text-[#2d3b55]",
  "[&_a]:break-words [&_a]:text-gold-link [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline",
);

export function TextImage({ w, ctx }: P) {
  if (w.variant === "section-header") return <SectionHeader w={w} ctx={ctx} />;
  if (w.variant === "split-hero") return <SplitHero w={w} />;
  if (w.variant === "stock-hero") return <StockHero w={w} />;
  if (w.variant === "offers") return <Offers w={w} ctx={ctx} />;
  if (w.variant === "policy")
    // Figma Policy pages: small gold label, page title (h1) and the policy text (rich text: h2, h3, p, ul, links).
    return (
      <article className="min-w-0">
        {w.eyebrow && <p className="text-xs font-bold tracking-[0.08em] text-gold-link uppercase">{tr(w.eyebrow)}</p>}
        {w.title && <h1 className="mt-[7px] font-head text-[30px] leading-[1.15] font-bold text-navy-deep md:text-[38px]">{tr(w.title)}</h1>}
        <div className={policyText} dangerouslySetInnerHTML={{ __html: html(w.content) }} />
      </article>
    );
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

/**
 * text-image variant "stock-hero" (Figma Ready Stock hero, node 92:120): light blue box, gold label, big
 * title, one line and a dark button on the left, picture on the right with a small white tag ("badge").
 * Phone/tablet: picture on top, text below. Fields: eyebrow, title, content, linkText, linkUrl, badge,
 * imageUrl, tabletImageUrl, mobileImageUrl.
 */
function StockHero({ w }: { w: any }) {
  const desk = url(w.imageUrl);
  const tab = url(w.tabletImageUrl);
  const mobile = url(w.mobileImageUrl);
  const title = tr(w.title);
  if (!title) return null;
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[14px] border border-[#e1eaf2] bg-[linear-gradient(90deg,#eaf2f8,#f2f7fb_55%,#e4edf6)] lg:min-h-[352px]",
        desk && "lg:flex-row-reverse",
      )}
    >
      {desk && (
        <div className="relative h-[220px] shrink-0 sm:h-[280px] lg:h-auto lg:w-1/2">
          <picture>
            {mobile && <source media="(max-width:640px)" srcSet={mobile} />}
            {tab && <source media="(max-width:1024px)" srcSet={tab} />}
            <img src={desk} alt="" className="absolute inset-0 size-full object-cover" />
          </picture>
        </div>
      )}
      {w.badge && (
        <span className="absolute top-3.5 right-3.5 flex h-[29px] items-center gap-1.5 rounded-full bg-white px-3 text-[12.5px] font-semibold text-[#202b40] shadow-sm">
          <Icon name="rs-tag-pin" size={13} />
          {tr(w.badge)}
        </span>
      )}
      <div className={cn("flex flex-col justify-center px-6 py-8 md:px-10 lg:py-12 lg:pl-[52px]", desk ? "lg:w-1/2" : "")}>
        {w.eyebrow && <p className="text-[12.5px] font-bold tracking-[0.14em] text-[#b88a2e] uppercase">{tr(w.eyebrow)}</p>}
        <h1 className="mt-2.5 max-w-[495px] font-head text-[34px] leading-[1.08] font-bold text-balance text-[#202b40] md:text-[40px] lg:text-[44px]">{title}</h1>
        {w.content && (
          <div className="mt-3 max-w-[495px] text-base leading-normal text-[#3b4a63] md:text-[17px]" dangerouslySetInnerHTML={{ __html: html(w.content) }} />
        )}
        {w.linkText && (
          <SmartLink
            to={w.linkUrl}
            className="mt-5 inline-flex h-12 items-center gap-2.5 self-start rounded-lg bg-[#202b40] px-5 text-[15px] font-semibold text-white transition hover:brightness-125"
          >
            {tr(w.linkText)}
            <Icon name="rs-arrow-down" size={16} />
          </SmartLink>
        )}
      </div>
    </article>
  );
}

/** text-image variant "offers": store filters + offer cards of one category (categoryId), with the card texts. */
function Offers({ w, ctx }: P) {
  if (!w.categoryId) return null;
  return (
    <OfferListing
      categoryId={w.categoryId}
      basePath={ctx.path ?? "/products"}
      sp={ctx.sp ?? {}}
      title={tr(w.title)}
      currency={ctx.currency}
      brands={ctx.brands}
      anchor={w.anchor || "offers"}
      labels={{ badge: tr(w.badge), note: tr(w.note), button: tr(w.buttonText), footnote: tr(w.footnote) }}
    />
  );
}
