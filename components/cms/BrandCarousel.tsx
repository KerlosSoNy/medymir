"use client";
// "Shop by brand" carousel (Figma node 10:62): tall image cards + "01 / 07" progress bar.
import { SmartLink } from "../SmartLink";
import { UI } from "@/lib/ui";
import { useScroller } from "./useScroller";

export function BrandCarousel({ cards }: { cards: { name: string; image: string; link: string }[] }) {
  const { ref, index, atEnd, prev, next } = useScroller(cards.length);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="brandcar">
      <div className="brandcar-arrows">
        <button className="round-btn sm" aria-label={UI.previous} onClick={prev} disabled={index === 0}>
          <img src="/icons/brand-chevron-left.svg" width={18} height={18} alt="" />
        </button>
        <button className="round-btn sm dark" aria-label={UI.nextSlide} onClick={next} disabled={atEnd}>
          <img src="/icons/brand-chevron-right-white.svg" width={18} height={18} alt="" />
        </button>
      </div>
      <div className="brandcar-track" ref={ref}>
        {cards.map((c, k) => (
          <SmartLink key={k} to={c.link} className="brandcard" ariaLabel={c.name}>
            <img src={c.image} alt={c.name} loading="lazy" />
          </SmartLink>
        ))}
      </div>
      <div className="brandcar-progress">
        <span>
          <b>{pad(index + 1)}</b> / {pad(cards.length)}
        </span>
        <div className="track">
          <div style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
