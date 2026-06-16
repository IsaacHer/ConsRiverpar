import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

function isSupabaseAuthCookie(name: string) {
  return name.startsWith('sb-') && name.includes('-auth-token')
}

export function createClient() {
  // Supabase renamed "anon key" to "publishable key" in 2024
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ''

  try {
    const cookieStore = cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore
              .getAll()
              .filter((c) => !isSupabaseAuthCookie(c.name))
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // setAll is called from a Server Component — can be ignored if middleware handles refreshing
            }
          },
        },
      }
    )
  } catch {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey,
      {
        cookies: {
          getAll() { return [] },
          setAll() {},
        },
      }
    )
  }
}

// Cliente singleton para operaciones administrativas con service role key.
// Se inicializa una sola vez cuando el módulo se carga, evitando la
// condición de carrera del primer render en frío de Next.js donde
// process.env puede no estar completamente disponible en cada llamada.
let _serviceClient: ReturnType<typeof createServerClient> | null = null

export function createServiceClient() {
  if (_serviceClient) return _serviceClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      '[createServiceClient] Variables de entorno no disponibles. ' +
      'Verifica NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local'
    )
  }

  // El service client no maneja sesiones de usuario
  _serviceClient = createServerClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    cookies: {
      getAll() { return [] },
      setAll() {},
    },
  })

  return _serviceClient
}
