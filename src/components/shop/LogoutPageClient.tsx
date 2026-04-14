"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

export function LogoutPageClient() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = getBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    };

    void run();
  }, [router]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-4xl font-bold">Na chvíli strpení</h1>
      <p className="mt-4 text-sm leading-6 text-gray-600">Právě vás bezpečně odhlašujeme z vašeho účtu.</p>
    </div>
  );
}
