"use client";
// "Shop by category" carousel (Figma node 9:207): navy cards with text + photo, arrows and dots.
import Link from "next/link";
import { UI } from "@/lib/ui";
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
    <div className="catcar">
      <div className="catcar-track" ref={ref}>
        {cats.map((c) => (
          <article key={c.id} className="catcard">
            <div className="catcard-text">
              <h3>{c.name}</h3>
              {c.description && <p>{c.description}</p>}
              <Link href={c.href} className="btn btn-white">
                {label}
                <img src="/icons/arrow-right-dark-sm.svg" width={16} height={16} alt="" />
              </Link>
            </div>
            <Link href={c.href} className="catcard-img" tabIndex={-1} aria-hidden>
              {c.image && <img src={c.image} alt="" loading="lazy" />}
            </Link>
          </article>
        ))}
      </div>
      <div className="catcar-controls">
        <p>{footnote}</p>
        <div className="catcar-nav">
          <button className="round-btn" aria-label={UI.previous} onClick={prev} disabled={index === 0}>
            <img src="/icons/chevron-left-grey.svg" width={18} height={18} alt="" />
          </button>
          <div className="dots">
            {cats.map((c, k) => (
              <button key={c.id} aria-label={c.name} className={k === index ? "on" : ""} onClick={() => go(k)} />
            ))}
          </div>
          <button className="round-btn" aria-label={UI.nextSlide} onClick={next} disabled={atEnd}>
            <img src="/icons/chevron-right-dark.svg" width={18} height={18} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
