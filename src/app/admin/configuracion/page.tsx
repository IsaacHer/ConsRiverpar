export const dynamic = 'force-dynamic'

import { getSiteSettingsAdmin } from '@/lib/data/admin'
import ConfigForm from './_components/ConfigForm'

export default async function ConfiguracionPage() {
  const settings = await getSiteSettingsAdmin()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-rp-black">
          Configuración
        </h1>
        <p className="text-sm text-rp-gray-500 mt-1">
          Datos de contacto, WhatsApp y SEO del sitio.
        </p>
      </div>
      <ConfigForm settings={settings} />
    </div>
  )
}
