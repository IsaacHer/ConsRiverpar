'use client'

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import Image from 'next/image'
import { Star, ImageOff, ChevronUp, ChevronDown } from 'lucide-react'
import type { ProjectMedia } from '@/types'

type MediaItem = Pick<ProjectMedia, 'id' | 'public_url' | 'is_main' | 'sort_order'>

export type GalleryHandle = {
  addItem: (item: MediaItem) => void
}

type Props = {
  projectId: string
  initialMedia: MediaItem[]
  onGalleryChange?: () => void
}

const ProjectMediaGallery = forwardRef<GalleryHandle, Props>(
  function ProjectMediaGallery({ projectId, initialMedia, onGalleryChange }, ref) {
    const sorted = [...initialMedia].sort((a, b) => a.sort_order - b.sort_order)

    const [items, setItems] = useState<MediaItem[]>(sorted)
    const [savedIds, setSavedIds] = useState<string[]>(sorted.map((i) => i.id))
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    // Sincroniza el estado interno cuando el servidor envía datos nuevos
    // Esto ocurre cuando router.refresh() recarga el Server Component
    useEffect(() => {
      const fresh = [...initialMedia].sort((a, b) => a.sort_order - b.sort_order)
      setItems(fresh)
      setSavedIds(fresh.map((i) => i.id))
    }, [initialMedia])

    const isDirty = items.map((i) => i.id).join(',') !== savedIds.join(',')

    useImperativeHandle(ref, () => ({
      addItem(item: MediaItem) {
        setItems((prev) => {
          const isFirst = prev.length === 0
          return [...prev, { ...item, is_main: isFirst ? true : item.is_main }]
        })
        setSavedIds((prev) => [...prev, item.id])
      },
    }))

    function setLoading(id: string, on: boolean) {
      setLoadingIds((prev) => {
        const next = new Set(prev)
        on ? next.add(id) : next.delete(id)
        return next
      })
    }

    async function handleSetMain(id: string) {
      setLoading(id, true)
      let snapshot: MediaItem[] = []
      setItems((prev) => {
        snapshot = prev
        return prev.map((i) => ({ ...i, is_main: i.id === id }))
      })

      const res = await fetch(`/api/admin/media/${id}/main`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })
      setLoading(id, false)
      if (!res.ok) setItems(snapshot)
      else onGalleryChange?.()
    }

    async function handleDelete(id: string) {
      setLoading(id, true)
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => {
          const wasMain = prev.find((i) => i.id === id)?.is_main ?? false
          const filtered = prev.filter((i) => i.id !== id)
          if (wasMain && filtered.length > 0) {
            return filtered.map((item, idx) => ({ ...item, is_main: idx === 0 }))
          }
          return filtered
        })
        setSavedIds((prev) => prev.filter((sid) => sid !== id))
        onGalleryChange?.()
      }
      setLoading(id, false)
    }

    function handleMove(index: number, dir: 'up' | 'down') {
      const newIndex = dir === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= items.length) return
      setItems((prev) => {
        const arr = [...prev]
        ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
        return arr
      })
    }

    async function handleSaveOrder() {
      setIsSavingOrder(true)
      const updates = items.map((item, idx) => ({ id: item.id, sort_order: idx }))
      const res = await fetch('/api/admin/media/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      setIsSavingOrder(false)
      if (res.ok) {
        setItems((prev) => prev.map((item, idx) => ({ ...item, sort_order: idx })))
        setSavedIds(items.map((i) => i.id))
        onGalleryChange?.()
      }
    }

    function handleUndoOrder() {
      setItems((prev) => {
        const byId = Object.fromEntries(prev.map((i) => [i.id, i]))
        return savedIds.filter((id) => byId[id]).map((id) => byId[id])
      })
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 py-10">
          <ImageOff size={36} className="text-rp-gray-200" />
          <p className="text-sm font-medium text-rp-gray-700">Sin imágenes aún</p>
          <p className="text-xs text-rp-gray-500">Las imágenes que subas aparecerán aquí</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {isDirty && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            <p className="text-sm text-amber-700">Tienes cambios sin guardar en el orden</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndoOrder}
                className="text-xs text-amber-600 hover:text-amber-800 underline"
              >
                Deshacer
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={isSavingOrder}
                className="text-xs font-medium bg-rp-red text-white px-3 py-1.5 rounded-md hover:bg-rp-red-dark disabled:opacity-50 transition-colors"
              >
                {isSavingOrder ? 'Guardando...' : 'Guardar orden'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => {
            const isLoading = loadingIds.has(item.id)
            return (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden border border-rp-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative group aspect-[4/3]">
                  <Image
                    src={item.public_url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />

                  {isLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
                      <div className="w-5 h-5 border-2 border-rp-red border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {item.is_main && (
                    <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <Star size={9} className="fill-white" />
                      Principal
                    </span>
                  )}

                  <span className="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-rp-gray-700/80 backdrop-blur text-white text-xs font-semibold">
                    {idx + 1}
                  </span>

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex flex-col items-center justify-center gap-2">
                    {!item.is_main && (
                      <button
                        onClick={() => handleSetMain(item.id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 bg-white text-rp-black text-xs font-medium px-3 py-1.5 rounded-md hover:bg-rp-gray-100 transition-colors disabled:opacity-50"
                      >
                        <Star size={12} className="fill-current" />
                        Hacer principal
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-100 text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 px-2 py-1.5 bg-white">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0 || isLoading}
                    className="p-1 rounded text-rp-gray-700 hover:bg-rp-gray-100 disabled:opacity-30 transition-colors"
                    title="Mover arriba"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === items.length - 1 || isLoading}
                    className="p-1 rounded text-rp-gray-700 hover:bg-rp-gray-100 disabled:opacity-30 transition-colors"
                    title="Mover abajo"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default ProjectMediaGallery
