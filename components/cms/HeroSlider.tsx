"use client";
// Full-width hero slider (Figma node 9:70): image slides, round navy arrows, gold active dot.
// Slides are 3:1 at every size (Figma: 1440×480, 768×256, 390×130).
// A slide with a button text (cta_text) in the CMS is background art: its title, subtitle and button
// are rendered as real content. A slide without one is shown as a picture that links to cta_link.
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { btn } from "@/lib/styles";
import { Icon, SmartLink } from "../SmartLink";
import { snapTrack } from "./classes";
import { useScroller } from "./useScroller";

export interface HeroSlide {
  desk: string;
  tab: string;
  mobile: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
}

const arrow =
  "absolute top-1/2 grid grid-cols-1 size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white bg-[rgb(11_31_63/0.9)] transition hover:bg-[rgb(11_31_63)] md:size-[47px] [&_img]:block [&_img]:size-4 [&_img]:max-w-none [&_img]:shrink-0 md:[&_img]:size-[18px]";

export function HeroSlider({ slides, autoplay, interval }: { slides: HeroSlide[]; autoplay: boolean; interval: number }) {
  const { ref, index, go } = useScroller(slides.length);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoplay || paused || slides.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go((index + 1) % slides.length), Math.max(3, interval) * 1000);
    return () => clearInterval(t);
  }, [autoplay, paused, interval, index, go, slides.length]);

  return (
    <div
      className="relative bg-[#0b1f3f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className={cn(snapTrack, "auto-cols-[100%]")} ref={ref}>
        {slides.map((s, k) => {
          const pic = (
            <picture>
              <source media="(max-width:640px)" srcSet={s.mobile} />
              <source media="(max-width:1024px)" srcSet={s.tab} />
              <img
                src={s.desk}
                alt={s.ctaText ? "" : s.title}
                loading={k === 0 ? "eager" : "lazy"}
                fetchPriority={k === 0 ? "high" : "auto"}
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
          );
          if (!s.ctaText)
            return (
              <SmartLink key={k} to={s.link} className="relative block aspect-[3/1] snap-start" ariaLabel={s.title || `${k + 1} / ${slides.length}`}>
                {pic}
              </SmartLink>
            );
          // Real title/subtitle/button on a solid navy panel; the picture's art shows on the right (on phones
          // the art sits on top and the text below), so text drawn into the picture isn't shown twice.
          return (
            <div key={k} className="relative flex snap-start flex-col bg-[#0b1f3f] md:block md:aspect-[3/1]">
              <div className="relative aspect-[16/9] overflow-hidden md:absolute md:inset-0 md:aspect-auto [&_img]:object-right">{pic}</div>
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(90deg,#0b1f3f_0%,#0b1f3f_50%,rgb(11_31_63/0)_64%)] md:block"
              />
              <div className="relative flex flex-col justify-center gap-3 px-6 py-7 text-white md:h-full md:max-w-[52%] md:px-6 lg:pl-14 xl:pl-[78px]">
                {s.title && <h2 className="font-head text-[26px] font-bold leading-tight md:text-[34px] lg:text-[46px] xl:text-[52px]">{s.title}</h2>}
                {s.subtitle && <p className="text-[15px] text-white/85 md:text-lg">{s.subtitle}</p>}
                <SmartLink to={s.link} className={btn("gold", "lg", "mt-2 self-start text-ink")}>
                  {s.ctaText}
                  <Icon name="arrow-right-navy" size={16} />
                </SmartLink>
              </div>
            </div>
          );
        })}
      </div>
      {slides.length > 1 && (
        <>
          <button className={cn(arrow, "left-2 md:left-[23px]")} aria-label={UI.previous} onClick={() => go((index - 1 + slides.length) % slides.length)}>
            <img src="/icons/hero-chevron-left.svg" width={18} height={18} alt="" />
          </button>
          <button className={cn(arrow, "right-2 md:right-[23px]")} aria-label={UI.nextSlide} onClick={() => go((index + 1) % slides.length)}>
            <img src="/icons/hero-chevron-right.svg" width={18} height={18} alt="" />
          </button>
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-[19px] md:left-auto md:right-[34px] md:translate-x-0 md:gap-3.5">
            {slides.map((_, k) => (
              <button
                key={k}
                aria-label={`${k + 1}`}
                aria-current={k === index}
                className={cn("size-2 cursor-pointer rounded-full transition-colors md:size-[11px]", k === index ? "bg-gold-soft" : "bg-white/55 hover:bg-white/80")}
                onClick={() => go(k)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
