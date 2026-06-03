import Image from 'next/image'
import {
  Award, Handshake, ShieldCheck, Headphones,
  Home, Wrench, HardHat, ClipboardList, ArrowRight
} from 'lucide-react'
import { getFeaturedProjects, getSiteSettings } from '@/lib/data/projects'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import ProjectCard from '@/components/projects/ProjectCard'

export const revalidate = 3600

const SERVICES = [
  {
    Icon: Home,
    tag: 'Residencial',
    title: 'Vivienda nueva',
    description:
      'Proyectos de vivienda unifamiliar, multifamiliar y conjuntos residenciales en Cúcuta y área metropolitana. Desde preventa hasta entrega de llaves.',
    color: 'bg-rp-red',
    tagColor: 'bg-rp-red/10 text-rp-red',
  },
  {
    Icon: HardHat,
    tag: 'Edificación',
    title: 'Obras no residenciales',
    description:
      'Construcción de edificaciones comerciales, institucionales e industriales adaptadas a las necesidades del cliente con criterios de eficiencia y seguridad estructural.',
    color: 'bg-rp-burgundy',
    tagColor: 'bg-rp-burgundy/10 text-rp-burgundy',
  },
  {
    Icon: Wrench,
    tag: 'Acabados',
    title: 'Terminación y acabados',
    description:
      'Instalación de pisos, enchapes, pintura, carpintería, cielo raso, impermeabilización y detalles arquitectónicos que agregan valor y estética a cada proyecto.',
    color: 'bg-rp-black',
    tagColor: 'bg-rp-gray-200 text-rp-black',
  },
  {
    Icon: ClipboardList,
    tag: 'Consultoría',
    title: 'Asesoría técnica',
    description:
      'Presupuestos, APU, programación de obra, interventoría y gestión documental. Procesos eficientes y transparentes para su proyecto.',
    color: 'bg-rp-red',
    tagColor: 'bg-rp-red/10 text-rp-red',
  },
]

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
      <section className="grid lg:grid-cols-2 min-h-[560px]">
        {/* Columna izquierda */}
        <div className="flex items-center bg-white px-8 sm:px-14 lg:px-16 xl:px-24 py-20 lg:py-0">
          <div className="max-w-xl space-y-8">
            <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
              BIENVENIDO A RIVERPAR
            </p>
            <h1 className="font-display text-5xl md:text-[3.75rem] font-bold leading-[1.1] text-rp-burgundy">
              Encuentra tu próximo{' '}
              <span className="text-rp-red">hogar ideal.</span>
            </h1>
            <p className="text-base text-rp-gray-700 leading-relaxed max-w-md">
              Desarrollamos proyectos residenciales con los más altos estándares
              de calidad, diseño y cumplimiento en Cúcuta y Norte de Santander.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/proyectos" size="lg">Ver proyectos →</Button>
              <Button href="/nosotros" variant="outline" size="lg">
                Sobre nosotros
              </Button>
            </div>
            {settings?.company_name && (
              <p className="text-sm text-rp-gray-500">
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

      {/* ── Sección 2: Portafolio de servicios ── */}
      <section className="py-24 bg-rp-gray-100 overflow-hidden">
        <Container>
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
                PORTAFOLIO DE SERVICIOS
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-rp-black leading-tight">
                Más que una constructora.{' '}
                <span className="text-rp-red">Una solución integral.</span>
              </h2>
              <p className="text-base text-rp-gray-700 leading-relaxed">
                No solo construimos vivienda. Ofrecemos un portafolio completo de servicios
                en edificación, acabados e ingeniería para particulares y empresas en Norte
                de Santander.
              </p>
            </div>
            <Button
              href="/nosotros"
              variant="outline"
              size="lg"
              className="shrink-0"
            >
              Ver todo lo que hacemos →
            </Button>
          </div>

          {/* Grid de servicios */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ Icon, tag, title, description, color, tagColor }) => (
              <div
                key={title}
                className="group bg-white border border-rp-gray-200 hover:border-rp-red/40 rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                {/* Ícono grande */}
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={30} className="text-white" aria-hidden="true" />
                </div>

                {/* Tag */}
                <span className={`inline-flex w-fit text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tagColor}`}>
                  {tag}
                </span>

                {/* Texto */}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="font-display text-xl font-bold text-rp-black leading-snug">{title}</h3>
                  <p className="text-sm text-rp-black leading-relaxed">{description}</p>
                </div>

                <ArrowRight
                  size={20}
                  className="text-rp-red opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

          {/* Franja de cifras */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-rp-gray-200 rounded-2xl overflow-hidden">
            {[
              { num: '+15', label: 'Años de trayectoria' },
              { num: '100%', label: 'Compromiso con la calidad' },
              { num: '4', label: 'Áreas de servicio' },
              { num: 'CÚCUTA', label: 'y área metropolitana' },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white px-6 py-10 text-center space-y-2">
                <p className="font-display text-4xl font-bold text-rp-red">{num}</p>
                <p className="text-sm text-rp-black leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Sección 3: Proyectos destacados ── */}
      <section className="pt-20 pb-16 bg-white">
        <Container>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-rp-red">
              Espacios que Cobran Vida
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-rp-black leading-tight">
              Conoce nuestros proyectos destacados.
            </h2>
          </div>

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
                <p className="text-base text-rp-black leading-relaxed">
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
