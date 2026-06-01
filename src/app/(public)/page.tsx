import Image from 'next/image'
import { Award, Handshake, ShieldCheck, Headphones } from 'lucide-react'
import { getFeaturedProjects, getSiteSettings } from '@/lib/data/projects'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import HomeSearchBar from '@/components/projects/HomeSearchBar'
import ProjectCard from '@/components/projects/ProjectCard'

export const revalidate = 3600

const WHY_ITEMS = [
  {
    Icon: Award,
    title: 'Calidad garantizada',
    description:
      'Cada proyecto cumple los más altos estándares de construcción, materiales y acabados para asegurar tu inversión a largo plazo.',
  },
  {
    Icon: Handshake,
    title: 'Compromiso real',
    description:
      'Cumplimos plazos y promesas. Nuestros clientes son el centro de cada decisión que tomamos durante todo el proceso.',
  },
  {
    Icon: ShieldCheck,
    title: 'Transparencia total',
    description:
      'Información clara sobre precios, avances de obra y contratos. Sin sorpresas, sin letra pequeña. Siempre al tanto.',
  },
]

const GENERAL_WA_MESSAGE =
  'Hola, me gustaría recibir información sobre los proyectos de Riverpar SAS.'

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    getFeaturedProjects(),
    getSiteSettings(),
  ])

  const waUrl = settings?.contact_whatsapp
    ? `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(GENERAL_WA_MESSAGE)}`
    : '/contacto'

  return (
    <>
      {/* ── Sección 1: Hero ── */}
      <section className="grid lg:grid-cols-2 min-h-[480px]">
        {/* Columna izquierda */}
        <div className="flex items-center bg-rp-gray-100 px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-0">
          <div className="max-w-lg space-y-7">
            <p className="text-[10px] font-bold text-rp-red tracking-widest uppercase">
              BIENVENIDO A RIVERPAR
            </p>
            <h1 className="font-display text-[44px] font-bold leading-[1.15] text-rp-burgundy">
              Encuentra tu próximo{' '}
              <span className="text-rp-red">hogar ideal.</span>
            </h1>
            <p className="text-sm text-rp-gray-700 leading-relaxed">
              Desarrollamos proyectos residenciales con los más altos estándares
              de calidad, diseño y cumplimiento.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/proyectos" size="md">Ver proyectos →</Button>
              <Button href="/nosotros" variant="outline" size="md">
                Sobre nosotros
              </Button>
            </div>
            {settings?.company_name && (
              <p className="text-xs text-rp-gray-500">
                {settings.company_name} — comprometidos con tu futuro.
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha — imagen */}
        <div className="relative min-h-[360px] lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop"
            alt="Proyecto residencial de alta calidad — Riverpar SAS"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-rp-black/10" aria-hidden="true" />
        </div>
      </section>

      {/* ── Sección 2: Barra de búsqueda rápida ── */}
      <div className="-mt-7 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <HomeSearchBar />
        </div>
      </div>

      {/* ── Sección 3: Proyectos destacados ── */}
      <section className="pt-20 pb-16 bg-white">
        <Container>
          <SectionLabel
            eyebrow="PROYECTOS DESTACADOS"
            title="Conoce nuestros proyectos más recientes"
          />

          <div className="mt-10">
            {projects.length === 0 ? (
              <div className="rounded-xl border border-rp-gray-200 bg-rp-gray-100 py-16 text-center">
                <p className="text-rp-gray-500 text-sm">
                  No hay proyectos destacados aún.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          {projects.length > 0 && (
            <div className="mt-10 text-center">
              <Button href="/proyectos" variant="outline" size="md">
                Ver todos los proyectos →
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* ── Sección 4: ¿Por qué Riverpar? ── */}
      <section className="py-16 bg-rp-gray-100">
        <Container>
          <SectionLabel
            eyebrow="¿POR QUÉ RIVERPAR?"
            title="Lo que nos diferencia"
            subtitle="Construimos con propósito, entregamos con integridad."
            centered
          />

          <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {WHY_ITEMS.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-rp-gray-200 p-6 space-y-4"
              >
                <div className="w-12 h-12 rounded-lg bg-rp-red-light flex items-center justify-center">
                  <Icon size={24} className="text-rp-red" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-rp-black">
                  {title}
                </h3>
                <p className="text-sm text-rp-gray-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
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
                  ¿Tienes dudas o quieres asesoría personalizada?
                </p>
                <p className="text-sm text-rp-gray-700 mt-1">
                  Nuestro equipo está listo para ayudarte a encontrar el proyecto ideal.
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
