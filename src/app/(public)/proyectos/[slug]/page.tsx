import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  CheckCircle,
  Headphones,
} from 'lucide-react'
import type { Metadata } from 'next'
import {
  getProjectBySlug,
  getPublishedSlugs,
  getSiteSettings,
} from '@/lib/data/projects'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import ProjectGallery from '@/components/projects/ProjectGallery'
import React from 'react'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const project = await getProjectBySlug(params.slug)
    if (!project) return { title: 'Proyecto | Riverpar SAS' }

    const mainImage = project.media.find((m) => m.is_main) ?? project.media[0]
    const description = project.short_description ?? project.name

    return {
      title: project.name,
      description,
      alternates: {
        canonical: `/proyectos/${project.slug}`,
      },
      openGraph: {
        title: project.name,
        description,
        type: 'website',
        ...(mainImage ? { images: [mainImage.public_url] } : {}),
      },
    }
  } catch {
    return { title: 'Proyecto | Riverpar SAS' }
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const [project, settings] = await Promise.all([
    getProjectBySlug(params.slug),
    getSiteSettings(),
  ])

  if (!project) notFound()

  const phone = settings?.contact_whatsapp ?? ''
  const projectUrl = `/proyectos/${project.slug}`
  const waUrl = phone ? buildWhatsAppUrl(phone, project.name, projectUrl) : '/contacto'

  const price = formatPrice(project.price_base_cop, project.price_visible)
  const isPriceVisible = project.price_visible && project.price_base_cop !== null
  const location = [project.location_zone, project.location_city]
    .filter(Boolean)
    .join(', ')

  const specs = [
    { Icon: BedDouble, label: 'Habitaciones', value: project.bedrooms },
    { Icon: Bath, label: 'Baños', value: project.bathrooms },
    {
      Icon: Maximize2,
      label: 'Área',
      value: project.area_m2 !== null ? `${project.area_m2} m²` : null,
    },
    { Icon: Car, label: 'Parqueaderos', value: project.parking_spaces },
  ].filter((s) => s.value !== null) as Array<{
    Icon: React.FC<{ size?: number; className?: string; 'aria-hidden'?: string }>
    label: string
    value: string | number
  }>

  const cleanDescription = project.description ? stripHtml(project.description) : null

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="border-b border-rp-gray-200 bg-white">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 py-3 text-sm text-rp-gray-500"
          >
            <Link href="/" className="hover:text-rp-red transition-colors">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/proyectos" className="hover:text-rp-red transition-colors">
              Proyectos
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-rp-black font-medium truncate max-w-[200px]">
              {project.name}
            </span>
          </nav>
        </Container>
      </div>

      {/* ── Grid principal ── */}
      <section className="py-10 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14 items-start">
            {/* Galería */}
            <ProjectGallery media={project.media} projectName={project.name} />

            {/* Panel de información */}
            <div className="space-y-5">
              <Badge status={project.commercial_status} />

              <h1 className="font-display text-[32px] font-bold leading-tight text-rp-black">
                {project.name}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-rp-gray-500">
                <MapPin size={15} className="text-rp-red shrink-0" aria-hidden="true" />
                {location}
              </p>

              {project.short_description && (
                <p className="text-sm text-rp-gray-700 leading-relaxed">
                  {project.short_description}
                </p>
              )}

              {/* Precio */}
              <div>
                {isPriceVisible ? (
                  <>
                    <p className="text-[10px] uppercase tracking-widest text-rp-gray-500 mb-1">
                      Precio desde
                    </p>
                    <p className="text-[28px] font-bold text-rp-red leading-none">
                      {price}
                    </p>
                  </>
                ) : (
                  <p className="text-lg text-rp-gray-500">{price}</p>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Button
                  href={waUrl}
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  Contactar asesor
                </Button>
                <Button
                  href={waUrl}
                  variant="outline"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  Solicitar más información
                </Button>
              </div>

              {/* Especificaciones */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rp-gray-200">
                  {specs.map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 bg-rp-gray-100 rounded-lg px-3 py-3"
                    >
                      <Icon size={18} className="text-rp-red shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-[10px] text-rp-gray-500 uppercase tracking-wide leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-rp-black">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Descripción ── */}
      {cleanDescription && (
        <section className="py-10 bg-rp-gray-100">
          <Container>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-rp-black mb-5">
              Descripción del proyecto
            </h2>
            <p className="max-w-3xl text-sm text-rp-gray-700 leading-relaxed whitespace-pre-line">
              {cleanDescription}
            </p>
          </Container>
        </section>
      )}

      {/* ── Amenidades ── */}
      {project.amenities.length > 0 && (
        <section className="py-10 bg-white">
          <Container>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-rp-black mb-6">
              Características y amenidades
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rp-red-light flex items-center justify-center shrink-0">
                    <CheckCircle size={18} className="text-rp-red" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-rp-gray-700">{amenity.name}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Banner CTA final ── */}
      <section className="py-12 bg-rp-red-light border-y border-rp-red/20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rp-red flex items-center justify-center shrink-0">
                <Headphones size={22} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-rp-black text-base md:text-lg">
                  ¿Te interesa este proyecto?
                </p>
                <p className="text-sm text-rp-gray-700 mt-1">
                  Nuestro equipo está listo para ayudarte a encontrar tu nuevo hogar.
                </p>
              </div>
            </div>
            <Button
              href={waUrl}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 whitespace-nowrap"
            >
              Hablar con un asesor →
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
