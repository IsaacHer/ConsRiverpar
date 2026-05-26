'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Loader2 } from 'lucide-react'
import type { ProjectAmenity } from '@/types'

type AmenityItem = Pick<ProjectAmenity, 'id' | 'name'>

export default function AmenitiesSection({
  projectId,
  initialAmenities,
}: {
  projectId: string
  initialAmenities: AmenityItem[]
}) {
  const router = useRouter()
  const [amenities, setAmenities] = useState<AmenityItem[]>(initialAmenities)
  const [input, setInput] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  // Sincroniza el estado interno cuando el servidor recarga datos frescos
  // (ocurre cuando router.refresh() actualiza el Server Component)
  useEffect(() => {
    setAmenities(initialAmenities)
  }, [initialAmenities])

  async function handleAdd() {
    const name = input.trim()
    if (!name || isAdding) return
    setIsAdding(true)
    const res = await fetch('/api/admin/amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, name }),
    })
    const data = await res.json()
    setIsAdding(false)
    if (res.ok && data.id) {
      setAmenities((prev) => [...prev, { id: data.id, name }])
      setInput('')
      inputRef.current?.focus()
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    setDeletingIds((prev) => new Set(prev).add(id))
    const res = await fetch(`/api/admin/amenities/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAmenities((prev) => prev.filter((a) => a.id !== id))
      router.refresh()
    }
    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-rp-black">Amenidades</h2>
        <p className="text-xs text-rp-gray-500 mt-0.5">
          Características y servicios destacados del proyecto.
        </p>
      </div>

      {amenities.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {amenities.map((a) => {
            const isDeleting = deletingIds.has(a.id)
            return (
              <li
                key={a.id}
                className="inline-flex items-center gap-1.5 bg-rp-gray-100 text-rp-black text-sm px-3 py-1 rounded-full"
              >
                <span>{a.name}</span>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={isDeleting}
                  className="text-rp-gray-500 hover:text-rp-red transition-colors disabled:opacity-40"
                  aria-label={`Eliminar ${a.name}`}
                >
                  {isDeleting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <X size={12} />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Ej: Piscina, Gimnasio, Parqueadero..."
          className="flex-1 border border-rp-gray-200 rounded-lg px-3 py-2 text-sm text-rp-black placeholder:text-rp-gray-500 focus:outline-none focus:ring-2 focus:ring-rp-red/30 focus:border-rp-red"
          disabled={isAdding}
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim() || isAdding}
          className="inline-flex items-center gap-1.5 bg-rp-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-rp-red-dark disabled:opacity-50 transition-colors"
        >
          {isAdding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          Agregar
        </button>
      </div>
    </div>
  )
}
