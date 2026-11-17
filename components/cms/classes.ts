// Tailwind class recipes shared by the CMS widgets (Figma: Home — Desktop 1440 / Tablet 768 / Mobile 390).
import { cn } from "@/lib/cn";

/** Horizontal scrollers (carousels, tab rows) hide their scrollbar. */
export const noScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Scroll-snap track for carousels. */
export const snapTrack = cn("grid grid-cols-none grid-flow-col overflow-x-auto snap-x snap-mandatory overscroll-x-contain", noScrollbar);

const EYEBROW_COLOR: Record<string, string> = {
  blue: "text-blue text-xs tracking-[0.16em] normal-case",
  grey: "text-[#4b5565]",
  gold: "text-gold-text",
  teal: "text-teal",
  sky: "text-sky",
};

/** Small uppercase label above a heading. */
export const eyebrow = (color = "grey", wide = false) =>
  cn(
    "inline-flex items-center gap-3.5 text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-pre-wrap",
    EYEBROW_COLOR[color] ?? EYEBROW_COLOR.grey,
    wide && "tracking-[0.18em]",
  );

/** White bordered card (quote form, side cards). */
export const card = "bg-white border border-line rounded-2xl";
export const sideCard = cn(card, "grid grid-cols-1 gap-4 p-[22px] md:p-[30px]");
export const sideTitle = "font-head font-bold text-[22px] md:text-2xl tracking-[-0.01em] text-ink-2";

/** Round arrow button used by the carousels. */
export const roundBtn = (size: "md" | "sm" = "md", dark = false) =>
  cn(
    "grid grid-cols-1 place-items-center shrink-0 rounded-full border cursor-pointer transition hover:shadow-[0_6px_16px_rgb(15_31_64/0.12)] disabled:opacity-50 disabled:cursor-default disabled:hover:shadow-none",
    size === "md" ? "size-11 md:size-[57px] border-[#e1e5eb]" : "size-11 md:size-[51px] border-[#e6e9ee]",
    dark ? "bg-ink-2 border-ink-2" : "bg-white",
  );

/** Hover lift for image cards. */
export const cardHover = "transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgb(15_31_64/0.12)]";

/** Image that fills its frame, cropped (object-cover) with a gentle zoom on hover of the parent `group`. */
export const coverImg = "absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]";

/** Initials for image placeholders, e.g. "Boston Scientific" -> "BS". */
export const initials = (s: string) =>
  s
    .split(/[\s&/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
