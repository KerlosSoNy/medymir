// Footer (Figma node 11:359). Texts and links come from the CMS "site-layout" page,
// categories from the catalogue, store name / tagline from TheCoins branding.
import DOMPurify from "isomorphic-dompurify";
import type { Category, Tenant } from "@/lib/api";
import { tr } from "@/lib/format";
import { UI } from "@/lib/ui";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";

const CONTACT_ICON: Record<string, string> = { mail: "footer-mail", email: "footer-mail", pin: "footer-pin", clock: "footer-clock", hours: "footer-clock" };

function Columns({ items }: { items: any[] }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="f-cols">
      {[items.slice(0, half), items.slice(half)].map((col, i) => (
        <ul key={i}>
          {col.map((x, j) => (
            <li key={j}>
              <SmartLink to={x.link} className={x.highlight ? "hl" : undefined}>
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
    <footer className="site-footer">
      <div className="f-watermark" aria-hidden>
        {(tenant?.name ?? "").toUpperCase()}
      </div>
      <div className="f-inner">
        <div className="f-top">
          <div className="f-brand">
            <Logo tenant={tenant} variant="footer" />
            {about?.content && <div className="f-about" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tr(about.content)) }} />}
          </div>
          {categories.length > 0 && (
            <div className="f-col">
              <h3>{UI.categories.toUpperCase()}</h3>
              <Columns items={categories.map((c) => ({ label: c.name, link: `/category/${c.slug ?? c.id}`, highlight: c.slug === highlight }))} />
            </div>
          )}
          {brands?.items?.length > 0 && (
            <div className="f-col">
              <h3>{tr(brands.title)}</h3>
              <Columns items={brands.items} />
            </div>
          )}
          {contact?.contactInfo?.length > 0 && (
            <div className="f-col">
              <h3>{tr(contact.title)}</h3>
              <ul className="f-contact">
                {contact.contactInfo.map((c: any, i: number) => (
                  <li key={i}>
                    <img src={`/icons/${CONTACT_ICON[String(c.icon).toLowerCase()] ?? "footer-pin"}.svg`} width={17} height={17} alt="" />
                    {/@/.test(c.value) ? <a href={`mailto:${c.value}`}>{tr(c.value)}</a> : <span>{tr(c.value)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {support?.items?.length > 0 && (
          <div className="f-support">
            <h3>{tr(support.title)}</h3>
            <ul>
              {support.items.map((x: any, i: number) => (
                <li key={i}>
                  <SmartLink to={x.link}>{tr(x.label)}</SmartLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="f-legal">
          {legal?.items?.length > 0 && (
            <ul>
              {legal.items.map((x: any, i: number) => (
                <li key={i}>
                  <SmartLink to={x.link}>{tr(x.label)}</SmartLink>
                </li>
              ))}
            </ul>
          )}
          <p>
            © {new Date().getFullYear()} {tenant?.name}. {UI.allRightsReserved}
          </p>
          {payments?.imageUrl ? <img src={payments.imageUrl} alt="" height={38} className="f-payments" /> : <span />}
        </div>
      </div>
    </footer>
  );
}
