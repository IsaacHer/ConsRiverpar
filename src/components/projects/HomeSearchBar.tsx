'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'preventa', label: 'Preventa' },
  { value: 'en_obra', label: 'En obra' },
  { value: 'listo_entrega', label: 'Listo para entrega' },
  { value: 'vendido', label: 'Vendido' },
]

export default function HomeSearchBar() {
  const router = useRouter()
  const [estado, setEstado] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')

  function handleSearch() {
    const params = new URLSearchParams()
    if (estado) params.set('estado', estado)
    const min = precioMin.replace(/\D/g, '')
    const max = precioMax.replace(/\D/g, '')
    if (min) params.set('precio_min', min)
    if (max) params.set('precio_max', max)
    const qs = params.toString()
    router.push(`/proyectos${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-rp-gray-200 px-6 py-5">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Estado comercial */}
        <div className="flex-1 min-w-[160px] space-y-1.5">
          <label className="block text-xs font-semibold text-rp-gray-700 uppercase tracking-wider">
            Estado comercial
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full h-10 rounded-md border border-rp-gray-200 px-3 text-sm text-rp-black bg-white focus:outline-none focus:ring-2 focus:ring-rp-red focus:border-transparent appearance-none cursor-pointer"
          >
            {ESTADOS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div className="flex-1 min-w-[140px] space-y-1.5">
          <label className="block text-xs font-semibold text-rp-gray-700 uppercase tracking-wider">
            Precio mínimo
          </label>
          <input
            type="text"
            placeholder="$0"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-10 rounded-md border border-rp-gray-200 px-3 text-sm text-rp-black placeholder:text-rp-gray-500 focus:outline-none focus:ring-2 focus:ring-rp-red focus:border-transparent"
          />
        </div>

        {/* Precio máximo */}
        <div className="flex-1 min-w-[140px] space-y-1.5">
          <label className="block text-xs font-semibold text-rp-gray-700 uppercase tracking-wider">
            Precio máximo
          </label>
          <input
            type="text"
            placeholder="Sin límite"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-10 rounded-md border border-rp-gray-200 px-3 text-sm text-rp-black placeholder:text-rp-gray-500 focus:outline-none focus:ring-2 focus:ring-rp-red focus:border-transparent"
          />
        </div>

        {/* Buscar */}
        <div className="shrink-0">
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 h-10 bg-rp-red hover:bg-rp-red-dark text-white font-medium text-sm px-6 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-red focus-visible:ring-offset-2"
          >
            <Search size={16} aria-hidden="true" />
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}
