import Image from 'next/image'
import {
  Award,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Home,
  Layers,
  Headphones,
  Users,
  Leaf,
  Target,
  Clock,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data/projects'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Constructora Riverpar SAS — empresa con vocación familiar fundada en Norte de Santander, dedicada a la construcción de vivienda residencial de alta calidad desde 2012.',
}

const VALUES = [
  {
    num: '01',
    Icon: Award,
    title: 'Calidad',
    description:
      'Cada proyecto cumple los más altos estándares de construcción, materiales y acabados, asegurando una inversión sólida y duradera para nuestras familias.',
  },
  {
    num: '02',
    Icon: ShieldCheck,
    title: 'Integridad',
    description:
      'Actuamos con ética y responsabilidad en cada proceso: contratos claros, precios transparentes y cumplimiento de la normativa vigente.',
  },
  {
    num: '03',
    Icon: Lightbulb,
    title: 'Innovación',
    description:
      'Incorporamos técnicas constructivas avanzadas y herramientas tecnológicas para optimizar tiempos, costos y la experiencia del cliente.',
  },
  {
    num: '04',
    Icon: Handshake,
    title: 'Compromiso con el cliente',
    description:
      'El cliente es el centro de cada decisión. Acompañamos cada etapa del proceso con atención personalizada y cumplimiento de plazos.',
  },
  {
    num: '05',
    Icon: Users,
    title: 'Trabajo en equipo',
    description:
      'Contamos con profesionales en ingeniería, arquitectura y administración que trabajan coordinados para garantizar el éxito de cada obra.',
  },
  {
    num: '06',
    Icon: Leaf,
    title: 'Sostenibilidad',
    description:
      'Desarrollamos cada proyecto con criterios de sostenibilidad y optimización de recursos, buscando un impacto positivo en las comunidades donde intervenimos.',
  },
]

const ENFOQUE = [
  {
    Icon: Home,
    title: 'Vivienda residencial',
    description:
      'Diseño y ejecución de proyectos unifamiliares, multifamiliares y conjuntos residenciales cumpliendo normas técnicas y estándares de habitabilidad.',
  },
  {
    Icon: Layers,
    title: 'Obras de ingeniería',
    description:
      'Ejecución de proyectos de urbanismo, terminación y acabados, redes de servicios públicos e infraestructura civil en Cúcuta y área metropolitana.',
  },
  {
    Icon: Target,
    title: 'Consultoría técnica',
    description:
      'Asesoría en presupuestos, análisis de precios unitarios (APU), programación de obra e interventoría para procesos eficientes y transparentes.',
  },
]

