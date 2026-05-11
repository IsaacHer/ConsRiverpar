'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Supabase renamed "anon key" to "publishable key" in 2024 — support both names
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey
  )
}
