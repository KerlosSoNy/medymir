"use client";
// "Shop by category" carousel (Figma node 9:207): navy cards with text + photo, arrows and dots.
// Card sizes from Figma: 300×524 phone, 330×524 tablet, 501×501 desktop. The photo fills the space
// under the text and is cropped to fit, so any image size works; without a photo a patterned
// navy panel with the category initials is shown.
import Link from "next/link";
import { cn } from "@/lib/cn";
import { btn } from "@/lib/styles";
import { UI } from "@/lib/ui";
import { Icon } from "../SmartLink";
import { coverImg, initials, roundBtn, snapTrack } from "./classes";
import { useScroller } from "./useScroller";

interface Cat {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

export function CategoryCarousel({ cats, label, footnote }: { cats: Cat[]; label: string; footnote: string }) {
  const { ref, index, atEnd, go, prev, next } = useScroller(cats.length);
  return (
    <div>
      <div className={cn(snapTrack, "auto-cols-[300px] gap-3 md:auto-cols-[330px] lg:auto-cols-[501px] lg:gap-[22px]")} ref={ref}>
        {cats.map((c) => (
          <article key={c.id} className="group flex h-[524px] snap-start flex-col overflow-hidden rounded-2xl bg-cat-card lg:aspect-square lg:h-auto">
            <div className="grid grid-cols-1 justify-items-start gap-1.5 px-6 pb-4 pt-6 md:px-8 md:pt-8 lg:px-9 lg:pb-[22px] lg:pt-9">
              <h3 className="line-clamp-2 font-head text-[28px] font-normal leading-8 text-white md:text-[30px] md:leading-9 lg:text-[34px] lg:leading-10">
                {c.name}
              </h3>
              {c.description && <p className="mb-3.5 line-clamp-2 text-[15px] text-[#e3e9f5] md:text-[17px] lg:text-[19px]">{c.description}</p>}
              <Link href={c.href} className={btn("white", "md", !c.description && "mt-3")}>
                {label}
                <img src="/icons/arrow-right-dark-sm.svg" width={16} height={16} alt="" className="block shrink-0 grow-0 max-w-none size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <Link
              href={c.href}
              tabIndex={-1}
              aria-hidden
              className="relative min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_75%_25%,rgb(47_93_208/0.45),transparent_60%),linear-gradient(160deg,#10306f,#0a1d47)]"
            >
              {c.image ? (
                <img src={c.image} alt="" loading="lazy" className={coverImg} />
              ) : (
                <span className="absolute inset-0 grid grid-cols-1 place-items-center font-head text-[96px] font-bold leading-none text-white/10">
                  {initials(c.name)}
                </span>
              )}
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-start gap-3 pr-4 md:flex-row md:items-center md:justify-between md:pr-6 lg:pr-14 xl:pr-[132px]">
        <p className="text-[13.5px] text-[#4b5565]">{footnote}</p>
        <div className="flex items-center gap-4 md:gap-[26px]">
          <button className={roundBtn()} aria-label={UI.previous} onClick={prev} disabled={index === 0}>
            <Icon name="chevron-left-grey" size={18} />
          </button>
          <div className="flex gap-3 md:gap-4">
            {cats.map((c, k) => (
              <button
                key={c.id}
                aria-label={c.name}
                aria-current={k === index}
                className={cn("size-[9px] cursor-pointer rounded-full transition-colors", k === index ? "bg-blue" : "bg-[#c8ced8] hover:bg-muted-3")}
                onClick={() => go(k)}
              />
            ))}
          </div>
          <button className={roundBtn()} aria-label={UI.nextSlide} onClick={next} disabled={atEnd}>
            <Icon name="chevron-right-dark" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
