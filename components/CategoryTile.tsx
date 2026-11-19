// Category tile (Figma Card/Category tile 17:268): photo on top (navy with initials when there is none),
// name + chevron below, optional description. Used by /categories and the "tiles" look of the Categories section.
import Link from "next/link";
import type { Category } from "@/lib/api";

export function CategoryTile({ cat: c, hideDescription }: { cat: Pick<Category, "name" | "image_url" | "description"> & { slug?: string; id: string }; hideDescription?: boolean }) {
  return (
    <Link
      href={`/category/${c.slug ?? c.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e3e7ed] bg-white transition hover:border-[#c5cdd8] hover:shadow-[0_12px_30px_rgb(15_31_64/0.1)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#16408a]">
        {c.image_url ? (
          <img
            src={c.image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-end bg-[radial-gradient(circle_at_80%_20%,rgb(255_255_255/0.18),transparent_55%)] p-3 font-head text-3xl leading-none font-bold text-white/25 sm:text-4xl"
          >
            {c.name.slice(0, 2)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="flex items-center justify-between gap-2 text-[13.5px] font-semibold text-ink-2">
          <span className="min-w-0">{c.name}</span>
          <img src="/icons/chevron-right-slate.svg" width={13} height={13} alt="" className="size-[13px] shrink-0 transition-transform group-hover:translate-x-0.5" />
        </span>
        {!hideDescription && c.description && <span className="line-clamp-2 text-xs text-muted">{c.description}</span>}
      </div>
    </Link>
  );
}
