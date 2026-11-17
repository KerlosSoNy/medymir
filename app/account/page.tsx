import { getTenant } from "@/lib/api";
import { UI } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { container, pageTitle } from "@/lib/styles";
import { Account } from "@/components/Account";
import { CmsSlot } from "@/components/CmsSlot";

export const metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const tenant = await getTenant();
  return (
    <>
      <div className={cn(container, "max-w-[820px]")}>
        <h1 className={pageTitle}>{UI.account}</h1>
        <Account currency={tenant?.locale.currency ?? null} />
      </div>
      <CmsSlot slug="account" />
    </>
  );
}
