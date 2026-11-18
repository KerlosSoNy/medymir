// Banners / Hero Banner (small-banner cards). A card with a button text (cta_text) gets real text + button
// over the picture; without one, the picture is shown as-is and is the link.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { btn } from "@/lib/styles";
import { Icon, SmartLink } from "../../SmartLink";
import { type P, url } from "./shared";

export function Banners({ w, ctx }: P) {
  const cards: any[] = (w.cards ?? w.items ?? [])
    .map((c: any) => ({
      ...c,
      image: url(c.image ?? c.imageUrl),
      mobile: url(c.mobile_image ?? c.mobileImageUrl),
      tablet: url(c.tablet_image ?? c.tabletImageUrl),
      cta: tr(c.cta_text ?? c.ctaText),
    }))
    .filter((c: any) => c.image);
  if (!cards.length) return null;
  const boxed = ctx.row !== "full";
  const frame = cn(
    "group relative block overflow-hidden",
    boxed && "rounded-2xl shadow-card",
    ctx.row === "banner" && "rounded-[20px] md:rounded-[26px]",
  );
  const picture = (c: any, cls: string) => (
    <picture>
      {c.mobile && <source media="(max-width:640px)" srcSet={c.mobile} />}
      {c.tablet && <source media="(max-width:1024px)" srcSet={c.tablet} />}
      <img src={c.image} alt={c.cta ? "" : tr(c.title)} loading="lazy" className={cls} />
    </picture>
  );
  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((c, i) =>
        c.cta ? (
          <BannerWithContent key={i} c={c} frame={frame} tall={!!ctx.beside} full={!boxed} picture={picture} />
        ) : (
          <SmartLink key={i} to={c.link} ariaLabel={tr(c.title) || undefined} className={frame}>
            {picture(
              c,
              cn(
                "block h-auto w-full",
                boxed && "transition duration-500 ease-out group-hover:scale-[1.015]",
                ctx.beside && "sm:max-lg:aspect-[720/560] sm:max-lg:object-cover sm:max-lg:object-[50%_8%]",
              ),
            )}
          </SmartLink>
        ),
      )}
    </div>
  );
}

/**
 * Banner whose title, text and button are real page content (see Banners).
 * The picture's art is shown on the side away from the text and the text sits on a solid panel, so a
 * picture that still has its own drawn text/button (Figma exports) doesn't show it twice:
 *  - wide banner: phone = picture (right part) on top + text panel below; tablet/desktop = text panel on
 *    the left fading into the picture's right part.
 *  - tall promo (beside products): text panel at the top, button panel at the bottom, art in between.
 */
export function BannerWithContent({
  c,
  frame,
  tall,
  full,
  picture,
}: {
  c: any;
  frame: string;
  tall: boolean;
  /** Full-width row: the text lines up with the page's side margin. */
  full: boolean;
  picture: (c: any, cls: string) => React.ReactNode;
}) {
  // Card theme from the CMS: "light" = light panel with dark text; "dark" (or none) = navy panel with white text.
  const lightPanel = c.theme === "light";
  const panel = lightPanel ? "bg-surface-alt text-ink" : "bg-[#0b1f3f] text-white";
  const fadeX = lightPanel
    ? "md:bg-[linear-gradient(90deg,#f5f7fa_0%,#f5f7fa_44%,rgb(245_247_250/0)_66%)]"
    : "md:bg-[linear-gradient(90deg,#0b1f3f_0%,#0b1f3f_44%,rgb(11_31_63/0)_66%)]";
  const fadeY = lightPanel
    ? "bg-[linear-gradient(180deg,#f5f7fa_0%,#f5f7fa_40%,rgb(245_247_250/0)_56%,rgb(245_247_250/0)_80%,#f5f7fa_90%)]"
    : "bg-[linear-gradient(180deg,#0b1f3f_0%,#0b1f3f_40%,rgb(11_31_63/0)_56%,rgb(11_31_63/0)_80%,#0b1f3f_90%)]";

  const text = (
    <div className="flex flex-col gap-3">
      {c.badge && (
        <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", lightPanel ? "text-gold-text" : "text-gold-soft")}>{tr(c.badge)}</p>
      )}
      {c.title && <h2 className="font-head text-[26px] font-bold leading-tight md:text-[32px] lg:text-[40px]">{tr(c.title)}</h2>}
      {c.description && (
        <p className={cn("text-[15px] leading-relaxed md:text-base", lightPanel ? "text-muted" : "text-white/85")}>{tr(c.description)}</p>
      )}
    </div>
  );
  const button = (
    <SmartLink
      to={c.link}
      className={btn(lightPanel ? "dark" : "white", "lg", "mt-2 self-start rounded-full after:absolute after:inset-0 after:content-['']")}
    >
      {c.cta}
      <Icon name={lightPanel ? "arrow-right-white" : "arrow-right-navy"} size={16} />
    </SmartLink>
  );

  if (tall)
    return (
      <article className={cn(frame, panel, "flex min-h-[520px] flex-col md:aspect-[720/560] md:min-h-0 lg:aspect-[503/712]")}>
        {picture(c, "absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.015]")}
        <div aria-hidden className={cn("absolute inset-0", fadeY)} />
        <div className="relative flex h-full flex-1 flex-col justify-between gap-6 p-6 md:p-8">
          {text}
          {button}
        </div>
      </article>
    );

  return (
    <article className={cn(frame, panel, "flex flex-col md:block md:aspect-[3/1]")}>
      <div className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
        {picture(c, "absolute inset-0 size-full object-cover object-right transition duration-500 ease-out group-hover:scale-[1.015]")}
      </div>
      <div aria-hidden className={cn("absolute inset-0 hidden md:block", fadeX)} />
      <div className={cn("relative flex flex-col justify-center gap-3 p-6 md:h-full md:max-w-[46%] md:p-10", full && "md:pl-6 lg:pl-14 xl:pl-[132px] lg:pr-6")}>
        {text}
        {button}
      </div>
    </article>
  );
}
