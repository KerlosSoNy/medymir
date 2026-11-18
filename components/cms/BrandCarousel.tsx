"use client";
// "Shop by brand" carousel (Figma node 10:62): tall image cards + "01 / 05" progress bar, built on Swiper.
// Card sizes from Figma: 280×520 phone, 300×506 tablet, 343×506 desktop. A brand photo fills the card on
// its own. Without a photo the card is built from real content: the brand's logo (store Brand list) on a
// white plate, the name and tagline ("Name — tagline"), and a "Shop brand" link.
// The counter and progress bar count Swiper's scroll positions (snaps), not cards: when several cards fit
// on screen there are fewer positions than cards, so the numbers move one step per click and never jump.
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperApi } from "swiper";
import "swiper/css";
import { UI } from "@/lib/ui";
import { Icon, SmartLink } from "../SmartLink";
import { coverImg, roundBtn } from "./classes";

export function BrandCarousel({ cards }: { cards: { name: string; image: string; link: string; logo: string | null }[] }) {
  const [api, setApi] = useState<SwiperApi | null>(null);
  const [state, setState] = useState({ step: 0, steps: cards.length, start: true, end: false });
  const pad = (n: number) => String(n).padStart(2, "0");
  const sync = (s: SwiperApi) =>
    setState({ step: s.snapIndex, steps: Math.max(1, s.snapGrid.length), start: s.isBeginning, end: s.isEnd });
  const shown = state.end ? state.steps : state.step + 1;
  return (
    <div className="relative">
      <div className="mb-4 flex gap-3 md:absolute md:-top-[94px] md:right-6 md:mb-0 md:gap-[26px] lg:right-14 xl:right-[132px]">
        <button className={roundBtn("sm")} aria-label={UI.previous} onClick={() => api?.slidePrev()} disabled={state.start}>
          <Icon name="brand-chevron-left" size={18} />
        </button>
        <button className={roundBtn("sm", true)} aria-label={UI.nextSlide} onClick={() => api?.slideNext()} disabled={state.end}>
          <Icon name="brand-chevron-right-white" size={18} />
        </button>
      </div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={12}
        breakpoints={{ 1025: { spaceBetween: 18 } }}
        watchOverflow
        onSwiper={(s) => {
          setApi(s);
          sync(s);
        }}
        onSlideChange={sync}
        onSnapGridLengthChange={sync}
        onReachEnd={sync}
        onReachBeginning={sync}
        onResize={sync}
      >
        {cards.map((c, k) => (
          <SwiperSlide key={k} className="w-[280px]! md:w-[300px]! lg:w-[343px]!">
            <SmartLink
              to={c.link}
              ariaLabel={c.name}
              className="group relative block h-[520px] overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#10306f,#0a1d47)] md:h-[506px]"
            >
              {c.image ? <img src={c.image} alt={c.name} loading="lazy" className={coverImg} /> : <BrandCard name={c.name} logo={c.logo} />}
            </SmartLink>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-9 flex items-center gap-4 pr-4 text-[13px] font-semibold text-muted-3 md:gap-12 md:pl-[70px] md:pr-6 lg:pr-14">
        <span className="shrink-0">
          <b className="text-ink-2">{pad(shown)}</b> / {pad(state.steps)}
        </span>
        <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-line-2 md:w-[min(822px,60vw)] md:flex-none">
          <div className="h-full rounded-[3px] bg-[#e0a93b] transition-[width] duration-300" style={{ width: `${(shown / state.steps) * 100}%` }} />
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
