"use client";
// "Shop by brand" carousel (Figma node 10:62): tall image cards + "01 / 07" progress bar.
// Card sizes from Figma: 280×520 phone, 300×506 tablet, 343×506 desktop. A photo uploaded in the CMS
// fills the card. Without a photo the card is built from real content: the brand's logo (store Brand
// list) on a white plate, the name and tagline from the CMS ("Name — tagline"), and a "Shop brand" link.
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { Icon, SmartLink } from "../SmartLink";
import { coverImg, roundBtn, snapTrack } from "./classes";
import { useScroller } from "./useScroller";

export function BrandCarousel({ cards }: { cards: { name: string; image: string; link: string; logo: string | null }[] }) {
  const { ref, index, atEnd, prev, next } = useScroller(cards.length);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="relative">
      <div className="mb-4 flex gap-3 md:absolute md:-top-[94px] md:right-6 md:mb-0 md:gap-[26px] lg:right-14 xl:right-[132px]">
        <button className={roundBtn("sm")} aria-label={UI.previous} onClick={prev} disabled={index === 0}>
          <Icon name="brand-chevron-left" size={18} />
        </button>
        <button className={roundBtn("sm", true)} aria-label={UI.nextSlide} onClick={next} disabled={atEnd}>
          <Icon name="brand-chevron-right-white" size={18} />
        </button>
      </div>
      <div className={cn(snapTrack, "auto-cols-[280px] gap-3 md:auto-cols-[300px] lg:auto-cols-[343px] lg:gap-[18px]")} ref={ref}>
        {cards.map((c, k) => (
          <SmartLink
            key={k}
            to={c.link}
            ariaLabel={c.name}
            className="group relative block h-[520px] snap-start overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#10306f,#0a1d47)] md:h-[506px]"
          >
            {c.image ? (
              <img src={c.image} alt={c.name} loading="lazy" className={coverImg} />
            ) : (
              <BrandCard name={c.name} logo={c.logo} />
            )}
          </SmartLink>
        ))}
      </div>
      <div className="mt-9 flex items-center gap-4 pr-4 text-[13px] font-semibold text-muted-3 md:gap-12 md:pl-[70px] md:pr-6 lg:pr-14">
        <span className="shrink-0">
          <b className="text-ink-2">{pad(index + 1)}</b> / {pad(cards.length)}
        </span>
        <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-line-2 md:w-[min(822px,60vw)] md:flex-none">
          <div className="h-full rounded-[3px] bg-[#e0a93b] transition-[width] duration-300" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

/** Brand card built from real content (no picture of text): logo plate, name, tagline, link label. */
function BrandCard({ name, logo }: { name: string; logo: string | null }) {
  const [title, tagline] = name.split(/\s+[—–-]\s+/);
  return (
    <span className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_80%_15%,rgb(47_93_208/0.5),transparent_55%)] p-7 text-white">
      {logo ? (
        <span className="flex h-[120px] w-full items-center justify-center rounded-xl bg-white p-2 shadow-[0_10px_30px_rgb(0_0_0/0.18)]">
          <img src={logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
        </span>
      ) : (
        <span aria-hidden />
      )}
      <span className="flex flex-col gap-2">
        <span className="font-head text-[30px] font-bold leading-tight">{title}</span>
        {tagline && <span className="text-[15px] text-white/75">{tagline}</span>}
        <span className="mt-3 h-[3px] w-10 rounded-full bg-gold-soft" aria-hidden />
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-[gap] group-hover:gap-3">
          {UI.shopBrand}
          <Icon name="arrow-right-white-sm" size={15} />
        </span>
      </span>
    </span>
  );
}
