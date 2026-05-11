import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BedDouble, Bath, Maximize2, Building2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatPrice, cn } from '@/lib/utils'
import type { FeaturedProject } from '@/lib/data/projects'

interface ProjectCardProps {
  project: FeaturedProject
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const price = formatPrice(project.price_base_cop, project.price_visible)
  const isPriceVisible = project.price_visible && project.price_base_cop !== null
  const locationParts = [project.location_zone, project.location_city].filter(Boolean)
  const location = locationParts.join(', ')
  const hasSpecs =
    project.bedrooms !== null || project.bathrooms !== null || project.area_m2 !== null

  return (
    <article className="bg-white rounded-xl border border-rp-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Imagen */}
      <div className="relative h-[200px] bg-rp-gray-100 shrink-0">
        {project.mainImage ? (
          <Image
            src={project.mainImage.public_url}
            alt={project.mainImage.alt_text ?? project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={40} className="text-rp-gray-500" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge status={project.commercial_status} />
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Nombre */}
        <h3 className="font-display text-[17px] font-bold text-rp-black leading-snug line-clamp-2">
          {project.name}
        </h3>

        {/* Ubicación */}
        <p className="flex items-center gap-1.5 text-sm text-rp-gray-500">
          <MapPin size={14} className="text-rp-red shrink-0" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </p>

        {/* Precio */}
        <p
          className={cn(
            'font-bold text-lg leading-none',
            isPriceVisible ? 'text-rp-red' : 'text-rp-gray-500 font-normal text-sm'
          )}
        >
          {price}
        </p>

        {/* Specs */}
        {hasSpecs && (
          <div className="flex items-center gap-4 text-xs text-rp-gray-500 border-t border-rp-gray-200 pt-3 flex-wrap">
            {project.bedrooms !== null && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} aria-hidden="true" />
                {project.bedrooms} hab.
              </span>
            )}
            {project.bathrooms !== null && (
              <span className="flex items-center gap-1">
                <Bath size={14} aria-hidden="true" />
                {project.bathrooms} baños
              </span>
            )}
            {project.area_m2 !== null && (
              <span className="flex items-center gap-1">
                <Maximize2 size={14} aria-hidden="true" />
                {project.area_m2} m²
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Link
            href={`/proyectos/${project.slug}`}
            className="inline-flex items-center justify-center w-full border-2 border-rp-red text-rp-red hover:bg-rp-red hover:text-white font-medium text-sm px-5 py-2.5 rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-red focus-visible:ring-offset-2"
          >
            Ver detalles →
          </Link>
        </div>
      </div>
    </article>
  )
}
