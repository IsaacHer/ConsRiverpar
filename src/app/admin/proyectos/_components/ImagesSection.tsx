'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'
import ProjectMediaGallery, { type GalleryHandle } from './ProjectMediaGallery'
import type { ProjectMedia } from '@/types'

type MediaItem = Pick<ProjectMedia, 'id' | 'public_url' | 'is_main' | 'sort_order'>

export default function ImagesSection({
  projectId,
  initialMedia,
}: {
  projectId: string
  initialMedia: MediaItem[]
}) {
  const galleryRef = useRef<GalleryHandle>(null)
  const router = useRouter()

  const handleGalleryChange = () => router.refresh()

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
        onUploadComplete={() => {
          // No agregamos al estado local optimísticamente.
          // router.refresh() recarga el Server Component desde Supabase
          // y el useEffect en ProjectMediaGallery sincroniza el estado
          // con los datos reales de la BD — única fuente de verdad.
          router.refresh()
        }}
      />

      <ProjectMediaGallery
        ref={galleryRef}
        projectId={projectId}
        initialMedia={initialMedia}
        onGalleryChange={handleGalleryChange}
      />
    </div>
  )
}
