// Section heading (text-image, variant "section-header"): label, title, text and a "view all" link.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { Icon, SmartLink } from "../../SmartLink";
import { eyebrow } from "../classes";
import { type P, html } from "./shared";

const LINK_ICON: Record<string, string> = { blue: "arrow-right-blue", gold: "arrow-right-gold", default: "arrow-right-navy" };
const LINK_COLOR: Record<string, string> = { blue: "text-blue-link", gold: "text-gold-link", default: "text-ink-2" };
const TITLE_SIZE: Record<string, string> = {
  md: "text-[26px] md:text-[30px] lg:text-[34px] font-bold",
  lg: "text-[26px] md:text-[30px] lg:text-[40px] font-bold",
  xl: "text-[26px] md:text-[36px] lg:text-[46px] font-semibold",
};

export function SectionHeader({ w, ctx }: P) {
  const linkText = tr(w.linkText).replace("{count}", String(ctx.productCount));
  const center = w.align === "center";
  return (
    <header
      className={cn(
        "flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-6",
        center && "items-center text-center md:justify-center",
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
