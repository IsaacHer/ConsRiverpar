'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Building2, ChevronLeft, ChevronRight,
  X, ZoomIn, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectDetailMedia } from '@/lib/data/projects'

type GalleryItem =
  | { type: 'image'; data: ProjectDetailMedia }
  | { type: 'video'; embedUrl: string }

interface ProjectGalleryProps {
  media: ProjectDetailMedia[]
  projectName: string
  videoUrl?: string | null
}

const MAX_VISIBLE_THUMBNAILS = 8

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      // YouTube Shorts: /shorts/ID
      if (u.pathname.includes('/shorts/')) {
        const id = u.pathname.split('/shorts/')[1]?.split('/')[0]
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
      }
      const id = u.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=1`
        : null
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id
        ? `https://player.vimeo.com/video/${id}?autoplay=1`
        : null
    }
    return null
  } catch {
    return null
  }
}

export default function ProjectGallery({
  media,
  projectName,
  videoUrl,
}: ProjectGalleryProps) {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  const items: GalleryItem[] = [
    ...media.map((m): GalleryItem => ({ type: 'image', data: m })),
    ...(embedUrl ? [{ type: 'video' as const, embedUrl }] : []),
  ]

  const mainImageIndex = media.findIndex((m) => m.is_main)
  const [activeIndex, setActiveIndex] = useState(
    mainImageIndex >= 0 ? mainImageIndex : 0
  )
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeItem = items[activeIndex] ?? null
  const total = items.length

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + total) % total),
    [total]
  )
  const goPrev = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo]
  )
  const goNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo]
  )

  const openLightbox = useCallback(() => {
    if (activeItem?.type !== 'image') return
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [activeItem])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    if (total <= 1) return
    function handleKey(e: KeyboardEvent) {
      if (lightboxOpen && e.key === 'Escape') {
        closeLightbox()
        return
      }
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext, total, lightboxOpen, closeLightbox])

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  if (total === 0) {
    return (
      <div className="rounded-xl bg-rp-gray-100 h-[380px]
        flex items-center justify-center">
        <Building2 size={48} className="text-rp-gray-500" aria-hidden="true" />
      </div>
    )
  }

  const hasMore = total > MAX_VISIBLE_THUMBNAILS
  const visibleItems = items.slice(0, MAX_VISIBLE_THUMBNAILS)
  const hiddenCount = total - MAX_VISIBLE_THUMBNAILS

  const isVerticalVideo =
    activeItem?.type === 'video' &&
    activeItem.embedUrl.includes('shorts')

  return (
    <>
      <div className="space-y-3">

        {/* ── Slot principal ── */}
        <div
          className={cn(
            'relative rounded-xl overflow-hidden bg-rp-gray-100 group',
            isVerticalVideo
              ? 'w-full max-w-[320px] mx-auto' // contenedor estrecho para 9:16
              : 'h-[380px]'
          )}
          style={isVerticalVideo ? { aspectRatio: '9/16' } : undefined}
        >

          {/* IMAGEN activa */}
          {activeItem?.type === 'image' && (
            <div
              className="absolute inset-0 cursor-zoom-in"
              onClick={openLightbox}
              role="button"
              aria-label="Ver imagen a pantalla completa"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox()}
            >
              <Image
                src={activeItem.data.public_url}
                alt={activeItem.data.alt_text ?? projectName}
                fill
                className="object-cover transition-opacity duration-200"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-black/0
                group-hover:bg-black/10 transition-colors duration-200
                flex items-end justify-end p-3">
                <span className="opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  bg-black/50 text-white rounded-full p-1.5">
                  <ZoomIn size={16} />
                </span>
              </div>
            </div>
          )}

          {/* VIDEO activo — reproductor embebido sin lightbox */}
          {activeItem?.type === 'video' && (
            <iframe
              src={activeItem.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write;
                encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Video de ${projectName}`}
            />
          )}

          {/* Flechas de navegación */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                  w-9 h-9 rounded-full bg-black/50 text-white
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  hover:bg-black/70 focus-visible:opacity-100
                  focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                  w-9 h-9 rounded-full bg-black/50 text-white
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  hover:bg-black/70 focus-visible:opacity-100
                  focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={20} />
              </button>

              {/* Contador — muestra ▶ si el item activo es video */}
              <span className="absolute top-3 right-3 z-10
                bg-black/50 text-white text-xs font-medium
                px-2 py-0.5 rounded-full pointer-events-none
                flex items-center gap-1">
                {activeItem?.type === 'video' && (
                  <Play size={10} className="fill-white" />
                )}
                {activeIndex + 1} / {total}
              </span>
            </>
          )}
        </div>

        {/* ── Miniaturas ── */}
        {total > 1 && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {visibleItems.map((item, i) => {
                const isLast = i === MAX_VISIBLE_THUMBNAILS - 1
                const showOverlay = isLast && hasMore
                const isActive = activeIndex === i

                return (
                  <button
                    key={item.type === 'image' ? item.data.id : 'video'}
                    onClick={() =>
                      goTo(showOverlay ? MAX_VISIBLE_THUMBNAILS : i)
                    }
                    aria-label={
                      showOverlay
                        ? `Ver ${hiddenCount} elementos más`
                        : item.type === 'video'
                        ? 'Ver video del proyecto'
                        : (item.data.alt_text ?? `Ver imagen ${i + 1}`)
                    }
                    className={cn(
                      'relative shrink-0 w-20 h-16 rounded-lg',
                      'overflow-hidden border-2 transition-colors duration-150',
                      isActive && !showOverlay
                        ? 'border-rp-red'
                        : 'border-rp-gray-200 hover:border-rp-gray-500'
                    )}
                  >
                    {/* Miniatura de IMAGEN */}
                    {item.type === 'image' && (
                      <Image
                        src={item.data.public_url}
                        alt={
                          item.data.alt_text ??
                          `Imagen de ${projectName}`
                        }
                        fill
                        className="object-cover"
                        sizes="80px"
                        loading="lazy"
                      />
                    )}

                    {/* Miniatura de VIDEO — fondo oscuro con ícono Play */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-gray-900
                        flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full
                          bg-rp-red flex items-center justify-center">
                          <Play size={14} className="fill-white
                            text-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Overlay "+N más" en la última miniatura visible */}
                    {showOverlay && (
                      <div className="absolute inset-0 bg-black/60
                        flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          +{hiddenCount}
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Puntos de paginación — solo si hay más de MAX_VISIBLE */}
            {hasMore && (
              <div className="flex items-center justify-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ir al elemento ${i + 1}`}
                    className={cn(
                      'rounded-full transition-all duration-200',
                      activeIndex === i
                        ? 'w-4 h-1.5 bg-rp-red'
                        : 'w-1.5 h-1.5 bg-rp-gray-300 hover:bg-rp-gray-500'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Lightbox — solo para imágenes ── */}
      {lightboxOpen && activeItem?.type === 'image' && (
        <div
          className="fixed inset-0 z-50 bg-black/95
            flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen a pantalla completa"
        >
          <div
            className="relative flex items-center justify-center
              max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeItem.data.public_url}
              alt={activeItem.data.alt_text ?? projectName}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          <button
            onClick={closeLightbox}
            aria-label="Cerrar"
            className="absolute top-4 right-4 z-10
              w-10 h-10 rounded-full bg-white/10 text-white
              flex items-center justify-center
              hover:bg-white/20 transition-colors duration-150
              focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={20} />
          </button>

          <span className="absolute top-4 left-1/2 -translate-x-1/2
            bg-white/10 text-white text-sm font-medium
            px-3 py-1 rounded-full pointer-events-none">
            {activeIndex + 1} / {total}
          </span>

          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                aria-label="Anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                  w-11 h-11 rounded-full bg-white/10 text-white
                  flex items-center justify-center
                  hover:bg-white/20 transition-colors duration-150
                  focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                aria-label="Siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                  w-11 h-11 rounded-full bg-white/10 text-white
                  flex items-center justify-center
                  hover:bg-white/20 transition-colors duration-150
                  focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2
            text-white/50 text-xs pointer-events-none">
            Clic fuera de la imagen o Escape para cerrar
          </p>
        </div>
      )}
    </>
  )
}
