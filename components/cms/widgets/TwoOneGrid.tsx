// Two-One Grid (two-one-grid): titled groups of brand / product / category cards.
import { cn } from "@/lib/cn";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { ProductCard } from "../../ProductCard";
import { SmartLink } from "../../SmartLink";
import { cardHover, coverImg, initials } from "../classes";
import { type P, type WidgetCtx, url } from "./shared";

export function TwoOneGrid({ w, ctx }: P) {
  const groups = [
    { title: tr(w["one-section-title"] ?? w.oneSectionTitle), items: (w["one-grid-data"] ?? w.oneGridData ?? []) as any[] },
    { title: tr(w["second-section-title"] ?? w.secondSectionTitle), items: (w["second-grid-data"] ?? w.secondGridData ?? []) as any[] },
  ].filter((g) => g.items.length > 0);
  if (!groups.length) return null;
  const wide = groups.length === 1;
  return (
    <div className={cn("grid grid-cols-1 gap-10", !wide && "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8")}>
      {groups.map((g, gi) => (
        <section key={gi} className="flex min-w-0 flex-col gap-5">
          {g.title && <h2 className="font-head text-[26px] font-bold text-ink md:text-[30px] lg:text-[34px]">{g.title}</h2>}
          <div
            className={cn(
              "grid grid-cols-2 gap-3 md:gap-4",
              wide ? "md:grid-cols-3 lg:grid-cols-4" : gi === 0 ? "md:grid-cols-3" : "md:grid-cols-2",
            )}
          >
            {g.items.map((e, i) => (
              <GridEntry key={i} e={e} ctx={ctx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GridEntry({ e, ctx }: { e: any; ctx: WidgetCtx }) {
  const d = e.data ?? e;
  if (e.type === "product") return <ProductCard p={d} currency={ctx.currency} />;
  if (e.type === "category") {
    const cat = ctx.categories.find((c) => c.id === d.id);
    const name = tr(d.name ?? d.title) || cat?.name || "";
    const img = url(d.image_url ?? d.image) || cat?.image_url || "";
    return (
      <SmartLink to={`/category/${d.slug ?? cat?.slug ?? d.id}`} className={cn("group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white", cardHover)}>
        <span className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#10306f,#0a1d47)]">
          {img ? (
            <img src={img} alt="" loading="lazy" className={coverImg} />
          ) : (
            <span aria-hidden className="absolute inset-0 grid grid-cols-1 place-items-center font-head text-4xl font-bold text-white/70">
              {initials(name)}
            </span>
          )}
        </span>
        <span className="p-4 text-[15px] font-semibold text-ink-2">{name}</span>
      </SmartLink>
    );
  }
  // Brand entry: name and logo from the store's Brand list.
  const name = tr(d.value ?? d.name ?? e.brandName);
  if (!name) return null;
  const brand = ctx.brands.find((b) => b.name === name);
  const logo = url(d.image_url ?? e.brandLogo) || brand?.logo || "";
  const count = Number(d.products_count);
  return (
    <SmartLink
      to={`/brand/${brand?.slug ?? d.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className={cn("group flex flex-col items-center gap-3 rounded-[14px] border border-line bg-white p-5 text-center", cardHover)}
    >
      <span className="flex h-20 w-full items-center justify-center">
        {logo ? (
          <img src={logo} alt="" loading="lazy" className="max-h-full max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-[1.04]" />
        ) : (
          <span className="font-head text-xl font-bold text-dark">{name}</span>
        )}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-ink-2">{name}</span>
        {count > 0 && <span className="text-[13px] text-muted">{UI.productCount(count)}</span>}
      </span>
    </SmartLink>
  );
}
