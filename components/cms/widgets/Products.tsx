// Featured / Recommended / Products by Category: product grid.
// (The Ready Stock offers area is Text + Image variant "offers": this type drops our extra settings publicly.)
import { UI } from "@/lib/ui";
import { ProductCard } from "../../ProductCard";
import { type P } from "./shared";

export function Products({ w, ctx }: P) {
  const products: any[] = w.data ?? [];
  if (!products.length)
    return (
      <div className="grid grid-cols-1 h-full min-h-60 place-items-center rounded-[14px] border border-dashed border-[#c9d2de] p-8 text-center text-sm text-muted-3">
        {UI.productsComing}
      </div>
    );
  return (
    <div
      className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ ["--cols" as any]: w.columns ?? 2 }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} p={p} currency={ctx.currency} />
      ))}
    </div>
  );
}