export default async function NosotrosPage() {
  const settings = await getSiteSettings()

  return (
    <>
      {/* ── Hero ── */}
      <section className="grid lg:grid-cols-2 min-h-[420px]">
        <div className="flex items-center bg-rp-red-light px-8 sm:px-14 lg:px-16 xl:px-24 py-20 lg:py-0">
          <div className="max-w-xl space-y-8">
            <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
              SOBRE RIVERPAR SAS
            </p>
            <h1 className="font-display text-5xl sm:text-[3.5rem] font-bold leading-[1.1] text-rp-black">
              Una empresa familiar.{' '}
              <span className="text-rp-red">Un legado de calidad.</span>
            </h1>
            <p className="text-base text-rp-black leading-relaxed">
              Nacida de un proyecto escolar en 2009 y consolidada como sociedad en 2019,
              {' '}{settings?.company_name ?? 'Constructora Riverpar SAS'} construye vivienda
              de alta calidad en Cúcuta y Norte de Santander con compromiso, innovación y
              responsabilidad social.
            </p>
          </div>
        </div>

        <div className="relative min-h-[320px] lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop"
            alt="Obra de construcción — Riverpar SAS"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-rp-black/10" aria-hidden="true" />
        </div>
      </section>

      {/* ── Reseña histórica ── */}
      <section className="py-20 bg-rp-gray-100 border-b border-rp-gray-200">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <SectionLabel
                eyebrow="NUESTRA HISTORIA"
                title="De idea escolar a constructora regional"
              />
              <p className="text-base text-rp-black leading-relaxed">
                La idea de Riverpar nació en 2009 como un proyecto escolar de emprendimiento.
                Con el paso de los años se consolidó como proyecto familiar, iniciando operaciones
                como persona natural en 2012 y formalizándose en 2019 como Sociedad por Acciones
                Simplificada (SAS).
              </p>
              <p className="text-base text-rp-black leading-relaxed">
                Desde entonces, la empresa se ha expandido por Cúcuta y el área metropolitana de
                Norte de Santander, ampliando sus actividades a la construcción de edificios
                residenciales y no residenciales, terminación y acabados, obras de ingeniería civil
                y consultoría técnica.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '2009', label: 'Año de la idea fundadora' },
                { num: '2012', label: 'Inicio de operaciones' },
                { num: '2019', label: 'Constitución como SAS' },
                { num: '2030', label: 'Meta: líderes regionales' },
              ].map(({ num, label }) => (
                <div key={num} className="bg-white rounded-xl border border-rp-gray-200 p-6 text-center space-y-2">
                  <p className="font-display text-4xl font-bold text-rp-red">{num}</p>
                  <p className="text-sm text-rp-black leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Misión y Visión ── */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-rp-gray-100 rounded-2xl p-8 space-y-4">
              <div className="w-11 h-11 rounded-lg bg-rp-red-light flex items-center justify-center">
                <Target size={22} className="text-rp-red" aria-hidden="true" />
              </div>
              <h2 className="font-display text-3xl font-bold text-rp-black">Misión</h2>
              <p className="text-base text-rp-black leading-relaxed">
                Construir viviendas de alta calidad que satisfagan las necesidades de nuestras
                comunidades, integrando innovación y técnicas constructivas avanzadas con un firme
                compromiso con la seguridad, la sostenibilidad y la satisfacción del cliente.
                Valoramos el bienestar de nuestros colaboradores, brindando empleos estables y un
                entorno de desarrollo profesional que aporta al crecimiento económico y social de
                la región.
              </p>
            </div>
            <div className="bg-rp-red-light rounded-2xl p-8 space-y-4">
              <div className="w-11 h-11 rounded-lg bg-rp-red flex items-center justify-center">
                <Clock size={22} className="text-white" aria-hidden="true" />
              </div>
              <h2 className="font-display text-3xl font-bold text-rp-black">Visión</h2>
              <p className="text-base text-rp-black leading-relaxed">
                Para el año 2030, ser reconocidos como la constructora líder en la región por
                nuestro compromiso con la calidad, la dedicación y la excelencia en construcción
                de vivienda, generando empleos estables y oportunidades de crecimiento para
                nuestros colaboradores, contribuyendo al bienestar y desarrollo sostenible de la
                comunidad.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Valores ── */}
      <section className="py-16 bg-rp-gray-100">
        <Container>
          <SectionLabel
            eyebrow="NUESTROS VALORES"
            title="Lo que nos define"
            subtitle="Nueve principios corporativos que guían cada decisión, cada proyecto y cada relación con nuestros clientes."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ num, Icon, title, description }) => (
              <div
                key={num}
                className="relative bg-white rounded-xl border border-rp-gray-200 p-8 space-y-4 overflow-hidden"
              >
                <span
                  className="absolute top-4 right-5 font-display font-bold text-[72px] leading-none text-rp-gray-200 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {num}
                </span>
                <div className="w-13 h-13 rounded-lg bg-rp-red-light flex items-center justify-center">
                  <Icon size={26} className="text-rp-red" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold text-rp-black">{title}</h3>
                <p className="text-base text-rp-black leading-relaxed pr-8">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Enfoque ── */}
      <section className="py-16 bg-white">
        <Container>
          <SectionLabel
            eyebrow="PORTAFOLIO DE SERVICIOS"
            title="Lo que construimos"
            subtitle="Soluciones integrales en diseño, ejecución y supervisión de obras civiles en Cúcuta y área metropolitana."
            centered
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {ENFOQUE.map(({ Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-rp-red flex items-center justify-center">
                  <Icon size={30} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-rp-black">{title}</h3>
                <p className="text-base text-rp-black leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
