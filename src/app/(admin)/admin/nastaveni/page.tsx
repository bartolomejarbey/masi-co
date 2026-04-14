import { getAdminSupabase } from "@/lib/supabase-admin";
import { updateSiteSetting } from "@/lib/admin-actions";
import { SettingsClient } from "@/components/admin/SettingsClient";
import type { SiteSetting } from "@/lib/types";

export default async function AdminSettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getAdminSupabase() as any;
  const { data, error } = await db.from("site_settings").select("*");

  if (error) throw new Error(error.message);

  return (
    <SettingsClient
      settings={(data ?? []) as SiteSetting[]}
      updateAction={updateSiteSetting}
    />
  );
}
