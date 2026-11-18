// Button / CTA (button-cta) and our variants: note, callout, banner, band, help.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { btn } from "@/lib/styles";
import { Icon, SmartLink } from "../../SmartLink";
import { card, goldBtn } from "../classes";
import { BannerWithContent } from "./Banners";
import { type P, url } from "./shared";

/* ---------- button-cta variants: note, callout ---------- */
export function ButtonCta({ w, ctx }: P) {
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
  if (w.variant === "band")
    // Figma About "Partner band": grey box with a centred title, one line and a gold button.
    return (
      <div className="flex flex-col items-center rounded-[14px] bg-surface-alt px-6 py-10 text-center">
        {w.title && <h2 className="font-head text-[22px] font-bold text-balance text-navy-deep lg:text-[26px]">{tr(w.title)}</h2>}
        {w.subtitle && <p className="mt-2.5 max-w-[480px] text-[15.5px] leading-[1.55] text-slate">{tr(w.subtitle)}</p>}
        {w.text && (
          <SmartLink to={w.link} className={cn(goldBtn, "mt-[22px] self-center")}>
            {tr(w.text)}
            <Icon name="arrow-right-white-14" size={14} />
          </SmartLink>
        )}
      </div>
    );
  if (w.variant === "help")
    // Figma FAQ "Still have a question?": grey bar with an icon, title, one line and a gold button.
    return (
      <div className="mx-auto flex w-full max-w-[960px] flex-col items-start gap-4 rounded-xl border border-line-3 bg-surface-alt px-[22px] py-6 sm:flex-row sm:items-center sm:gap-[18px] sm:px-[26px] sm:py-[21px]">
        <span className="flex shrink-0">
          <Icon name="about-chat" size={26} />
        </span>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-1">
          {w.title && <h2 className="font-head text-[17px] font-bold text-navy-deep">{tr(w.title)}</h2>}
          {w.subtitle && <p className="text-[14.5px] text-slate">{tr(w.subtitle)}</p>}
        </div>
        {w.text && (
          <SmartLink to={w.link} className={cn(goldBtn, "px-[22px]")}>
            {tr(w.text)}
            <Icon name="arrow-right-white-14" size={14} />
          </SmartLink>
        )}
      </div>
    );
  if (w.variant === "banner") return ctx.beside ? <TallCtaBanner w={w} /> : <CtaBanner w={w} />;
  if (!w.text) return null;
  return (
    <div style={{ textAlign: w.align ?? "center" }}>
      <SmartLink to={w.link} className={btnCls()}>
        {tr(w.text)}
      </SmartLink>
    </div>
  );
}

/**
 * button-cta variant "banner" in a side column (e.g. beside a product grid): the tall promo card —
 * title and text at the top, button at the bottom, picture as art in between. Same look as a Banners
 * card with a button, but button-cta keeps the button text (Banners loses it). theme "light" = light panel.
 */
function TallCtaBanner({ w }: { w: any }) {
  const c = {
    image: url(w.imageUrl),
    tablet: url(w.tabletImageUrl),
    mobile: url(w.mobileImageUrl),
    badge: w.eyebrow,
    title: w.title,
    description: w.subtitle,
    cta: tr(w.text),
    link: w.link,
    theme: w.theme,
  };
  if (!c.image || (!tr(c.title) && !c.cta)) return null;
  const picture = (c: any, cls: string) => (
    <picture>
      {c.mobile && <source media="(max-width:640px)" srcSet={c.mobile} />}
      {c.tablet && <source media="(max-width:1024px)" srcSet={c.tablet} />}
      <img src={c.image} alt="" loading="lazy" className={cls} />
    </picture>
  );
  return <BannerWithContent c={c} frame="group relative block overflow-hidden rounded-2xl shadow-card" tall full={false} picture={picture} />;
}

/**
 * button-cta variant "banner": a boxed banner whose eyebrow, title, text, button and note are real page
 * content, with the picture as art. Phone: picture (right part) on top, text panel below. Tablet/desktop:
 * navy text panel on the left fading into the picture's right part, so text still drawn into the
 * picture isn't shown twice. Fields: eyebrow, title, subtitle, text (button), link, note,
 * icon ("whatsapp" = WhatsApp badge on the button), imageUrl, tabletImageUrl, mobileImageUrl.
 */
function CtaBanner({ w }: { w: any }) {
  const desk = url(w.imageUrl);
  const tab = url(w.tabletImageUrl);
  const mobile = url(w.mobileImageUrl);
  const title = tr(w.title);
  if (!title && !w.text) return null;
  return (
    <article className="relative flex flex-col overflow-hidden rounded-[20px] bg-[#0b1f3f] text-white shadow-card md:block md:min-h-[380px] md:rounded-[26px] lg:min-h-[420px]">
      {desk && (
        <div className="relative aspect-square overflow-hidden sm:aspect-[6/5] md:absolute md:inset-0 md:aspect-auto">
          <picture>
            {mobile && <source media="(max-width:640px)" srcSet={mobile} />}
            {tab && <source media="(max-width:1024px)" srcSet={tab} />}
            <img src={desk} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-right" />
          </picture>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(180deg,rgb(11_31_63/0),#0b1f3f)] md:hidden" />
        </div>
      )}
      {desk && (
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,#0b1f3f_0%,#0b1f3f_50%,rgb(11_31_63/0)_66%)] md:block lg:bg-[linear-gradient(90deg,#0b1f3f_0%,#0b1f3f_52%,rgb(11_31_63/0)_63%)]"
        />
      )}
      <div className={cn("relative flex flex-col gap-3 px-6 pb-7 pt-5 md:h-full md:justify-center md:py-12 md:pl-10 lg:pl-14", desk ? "md:max-w-[56%] lg:max-w-[52%]" : "md:max-w-3xl")}>
        {w.eyebrow && (
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-soft md:text-xs">
            {tr(w.eyebrow)}
            <span aria-hidden className="h-px w-10 bg-gold-soft" />
          </p>
        )}
        {title && <h2 className="font-head text-[28px] font-bold leading-[1.1] md:text-[34px] lg:text-[44px]">{title}</h2>}
        {w.subtitle && <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/85 md:text-base lg:text-lg">{tr(w.subtitle)}</p>}
        {w.text && (
          <SmartLink to={w.link} className={btn("white", "lg", "mt-3 self-stretch rounded-full py-2.5 pl-2.5 pr-6 text-ink-2 sm:self-start")}>
            {w.icon === "whatsapp" && <Icon name="whatsapp-badge" size={36} />}
            <span className="whitespace-normal sm:whitespace-nowrap">{tr(w.text)}</span>
            <Icon name="arrow-right-navy" size={16} />
          </SmartLink>
        )}
        {w.note && <p className="text-[13px] text-white/60 sm:pl-6">{tr(w.note)}</p>}
      </div>
    </article>
  );
}
