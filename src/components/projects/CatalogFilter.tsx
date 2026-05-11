'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import Button from '@/components/ui/Button'

export default function CatalogFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const estadoRef = useRef<HTMLSelectElement>(null)
  const precioMinRef = useRef<HTMLInputElement>(null)
  const precioMaxRef = useRef<HTMLInputElement>(null)

  const currentEstado = searchParams.get('estado') ?? ''
  const currentPrecioMin = searchParams.get('precio_min') ?? ''
  const currentPrecioMax = searchParams.get('precio_max') ?? ''
  const currentOrden = searchParams.get('orden') ?? ''

  const hasFilters = !!(currentEstado || currentPrecioMin || currentPrecioMax)

  function handleSearch() {
    const params = new URLSearchParams()
    const estado = estadoRef.current?.value
    const precioMin = precioMinRef.current?.value
    const precioMax = precioMaxRef.current?.value

    if (estado) params.set('estado', estado)
    if (precioMin) params.set('precio_min', precioMin)
    if (precioMax) params.set('precio_max', precioMax)
    if (currentOrden) params.set('orden', currentOrden)

    router.push(`/proyectos?${params.toString()}`)
  }

  function handleClear() {
    if (estadoRef.current) estadoRef.current.value = ''
    if (precioMinRef.current) precioMinRef.current.value = ''
    if (precioMaxRef.current) precioMaxRef.current.value = ''
    router.push('/proyectos')
  }

  const inputClass =
    'w-full rounded-md border border-rp-gray-200 bg-white px-3 py-2.5 text-sm text-rp-black placeholder:text-rp-gray-500 focus:outline-none focus:ring-2 focus:ring-rp-red focus:border-transparent'

  return (
    <div className="bg-white rounded-xl shadow-md border border-rp-gray-200 p-5 sm:p-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Estado comercial */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-rp-gray-700 uppercase tracking-wide">
            Estado comercial
          </label>
          <select
            name="estado"
            ref={estadoRef}
            defaultValue={currentEstado}
            className={inputClass}
          >
            <option value="">Todos los estados</option>
            <option value="preventa">Preventa</option>
            <option value="en_obra">En obra</option>
            <option value="listo_entrega">Listo para entrega</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        {/* Precio mínimo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-rp-gray-700 uppercase tracking-wide">
            Precio mínimo
          </label>
          <input
            type="number"
            name="precio_min"
            ref={precioMinRef}
            defaultValue={currentPrecioMin}
            placeholder="$0"
            min={0}
            className={inputClass}
          />
        </div>

        {/* Precio máximo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-rp-gray-700 uppercase tracking-wide">
            Precio máximo
          </label>
          <input
            type="number"
            name="precio_max"
            ref={precioMaxRef}
            defaultValue={currentPrecioMax}
            placeholder="Sin límite"
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button size="md" onClick={handleSearch}>
          Buscar
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="md" onClick={handleClear}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
