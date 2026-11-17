import { getTenant } from "@/lib/api";
import { UI } from "@/lib/ui";
import { Account } from "@/components/Account";
import { CmsSlot } from "@/components/CmsSlot";

export const metadata = { title: "Account", robots: { index: false } };

export default async function AccountPage() {
  const tenant = await getTenant();
  return (
    <>
      <div className="container narrow">
        <h1 className="page-title">{UI.account}</h1>
        <Account currency={tenant?.locale.currency ?? null} />
      </div>
      <CmsSlot slug="account" />
    </>
  );
}
