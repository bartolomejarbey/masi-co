import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient<Database> =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : (new Proxy({} as SupabaseClient<Database>, {
        get() {
          return () => ({ data: null, error: { message: "Supabase not configured" } });
        },
      }) as SupabaseClient<Database>);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
