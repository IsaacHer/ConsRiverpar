'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const ORDEN_OPTIONS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
] as const

export default function OrdenSelect({ currentOrden }: { currentOrden: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('orden', value)
    router.push(`/proyectos?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="orden-select" className="text-sm text-rp-gray-700 whitespace-nowrap">
        Ordenar por:
      </label>
      <div className="relative">
        <select
          id="orden-select"
          defaultValue={currentOrden}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none rounded-md border border-rp-gray-200 bg-white pl-3 pr-8 py-2 text-sm text-rp-black focus:outline-none focus:ring-2 focus:ring-rp-red cursor-pointer"
        >
          {ORDEN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg className="h-4 w-4 text-rp-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
