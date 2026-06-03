import Image from 'next/image'
import { Suspense } from 'react'
import { Search, Headphones } from 'lucide-react'
import type { Metadata } from 'next'
import { getPublicProjects, getSiteSettings } from '@/lib/data/projects'
import type { CommercialStatus } from '@/types'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import ProjectCard from '@/components/projects/ProjectCard'
import CatalogFilter from '@/components/projects/CatalogFilter'
import OrdenSelect from '@/components/projects/OrdenSelect'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Explora nuestro catálogo de proyectos residenciales en Cúcuta.',
}

type SearchParams = {
  estado?: string
  orden?: string
}

const CATALOG_WA_MESSAGE =
  '¿Necesitas ayuda para elegir el proyecto ideal? Nuestro equipo está listo para asesorarte.'

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const orden = (searchParams.orden as 'recientes' | 'precio_asc' | 'precio_desc') || 'recientes'

  const VALID_STATUSES: CommercialStatus[] = ['preventa', 'en_obra', 'listo_entrega', 'vendido']
  const validEstado = VALID_STATUSES.includes(searchParams.estado as CommercialStatus)
    ? (searchParams.estado as CommercialStatus)
    : undefined

  const filters = {
    estado: validEstado,
    orden,
  }

  const hasActiveFilters = !!validEstado

  const [projects, settings] = await Promise.all([
    getPublicProjects(filters),
    getSiteSettings(),
  ])

  const waUrl = settings?.contact_whatsapp
    ? `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(CATALOG_WA_MESSAGE)}`
    : '/contacto'

  return (
    <>
      {/* ── Sección 1: Hero Strip ── */}
      <section className="grid lg:grid-cols-2 min-h-[420px]">
        <div className="flex items-center bg-rp-gray-100 px-8 sm:px-14 lg:px-16 xl:px-24 py-20 lg:py-0">
          <div className="max-w-xl space-y-8">
            <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
              PROYECTOS
            </p>
            <h1 className="font-display text-5xl sm:text-[3.5rem] font-bold leading-[1.1] text-rp-black">
              Encuentra el proyecto{' '}
              <span className="text-rp-red">ideal para ti.</span>
            </h1>
            <p className="text-base text-rp-black leading-relaxed">
              Explora nuestro portafolio de proyectos residenciales en Cúcuta.
              Filtra por estado comercial para encontrar
              exactamente lo que buscas.
            </p>
          </div>
        </div>

        <div className="relative min-h-[240px] lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80&auto=format&fit=crop"
            alt="Edificios residenciales — catálogo Riverpar SAS"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-rp-black/15" aria-hidden="true" />
        </div>
      </section>

      {/* ── Sección 2: Filtros ── */}
      <section className="py-8 bg-white border-b border-rp-gray-200">
        <Container>
          <Suspense>
            <CatalogFilter count={projects.length} hasActiveFilters={hasActiveFilters} />
          </Suspense>
        </Container>
      </section>

      {/* ── Sección 3: Orden ── */}
      <section className="pt-8 pb-4 bg-white">
        <Container>
          <div className="flex justify-end">
            <Suspense>
              <OrdenSelect currentOrden={orden} />
            </Suspense>
          </div>
        </Container>
      </section>

      {/* ── Sección 4: Grid de proyectos ── */}
      <section className="pb-16 bg-white">
        <Container>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-rp-gray-100 flex items-center justify-center">
                <Search size={28} className="text-rp-gray-500" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-xl font-bold text-rp-black">
                  No encontramos proyectos con estos criterios
                </p>
                <p className="text-sm text-rp-black">
                  Intenta ajustando los filtros o explora todos nuestros proyectos.
                </p>
              </div>
              <Button href="/proyectos" variant="outline" size="md">
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Sección 5: Banner CTA WhatsApp ── */}
      <section className="py-12 bg-rp-red-light border-y border-rp-red/20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rp-red flex items-center justify-center shrink-0">
                <Headphones size={22} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-rp-black text-base md:text-lg">
                  ¿Necesitas ayuda para elegir el proyecto ideal?
                </p>
                <p className="text-sm text-rp-gray-700 mt-1">
                  Nuestro equipo está listo para asesorarte.
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
