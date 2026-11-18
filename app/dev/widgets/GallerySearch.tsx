"use client";
import { useState } from "react";
import { input } from "@/lib/styles";

/** Filters the gallery by widget name / description, like the search in the TheCoins "Add widget" menu. */
export function GallerySearch({ total }: { total: number }) {
  const [shown, setShown] = useState(total);
  const filter = (q: string) => {
    const query = q.trim().toLowerCase();
    let n = 0;
    document.querySelectorAll<HTMLElement>("[data-widget]").forEach((el) => {
      const hit = !query || (el.dataset.widget ?? "").includes(query);
      el.hidden = !hit;
      if (hit) n++;
    });
    document.querySelectorAll<HTMLElement>("[data-group]").forEach((g) => {
      g.hidden = !g.querySelector("[data-widget]:not([hidden])");
    });
    setShown(n);
  };
  return (
    <div className="mb-4 grid grid-cols-1 gap-1.5">
      <input type="search" placeholder="Search widgets..." aria-label="Search widgets" className={input} onChange={(e) => filter(e.target.value)} />
      <p className="text-[13px] text-muted">{shown === total ? `${total} widgets` : `${shown} of ${total} widgets`}</p>
    </div>
  );
}
