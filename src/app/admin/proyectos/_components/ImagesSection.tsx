'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import ImageUploader from './ImageUploader'
import type { ProjectMedia } from '@/types'

type MediaItem = Pick<ProjectMedia, 'id' | 'public_url' | 'is_main' | 'sort_order'>

export default function ImagesSection({
  projectId,
  initialMedia,
}: {
  projectId: string
  initialMedia: MediaItem[]
}) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)

  function handleUploadComplete(item: MediaItem) {
    setMedia((prev) => [...prev, item])
  }

  return (
    <div className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-rp-black">Imágenes del proyecto</h2>
        <p className="text-xs text-rp-gray-500 mt-0.5">
          La primera imagen subida se usará como portada principal.
        </p>
      </div>

      <ImageUploader
        projectId={projectId}
        onUploadComplete={handleUploadComplete}
      />

      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative group aspect-video rounded-lg overflow-hidden border border-rp-gray-200 bg-rp-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.public_url}
                alt=""
                className="w-full h-full object-cover"
              />
              {item.is_main && (
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-amber-400 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  <Star size={9} className="fill-white" />
                  Portada
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
