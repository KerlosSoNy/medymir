// Shared Tailwind class recipes, so buttons and page layouts look the same everywhere.
import { cn } from "./cn";

type BtnVariant = "dark" | "navy" | "outline" | "white" | "gold" | "plain";
type BtnSize = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2.5 rounded-full border-[1.5px] border-transparent font-semibold leading-tight whitespace-nowrap cursor-pointer transition [&_img]:shrink-0 hover:brightness-110 disabled:opacity-55 disabled:cursor-not-allowed";

const btnVariants: Record<BtnVariant, string> = {
  dark: "bg-dark text-white",
  navy: "bg-navy-btn text-white rounded-lg",
  outline:
    "border-dark text-dark bg-transparent hover:bg-dark hover:text-white hover:brightness-100 hover:[&_img]:brightness-0 hover:[&_img]:invert",
  white: "bg-white text-ink-2 rounded-lg",
  gold: "bg-gold-btn text-white font-head",
  plain: "bg-surface-alt text-ink-2",
};

const btnSizes: Record<BtnSize, string> = {
  sm: "px-3.5 py-2 text-[13px]",
  md: "px-[22px] py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/** Button classes, e.g. btn("dark"), btn("gold", "lg", "w-full"). */
export const btn = (variant: BtnVariant = "dark", size: BtnSize = "md", ...extra: (string | false | undefined)[]) =>
  cn(btnBase, btnVariants[variant], btnSizes[size], ...extra);

/** Centered page column with the site gutter (Figma: 16px phone, 24px tablet, 32px desktop). */
export const container = "w-full max-w-[calc(var(--container-site)+64px)] mx-auto px-4 md:px-6 lg:px-8";

/** Horizontal padding used by full-width home sections (Figma: 16 / 24 / 56 / 132px). */
export const sectionX = "px-4 md:px-6 lg:px-14 xl:px-[132px]";

export const pageTitle = "font-head font-bold text-[28px] md:text-[32px] lg:text-4xl tracking-[-0.01em] text-ink mt-8 md:mt-10 mb-2";
export const pageIntro = "text-muted mb-6";

export const notice = (kind: "info" | "ok" | "err" = "info") =>
  cn(
    "rounded-lg px-4 py-3.5 text-sm [&_a]:font-semibold [&_a]:text-blue-link",
    kind === "info" && "bg-surface-alt",
    kind === "ok" && "bg-[#e3f4ec] text-[#11603a]",
    kind === "err" && "bg-[#fdecec] text-[#8a1c1c]",
  );

export const linkBtn = "bg-transparent border-0 p-0 text-muted underline cursor-pointer text-[13px]";

/** Form field (Figma Form/Field). */
export const field = "flex flex-col gap-1.5 text-[13px] font-semibold text-ink-2";
export const input =
  "w-full rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-[15px] font-normal text-ink-2 placeholder:text-muted-3 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20";
