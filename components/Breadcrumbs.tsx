// "Home › Page" trail above CMS pages (Figma About / FAQ / Contact); policies add a middle step
// ("Home › Policies & information › Shipping policy").
import Link from "next/link";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { container, containerWide, sectionX } from "@/lib/styles";
import { Icon } from "./SmartLink";

/** shop: align with the shop pages (container width) instead of the page-builder sections. wide: the product page column. */
export function Breadcrumbs({ current, parent, shop, wide }: { current: string; parent?: string; shop?: boolean; wide?: boolean }) {
  return (
    <nav aria-label={UI.breadcrumb} className={wide ? containerWide : shop ? container : sectionX}>
      <ol className={cn("mx-auto flex items-center gap-2.5 text-[13px]", wide ? "pt-3 pb-4" : "max-w-[1176px] pt-7")}>
        <li>
          <Link href="/" className="text-slate hover:underline">
            {UI.home}
          </Link>
        </li>
        <li aria-hidden>
          <Icon name="breadcrumb-sep" size={10} />
        </li>
        {parent && (
          <>
            <li className="shrink-0 text-slate">{parent}</li>
            <li aria-hidden>
              <Icon name="breadcrumb-sep" size={10} />
            </li>
          </>
        )}
        <li aria-current="page" className="min-w-0 truncate font-medium text-navy-deep">
          {current}
        </li>
      </ol>
    </nav>
  );
}
