"use client";
// Product page photo stage (Figma "Gallery / Stage", node 76:304): white framed picture with an enlarge button.
// Figma shows one picture; when the product has more (additional_images), thumbnails appear under the stage
// (not in Figma, same style). The enlarge button opens the picture full screen (Esc or click to close).
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { UI } from "@/lib/ui";
import { Icon } from "./SmartLink";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const src = images[i];

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-[#e3e8ef] bg-white p-[18px] md:aspect-auto md:h-[627px] md:p-[27px] lg:aspect-square lg:h-auto">
        {src ? (
          <img src={src} alt={alt} className="size-full rounded-md object-contain" fetchPriority="high" />
        ) : (
          <div className="grid size-full place-items-center rounded-md bg-[#f3f5f9] text-[13px] font-medium text-[#8a94a6]">{UI.noImage}</div>
        )}
        {src && (
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={UI.zoomImage}
            className="absolute right-3 bottom-3 grid size-[42px] cursor-pointer place-items-center rounded-[10px] border border-[#e3e8ef] bg-white transition hover:border-[#cfd6e0] md:right-3 md:bottom-3"
          >
            <Icon name="pd-zoom" size={20} />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((s, n) => (
            <button
              key={s + n}
              type="button"
              onClick={() => setI(n)}
              aria-label={UI.showImage(n + 1)}
              aria-current={n === i}
              className={cn(
                "aspect-square cursor-pointer overflow-hidden rounded-lg border bg-white p-1.5 transition",
                n === i ? "border-gold-btn ring-1 ring-gold-btn" : "border-[#e3e8ef] hover:border-[#cfd6e0]",
              )}
            >
              <img src={s} alt="" loading="lazy" className="size-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {zoom && src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-[#0b1b3a]/85 p-4 md:p-10"
        >
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg bg-white object-contain p-4" />
          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label={UI.close}
            autoFocus
            className="absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full bg-white"
          >
            <Icon name="drawer-close" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
