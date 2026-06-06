"use client";

import { createBrowserClient } from "@supabase/ssr";

// Singleton — safe to call from any Client Component.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
