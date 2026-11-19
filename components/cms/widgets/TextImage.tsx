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
import { BrandDirectory } from "../../BrandDirectory";
import { ByCategory } from "./ProductAttributes";
import { CategoryTiles } from "./Categories";
import { CategoryDirectory } from "../../CategoryDirectory";

const policyText = cn(
  "mt-[18px] max-w-[727px] text-base leading-[1.7] text-[#2d3b55]",
  "[&_h2]:mt-7 [&_h2]:mb-3.5 [&_h2]:font-head [&_h2]:text-[21px] [&_h2]:leading-[1.3] [&_h2]:font-bold [&_h2]:text-navy-deep [&_h2:first-child]:mt-0",
  "[&_h3]:mt-[26px] [&_h3]:mb-3.5 [&_h3]:font-head [&_h3]:text-lg [&_h3]:leading-[1.3] [&_h3]:font-bold [&_h3]:text-navy-deep",
  "[&_p+p]:mt-3.5 [&_strong]:font-bold [&_strong]:text-navy-deep",
  "[&_ul]:my-3.5 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-[24px] [&_li]:marker:text-[#2d3b55]",
  "[&_a]:break-words [&_a]:text-gold-link [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline",
);

/** Product page tab text (Figma "Panel / Overview": 15px, 1.65 line height). Also used for the product description. */
export const productTabText = cn(
  "max-w-[860px] text-[15px] leading-[1.65] text-[#2d3b55]",
  "[&_p]:my-0 [&_p+p]:mt-3 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-head [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-navy-deep [&_h3:first-child]:mt-0",
  "[&_strong]:font-semibold [&_strong]:text-navy-deep [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li+li]:mt-1.5 [&_a]:text-gold-link [&_a]:underline",
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
  if (w.variant === "brands-hero") return <BrandsHero w={w} ctx={ctx} />;
  // Brands page parts that read store data. They live on Text + Image because the public API drops our settings
  // (variant, texts) on Product Attributes and Categories sections.
  if (w.variant === "brand-directory")
    return (
      <div id={w.anchor || undefined} className="scroll-mt-6">
        <BrandDirectory
          brands={ctx.brands.map((b) => ({ name: b.name, slug: b.slug, logo: b.logo }))}
          request={{ title: tr(w.title), subtitle: tr(w.subtitle), buttonText: tr(w.linkText), link: w.linkUrl ?? "" }}
        />
      </div>
    );
  if (w.variant === "brands-by-category") return <ByCategory ctx={ctx} />;
  if (w.variant === "category-tiles") return <CategoryTiles ctx={ctx} />;
  if (w.variant === "categories-hero") return <CategoriesHero w={w} />;
  if (w.variant === "category-directory") return <CategoryDirectory slugs={ctx.categories.map((c) => c.slug ?? c.id)} />;
  if (w.variant === "product-tab")
    // CMS page "product": an extra tab on every product page (title = tab name, text = panel). Shown as a
    // plain titled text when the page is previewed on its own.
    return (
      <article className="min-w-0">
        {w.title && <h2 className="font-head text-xl font-bold text-navy-deep">{tr(w.title)}</h2>}
        <div className={cn(productTabText, "mt-3")} dangerouslySetInnerHTML={{ __html: html(w.content) }} />
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

/**
 * Brands page hero (Figma 17:345): warm panel, gold rule + label, bold title + light second line, text and a dark
 * button on the left; on the right a wall of the first six brands of the store's Brand list (logo, or the name
 * when there is no logo) and a small note. Fields: eyebrow, title, subtitle (light line), content, linkText,
 * linkUrl, noteStrong, note.
 */
function BrandsHero({ w, ctx }: P) {
  const wall = ctx.brands.slice(0, 6);
  return (
    <div className="flex flex-col gap-8 rounded-[18px] border border-[#ece8df] bg-[#f8f7f3] px-6 py-8 md:px-[55px] md:py-[46px] lg:flex-row lg:items-center lg:gap-9">
      <div className="grid min-w-0 flex-1 content-start justify-items-start gap-3.5">
        <span aria-hidden className="h-[3px] w-[54px] bg-[#c08a2a]" />
        {w.eyebrow && <p className="text-[11.5px] font-semibold tracking-[0.16em] text-gold-menu uppercase">{tr(w.eyebrow)}</p>}
        <h1 className="font-head text-[36px] leading-[1.08] tracking-[-0.02em] text-[#1b2a44] md:text-[46px] xl:text-[54px] xl:leading-[56px]">
          {w.title && <span className="block font-bold">{tr(w.title)}</span>}
          {w.subtitle && <span className="block font-light">{tr(w.subtitle)}</span>}
        </h1>
        {w.content && <div className="max-w-[440px] text-base leading-[26px] text-[#4b5565] md:text-[17px]" dangerouslySetInnerHTML={{ __html: html(w.content) }} />}
        {w.linkText && (
          <SmartLink
            to={w.linkUrl}
            className="mt-1.5 inline-flex items-center gap-3 rounded-lg bg-[#1e2a44] px-[25px] py-3.5 text-[15px] font-semibold text-white transition hover:brightness-125"
          >
            {tr(w.linkText)}
            <Icon name="br-arrow-white" size={16} />
          </SmartLink>
        )}
      </div>
      {wall.length > 0 && (
        <>
          <span aria-hidden className="hidden h-[300px] w-px shrink-0 bg-[#e3ded3] lg:block" />
          <div className="grid min-w-0 flex-1 justify-items-center gap-7 border-t border-[#e3ded3] pt-8 lg:border-0 lg:pt-0">
            <ul className="grid w-full max-w-[460px] grid-cols-2 gap-y-[30px]">
              {wall.map((b) => (
                <li key={b.slug} className="flex h-14 items-center justify-center px-2">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} loading="lazy" className="max-h-full max-w-[85%] object-contain" />
                  ) : (
                    <span className="text-center font-head text-xl leading-tight font-semibold text-[#1b2a44] md:text-2xl">{b.name}</span>
                  )}
                </li>
              ))}
            </ul>
            {(w.noteStrong || w.note) && (
              <p className="flex items-center gap-2.5 text-xs tracking-[0.06em] text-[#4b5565]">
                <span aria-hidden className="size-2.5 shrink-0 bg-[#b8862e]" />
                <span>
                  {w.noteStrong && <strong className="font-bold text-ink-2">{tr(w.noteStrong)}</strong>}
                  {w.noteStrong && w.note && " · "}
                  {tr(w.note)}
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * All categories banner (Figma 80:303): photo with a navy fade from the left, gold spaced label, two-line title
 * whose `highlight` word is gold, text and a gold pill button. Without a photo the panel is plain navy.
 * Fields: eyebrow, title (line 1), subtitle (line 2), highlight, content, linkText, linkUrl, imageUrl, mobileImageUrl.
 */
function CategoriesHero({ w }: { w: any }) {
  const img = url(w.imageUrl);
  const mobile = url(w.mobileImageUrl) || img;
  const line2 = tr(w.subtitle);
  const hi = tr(w.highlight);
  const at = hi ? line2.indexOf(hi) : -1;
  return (
    <div className="relative isolate overflow-hidden rounded-[18px] bg-[#0b1d45]">
      {img && (
        <picture>
          <source media="(min-width: 761px)" srcSet={img} />
          <img src={mobile} alt="" className="absolute inset-0 -z-10 size-full object-cover object-right" />
        </picture>
      )}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(8_24_62/0.92)_0%,rgb(8_24_62/0.6)_45%,rgb(8_24_62/0.15)_80%)] md:bg-[linear-gradient(90deg,rgb(8_24_62/0.9)_0%,rgb(8_24_62/0.55)_38%,rgb(8_24_62/0)_62%)]"
      />
      <div className="grid max-w-[762px] content-center justify-items-start gap-3 px-6 py-12 md:min-h-[430px] md:px-14 md:py-16">
        {w.eyebrow && <p className="text-xs font-semibold tracking-[0.34em] text-[#e2b65a] uppercase">{tr(w.eyebrow)}</p>}
        <h1 className="font-head text-[34px] leading-[1.06] font-extrabold tracking-[-0.01em] text-white md:text-[46px]">
          {w.title && <span className="block">{tr(w.title)}</span>}
          {line2 && (
            <span className="block">
              {at >= 0 ? (
                <>
                  {line2.slice(0, at)}
                  <span className="bg-gradient-to-b from-[#f2cf7a] to-[#c9952e] bg-clip-text text-transparent">{hi}</span>
                  {line2.slice(at + hi.length)}
                </>
              ) : (
                line2
              )}
            </span>
          )}
        </h1>
        {w.content && <div className="mt-0.5 max-w-[460px] text-base leading-[1.5] text-mist md:text-lg" dangerouslySetInnerHTML={{ __html: html(w.content) }} />}
        {w.linkText && (
          <SmartLink
            to={w.linkUrl}
            className="mt-2.5 inline-flex h-[50px] items-center gap-2.5 rounded-full bg-gradient-to-b from-[#f1cd78] to-[#d4a447] px-[26px] text-base font-bold text-navy-deep shadow-[0_8px_22px_rgb(0_0_0/0.25)] transition hover:brightness-105"
          >
            {tr(w.linkText)}
            <Icon name="ct-arrow-down" size={16} />
          </SmartLink>
        )}
      </div>
    </div>
  );
}
