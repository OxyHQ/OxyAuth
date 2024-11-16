import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";
import { UserEmailForm } from "@/components/forms/user-email-form";
import { UserColorForm } from "@/components/forms/user-color-form";
import { UserUsernameForm } from "@/components/forms/user-username-form";

export const metadata = constructMetadata({
  title: "Settings – Oxy Auth",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <UserRoleForm user={{ id: user.id, role: user.role }} />
        <UserEmailForm user={{ id: user.id, email: user.email || "" }} />
        <UserColorForm user={{ id: user.id, color: user.color || "" }} />
        <UserUsernameForm user={{ id: user.id, username: user.username || "" }} />
        <DeleteAccountSection />
      </div>
    </>
  );
}
