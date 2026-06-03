import { MapPin, MessageCircle, Mail, ExternalLink, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data/projects'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

const DEFAULT_DESCRIPTION =
  'Contáctanos para más información sobre nuestros proyectos residenciales en Cúcuta y Norte de Santander. Tel: 3015638861.'
const WA_MESSAGE =
  'Hola, me gustaría recibir información sobre los proyectos de Riverpar SAS.'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: 'Contacto',
    description: settings?.seo_description ?? DEFAULT_DESCRIPTION,
  }
}

export default async function ContactoPage() {
  const settings = await getSiteSettings()

  const phone = settings?.contact_whatsapp?.replace(/\D/g, '') ?? ''
  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(WA_MESSAGE)}`
    : '#'

  const address = settings?.address ?? ''
  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '#'

  return (
    <>
      {/* ── Hero + Grid ── */}
      <section className="py-14 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Columna izquierda */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
                  CONTACTO
                </p>
                <h1 className="font-display text-5xl sm:text-[3.5rem] font-bold leading-[1.1] text-rp-black">
                  Estamos listos para ayudarte.
                </h1>
              </div>

              <div className="space-y-4">
                {/* Tarjeta WhatsApp */}
                {phone && (
                  <div className="flex items-start gap-4 bg-rp-gray-100 rounded-xl p-5">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle size={20} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-rp-gray-500 mb-1">
                        WhatsApp
                      </p>
                      <p className="font-semibold text-rp-black">
                        {settings?.contact_whatsapp}
                      </p>
                      <p className="text-sm text-rp-black mt-0.5">
                        Atención rápida y personalizada de lunes a sábado.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tarjeta Email */}
                {settings?.contact_email && (
                  <div className="flex items-start gap-4 bg-rp-gray-100 rounded-xl p-5">
                    <div className="w-10 h-10 rounded-full bg-rp-red-light flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-rp-red" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-rp-gray-500 mb-1">
                        Correo electrónico
                      </p>
                      <p className="font-semibold text-rp-black">{settings.contact_email}</p>
                      <p className="text-sm text-rp-black mt-0.5">
                        Respuesta en menos de 24 horas hábiles.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tarjeta Dirección */}
                {address && (
                  <div className="flex items-start gap-4 bg-rp-gray-100 rounded-xl p-5">
                    <div className="w-10 h-10 rounded-full bg-rp-red-light flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-rp-red" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-rp-gray-500 mb-1">
                        Sede administrativa
                      </p>
                      <p className="font-semibold text-rp-black">{address}</p>
                      <p className="text-sm text-rp-black mt-0.5">
                        Los Patios, Norte de Santander — área metropolitana de Cúcuta.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                href={waUrl}
                variant="outline"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Escríbenos por WhatsApp
              </Button>
            </div>

            {/* Columna derecha — tarjeta WhatsApp (sin formulario) */}
            <div className="bg-white rounded-2xl border border-rp-gray-200 shadow-sm p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-rp-black">
                  ¿Cómo podemos ayudarte?
                </h2>
                <p className="text-base text-rp-black leading-relaxed">
                  Nuestro equipo de asesores responde de forma rápida y personalizada.
                  Escribenos por WhatsApp y cuente con nosotros.
                </p>
              </div>

              <Button
                href={waUrl}
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full gap-2"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Escríbenos por WhatsApp
              </Button>

              <p className="text-xs text-rp-gray-500 leading-relaxed border-t border-rp-gray-200 pt-5">
              NIT: 901338089-5 — Constructora Riverpar SAS, Los Patios, Norte de Santander.
              Atendemos proyectos en Cúcuta y área metropolitana.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Sección Ubicación ── */}
      {address && (
        <section className="py-14 bg-rp-gray-100 border-t border-rp-gray-200">
          <Container>
            <div className="max-w-xl space-y-5">
              <p className="text-xs font-bold text-rp-red tracking-widest uppercase">
                UBICACIÓN
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-rp-black">
                Encuéntranos en Los Patios, Cúcuta
              </h2>
              <p className="text-base text-rp-black leading-relaxed">
                La sede administrativa de {settings?.company_name ?? 'Constructora Riverpar SAS'} se encuentra
                ubicada en el municipio de Los Patios, Norte de Santander, con fácil acceso a los
                principales corredores viales que conectan con Cúcuta y su área metropolitana.
              </p>
              <div className="flex items-start gap-2 text-sm text-rp-black">
                <MapPin size={15} className="text-rp-red shrink-0 mt-0.5" aria-hidden="true" />
                <span>{address}</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rp-red hover:text-rp-red-dark transition-colors"
              >
                Ver en Google Maps
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
