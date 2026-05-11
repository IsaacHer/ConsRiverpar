import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()

  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')
    .single<SiteSettings>()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-rp-gray-100">
      <div className="text-center space-y-6 px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="block w-3 h-12 bg-rp-red rounded-sm" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-rp-black">
            Riverpar SAS
          </h1>
        </div>

        <p className="text-rp-gray-500 text-lg tracking-widest uppercase">
          En construcción
        </p>

        <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-rp-gray-200 max-w-md mx-auto">
          <p className="text-xs font-mono text-rp-gray-500 uppercase tracking-wider mb-3">
            Verificación Supabase
          </p>
          {error ? (
            <div className="text-rp-red text-sm">
              <p className="font-semibold">Error de conexión</p>
              <p className="text-rp-gray-500 mt-1">{error.message}</p>
              <p className="text-rp-gray-500 mt-1 text-xs">
                Reemplaza los valores en .env.local con tus credenciales reales de Supabase.
              </p>
            </div>
          ) : (
            <p className="text-rp-black font-semibold">
              {settings?.company_name ?? 'Sin datos en site_settings'}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
