export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getAdminProjectById, getProjectMedia, getProjectAmenities } from '@/lib/data/admin'
import ProjectForm from '../../_components/ProjectForm'
import ImagesSection from '../../_components/ImagesSection'
import AmenitiesSection from '../../_components/AmenitiesSection'

export default async function EditarProyectoPage({
  params,
}: {
  params: { id: string }
}) {
  const [project, media, amenities] = await Promise.all([
    getAdminProjectById(params.id),
    getProjectMedia(params.id),
    getProjectAmenities(params.id),
  ])
  if (!project) notFound()

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-rp-gray-500 mb-3">
          <Link href="/admin" className="hover:text-rp-black transition-colors">Admin</Link>
          <ChevronRight size={12} />
          <Link href="/admin/proyectos" className="hover:text-rp-black transition-colors">Proyectos</Link>
          <ChevronRight size={12} />
          <span className="text-rp-black truncate max-w-[200px]">{project.name}</span>
        </nav>
        <h1 className="text-2xl font-semibold text-rp-black">Editar proyecto</h1>
      </div>

      <ProjectForm key={project.id} mode="edit" project={project} />

      <ImagesSection projectId={project.id} initialMedia={media} />

      <AmenitiesSection projectId={project.id} initialAmenities={amenities} />
    </div>
  )
}
