import Image from 'next/image'
import {
  Award,
  Handshake,
  Lightbulb,
  ShieldCheck,
  Home,
  Layers,
  Headphones,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data/projects'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nosotros — Riverpar SAS',
  description:
    'Conoce a Constructora Riverpar SAS, comprometida con la calidad y el cumplimiento en proyectos residenciales.',
}

const VALUES = [
  {
    num: '01',
    Icon: Award,
    title: 'Calidad',
    description:
      'Cada proyecto cumple estándares rigurosos de construcción, materiales y acabados para garantizar una inversión duradera.',
  },
  {
    num: '02',
    Icon: Handshake,
    title: 'Compromiso',
    description:
      'Cumplimos plazos y promesas. Nuestros clientes son el centro de cada decisión durante todo el proceso.',
  },
  {
    num: '03',
    Icon: Lightbulb,
    title: 'Innovación',
    description:
      'Adoptamos tecnologías y procesos modernos para optimizar cada etapa de la construcción y la experiencia del cliente.',
  },
  {
    num: '04',
    Icon: ShieldCheck,
    title: 'Transparencia',
    description:
      'Información clara sobre precios, avances de obra y contratos. Sin sorpresas, sin letra pequeña. Siempre al tanto.',
  },
]

const ENFOQUE = [
  {
    Icon: Home,
    title: 'Experiencia clara',
    description:
      'Un proceso simple y bien comunicado desde la primera consulta hasta la entrega de llaves. Sin complicaciones.',
  },
  {
    Icon: Layers,
    title: 'Gestión centralizada',
    description:
      'Todo el seguimiento de tu proyecto en un solo lugar. Coordinamos cada etapa para que nada quede al azar.',
  },
  {
    Icon: Headphones,
    title: 'Contacto inmediato',
    description:
      'Un asesor disponible para responder tus preguntas y acompañarte en cada decisión importante.',
  },
]

export default async function NosotrosPage() {
  const settings = await getSiteSettings()

  return (
    <>
      {/* ── Hero ── */}
      <section className="grid lg:grid-cols-2 min-h-[420px]">
        <div className="flex items-center bg-[#111] px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-0">
          <div className="max-w-lg space-y-6">
            <p className="text-[10px] font-bold text-rp-red tracking-widest uppercase">
              SOBRE RIVERPAR SAS
            </p>
            <h1 className="font-display text-[40px] sm:text-[46px] font-bold leading-[1.15] text-white">
              Construimos confianza.{' '}
              <span className="text-rp-red">Edificamos hogares.</span>
            </h1>
            <p className="text-sm text-rp-gray-500 leading-relaxed">
              {settings?.company_name ?? 'Riverpar SAS'} es una constructora con vocación
              residencial, enfocada en entregar proyectos de calidad con transparencia y
              cumplimiento en cada etapa.
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
          <div className="absolute inset-0 bg-rp-black/25" aria-hidden="true" />
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-16 bg-white">
        <Container>
          <SectionLabel
            eyebrow="NUESTROS VALORES"
            title="Lo que nos define"
            subtitle="Principios que guían cada decisión, cada proyecto y cada relación con nuestros clientes."
          />
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {VALUES.map(({ num, Icon, title, description }) => (
              <div
                key={num}
                className="relative bg-white rounded-xl border border-rp-gray-200 p-6 space-y-4 overflow-hidden"
              >
                <span
                  className="absolute top-4 right-5 font-display font-bold text-[60px] leading-none text-rp-gray-200 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {num}
                </span>
                <div className="w-11 h-11 rounded-lg bg-rp-red-light flex items-center justify-center">
                  <Icon size={22} className="text-rp-red" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-rp-black">{title}</h3>
                <p className="text-sm text-rp-gray-500 leading-relaxed pr-8">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Enfoque ── */}
      <section className="py-16 bg-rp-gray-100">
        <Container>
          <SectionLabel
            eyebrow="NUESTRO ENFOQUE"
            title="Cómo trabajamos"
            subtitle="Tres pilares que definen la experiencia de construir con Riverpar."
            centered
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {ENFOQUE.map(({ Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-rp-red flex items-center justify-center">
                  <Icon size={26} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-rp-black">{title}</h3>
                <p className="text-sm text-rp-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
