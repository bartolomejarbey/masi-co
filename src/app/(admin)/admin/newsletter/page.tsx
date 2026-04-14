import { getAdminSupabase } from "@/lib/supabase-admin";
import { toggleNewsletterSubscriber } from "@/lib/admin-actions";
import { NewsletterClient } from "@/components/admin/NewsletterClient";
import type { NewsletterSubscriber } from "@/lib/types";

export default async function AdminNewsletterPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getAdminSupabase() as any;
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <NewsletterClient
      subscribers={(data ?? []) as NewsletterSubscriber[]}
      toggleAction={toggleNewsletterSubscriber}
    />
  );
}
