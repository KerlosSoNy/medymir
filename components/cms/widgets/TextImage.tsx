// Text + Image (text-image). Variant "section-header" → SectionHeader.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { type P, html, url } from "./shared";
import { SectionHeader } from "./SectionHeader";

export function TextImage({ w, ctx }: P) {
  if (w.variant === "section-header") return <SectionHeader w={w} ctx={ctx} />;
  if (w.variant === "payments" || w.variant === "footer-about") return null; // rendered by the footer
  const img = url(w.imageUrl);
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2" style={{ background: w.backgroundColor || undefined }}>
      {img && (
        <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-alt", w.imagePosition !== "left" && "lg:order-last")}>
          <img src={img} alt={tr(w.title)} loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
      )}
      <div>
        {w.title && <h2 className="mb-3 font-head text-[26px] md:text-[30px] lg:text-[34px] font-bold leading-[1.2] text-ink">{tr(w.title)}</h2>}
        <div className="rich" dangerouslySetInnerHTML={{ __html: html(w.content) }} />
      </div>
    </div>
  );
}
