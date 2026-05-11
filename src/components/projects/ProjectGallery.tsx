'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectDetailMedia } from '@/lib/data/projects'

interface ProjectGalleryProps {
  media: ProjectDetailMedia[]
  projectName: string
}

export default function ProjectGallery({ media, projectName }: ProjectGalleryProps) {
  const initial = media.find((m) => m.is_main) ?? media[0] ?? null
  const [active, setActive] = useState<ProjectDetailMedia | null>(initial)
  const thumbnails = media.slice(0, 4)

  if (media.length === 0) {
    return (
      <div className="rounded-xl bg-rp-gray-100 h-[380px] flex items-center justify-center">
        <Building2 size={48} className="text-rp-gray-500" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-[380px] rounded-xl overflow-hidden bg-rp-gray-100">
        {active ? (
          <Image
            src={active.public_url}
            alt={active.alt_text ?? projectName}
            fill
            className="object-cover transition-opacity duration-200"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={48} className="text-rp-gray-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {thumbnails.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {thumbnails.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              aria-label={item.alt_text ?? `Ver imagen ${item.sort_order + 1}`}
              className={cn(
                'relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-150',
                active?.id === item.id
                  ? 'border-rp-red'
                  : 'border-rp-gray-200 hover:border-rp-gray-500'
              )}
            >
              <Image
                src={item.public_url}
                alt={item.alt_text ?? projectName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
