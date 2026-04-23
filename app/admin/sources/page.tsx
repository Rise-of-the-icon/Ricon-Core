import { redirect } from "next/navigation";

import SourceCitationManager from "@/apps/core/admin/SourceCitationManager";
import { requireAdminAccess } from "@/apps/core/admin/repository";

export default async function AdminSourcesRoute() {
  const access = await requireAdminAccess();

  if (!access) {
    redirect("/sign-in?next=/admin/sources");
  }

  return <SourceCitationManager />;
}
