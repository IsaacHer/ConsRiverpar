import { Info } from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-rp-black">Configuración</h1>
        <p className="text-sm text-rp-gray-500 mt-1">Ajustes generales del sitio y del CMS</p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Módulo en construcción</p>
          <p className="text-sm text-blue-700 mt-1">
            Aquí podrás editar el nombre de la empresa, datos de contacto, número de WhatsApp,
            SEO global del sitio y otros ajustes del panel. Disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
