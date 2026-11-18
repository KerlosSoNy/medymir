"use client";
// "Sort by" menu above a product list (Figma Category toolbar, node 87:207). Changes ?order_by= in the page
// address; the store sorts the products. Options are the sort orders get-category-products supports.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UI } from "@/lib/ui";
import { Icon } from "./SmartLink";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get("order_by") ?? "";
  function change(value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set("order_by", value);
    else next.delete("order_by");
    next.delete("page");
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }
  return (
    <label className="flex items-center gap-2.5 text-[13px] text-[#5f6b7d]">
      <span className="whitespace-nowrap">{UI.sortBy}</span>
      <span className="relative">
        <select
          value={current}
          onChange={(e) => change(e.target.value)}
          className="h-[42px] w-[170px] cursor-pointer appearance-none rounded-lg border border-[#dce3ed] bg-white pr-9 pl-3.5 text-sm font-medium text-[#202b40] focus:border-blue focus:outline-none"
        >
          {UI.sortOptions.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2">
          <Icon name="select-chevron" size={12} />
        </span>
      </span>
    </label>
  );
}
