"use client";
// Full-width hero slider (Figma node 9:70): image slides, round navy arrows, gold active dot.
import { useEffect, useState } from "react";
import { SmartLink } from "../SmartLink";
import { UI } from "@/lib/ui";
import { useScroller } from "./useScroller";

export interface HeroSlide {
  desk: string;
  tab: string;
  mobile: string;
  title: string;
  link: string;
}

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
    <div className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
      <div className="hero-track" ref={ref}>
        {slides.map((s, k) => (
          <SmartLink key={k} to={s.link} className="hero-slide" ariaLabel={s.title || `${k + 1} / ${slides.length}`}>
            <picture>
              <source media="(max-width:640px)" srcSet={s.mobile} />
              <source media="(max-width:1024px)" srcSet={s.tab} />
              <img src={s.desk} alt={s.title} loading={k === 0 ? "eager" : "lazy"} fetchPriority={k === 0 ? "high" : "auto"} />
            </picture>
          </SmartLink>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button className="hero-arrow prev" aria-label={UI.previous} onClick={() => go((index - 1 + slides.length) % slides.length)}>
            <img src="/icons/hero-chevron-left.svg" width={18} height={18} alt="" />
          </button>
          <button className="hero-arrow next" aria-label={UI.nextSlide} onClick={() => go((index + 1) % slides.length)}>
            <img src="/icons/hero-chevron-right.svg" width={18} height={18} alt="" />
          </button>
          <div className="hero-dots">
            {slides.map((_, k) => (
              <button key={k} aria-label={`${k + 1}`} aria-current={k === index} className={k === index ? "on" : ""} onClick={() => go(k)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
