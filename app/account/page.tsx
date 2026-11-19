import { getTenant } from "@/lib/api";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { container } from "@/lib/styles";
import { Account } from "@/components/Account";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsSlot } from "@/components/CmsSlot";

export const metadata = { title: "Account", robots: { index: false } };

// Account page (Figma "Account — …", nodes 102:3, 102:174, 102:478). Sections: /account (Overview),
// ?tab=orders | quotes | addresses | details. Everything private is loaded in the browser (components/Account.tsx).
export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [tenant, { tab }] = await Promise.all([getTenant(), searchParams]);
  return (
    <>
      <Breadcrumbs current={UI.acct.title} shop />
      <div className={cn(container, "pt-5 pb-14 md:pb-[72px]")}>
        <Account currency={tenant?.locale.currency ?? null} tab={tab ?? ""} />
      </div>
      <CmsSlot slug="account" />
    </>
  );
}
