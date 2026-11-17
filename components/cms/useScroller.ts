"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Horizontal scroll-snap track with prev/next and the index of the first visible card. */
export function useScroller(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
      setIndex(Math.min(count - 1, Math.round(el.scrollLeft / Math.max(1, step))));
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [count]);

  const go = useCallback((i: number) => {
    const el = ref.current;
    const child = el?.children[Math.max(0, Math.min(i, el.children.length - 1))] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  return { ref, index, atEnd, go, prev: () => go(index - 1), next: () => go(index + 1) };
}
