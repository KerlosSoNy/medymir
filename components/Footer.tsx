// Footer (Figma node 11:359). Texts and links come from the CMS "site-layout" page,
// categories from the catalogue, store name / tagline from TheCoins branding.
import DOMPurify from "isomorphic-dompurify";
import type { Category, Tenant } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";

const heading = "mb-3.5 text-xs font-semibold tracking-[0.2em] text-gold-soft lg:mb-[18px]";
const link = "transition-colors hover:text-gold-soft";
/** Desktop puts a faint "|" between inline links (Figma 11:359); phone/tablet don't. */
const separated = "lg:before:mx-4 lg:before:opacity-25 lg:before:content-['|'] lg:first:before:content-none";

const CONTACT_ICON: Record<string, string> = { mail: "footer-mail", email: "footer-mail", pin: "footer-pin", clock: "footer-clock", hours: "footer-clock" };

function Columns({ items }: { items: any[] }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="grid grid-cols-2 gap-x-4 lg:flex lg:gap-8">
      {[items.slice(0, half), items.slice(half)].map((col, i) => (
        <ul key={i} className="flex flex-col gap-3 text-[14.5px] lg:gap-[13px]">
          {col.map((x, j) => (
            <li key={j}>
              <SmartLink to={x.link} className={cn(link, x.highlight && "font-semibold text-gold-soft")}>
                {tr(x.label ?? x.name)}
              </SmartLink>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function Footer({ tenant, layout, categories }: { tenant: Tenant | null; layout: Record<string, any>; categories: Category[] }) {
  const about = layout["footer-about"];
  const brands = layout["footer-column"];
  const support = layout["footer-links"];
  const legal = layout["legal-links"];
  const contact = layout["footer-contact"];
  const payments = layout["payments"];
  const highlight = layout["category-nav"]?.highlight;

  return (
    <footer className="relative overflow-hidden bg-linear-to-r from-[#0e1f45] to-[#14306a] text-white">
      <div
        className="pointer-events-none absolute left-[210px] top-[120px] hidden whitespace-nowrap font-head text-[250px] font-bold leading-none tracking-[-0.02em] opacity-[0.04] lg:block"
        aria-hidden
      >
        {(tenant?.name ?? "").toUpperCase()}
      </div>
      {/* Phone (Figma 112:2): one column. Tablet (112:75): 2×2 grid. Desktop (11:359): one row of columns. */}
      <div className="relative flex flex-col gap-6 px-4 pb-7 pt-8 md:gap-7 md:px-6 md:pb-[30px] md:pt-10 lg:gap-6 lg:px-[82px] lg:pb-[22px] lg:pt-[46px]">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-7 lg:flex lg:flex-row lg:flex-wrap lg:justify-between lg:gap-8">
          <div className="flex flex-col items-start gap-[26px]">
            <Logo tenant={tenant} variant="footer" />
            {about?.content && (
              <div
                className="max-w-[340px] text-sm leading-[22px] opacity-[0.88] lg:max-w-[300px]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tr(about.content)) }}
              />
            )}
          </div>
          {categories.length > 0 && (
            <div>
              <h3 className={heading}>{UI.categories.toUpperCase()}</h3>
              <Columns items={categories.map((c) => ({ label: c.name, link: `/category/${c.slug ?? c.id}`, highlight: c.slug === highlight }))} />
            </div>
          )}
          {brands?.items?.length > 0 && (
            <div>
              <h3 className={heading}>{tr(brands.title)}</h3>
              <Columns items={brands.items} />
            </div>
          )}
          {contact?.contactInfo?.length > 0 && (
            <div>
              <h3 className={cn(heading, "mb-[18px]")}>{tr(contact.title)}</h3>
              <ul className="flex flex-col gap-[13px] text-[14.5px]">
                {contact.contactInfo.map((c: any, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <img src={`/icons/${CONTACT_ICON[String(c.icon).toLowerCase()] ?? "footer-pin"}.svg`} width={17} height={17} alt="" className="size-[17px] max-w-none shrink-0" />
                    {/@/.test(c.value) ? (
                      <a href={`mailto:${c.value}`} className={cn(link, "break-all")}>
                        {tr(c.value)}
                      </a>
                    ) : (
                      <span>{tr(c.value)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {support?.items?.length > 0 && (
          <div className="border-t border-white/14 pt-6 md:pt-7 lg:flex lg:flex-wrap lg:items-center lg:gap-x-[22px] lg:gap-y-4 lg:border-y lg:border-[#2b4277] lg:py-5">
            <h3 className={cn(heading, "mb-3.5 md:mb-3 lg:mb-0 lg:mr-3")}>{tr(support.title)}</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13.5px] md:flex md:flex-wrap md:gap-x-5 md:gap-y-2.5 lg:gap-x-0 lg:gap-y-2 lg:text-sm">
              {support.items.map((x: any, i: number) => (
                <li key={i} className={cn("opacity-75 lg:opacity-100", separated)}>
                  <SmartLink to={x.link} className={link}>
                    {tr(x.label)}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-6 border-t border-white/14 pt-6 text-[13.5px] md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-7 md:pt-7 lg:justify-between lg:gap-4 lg:border-t-0 lg:pt-0">
          {legal?.items?.length > 0 && (
            <ul className="order-3 flex flex-wrap gap-x-[18px] gap-y-2.5 md:order-1 md:flex-1 lg:flex-none lg:gap-x-0 lg:gap-y-2">
              {legal.items.map((x: any, i: number) => (
                <li key={i} className={cn("opacity-80 lg:opacity-75", separated)}>
                  <SmartLink to={x.link} className={link}>
                    {tr(x.label)}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
          <p className="order-2 opacity-75 md:order-3 md:basis-full lg:order-2 lg:basis-auto">
            © {new Date().getFullYear()} {tenant?.name}. {UI.allRightsReserved}
          </p>
          {payments?.imageUrl ? (
            <img src={payments.imageUrl} alt="" height={38} className="order-1 h-[38px] w-auto max-w-none shrink-0 self-start md:order-2 md:self-auto lg:order-3" />
          ) : (
            <span className="hidden lg:order-3 lg:block" />
          )}
        </div>
      </div>
    </footer>
  );
}
