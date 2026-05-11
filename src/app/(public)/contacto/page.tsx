import { MapPin, MessageCircle, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/data/projects'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

const DEFAULT_DESCRIPTION =
  'Contáctanos para más información sobre nuestros proyectos residenciales en Cúcuta.'
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
                <p className="text-[10px] font-bold text-rp-red tracking-widest uppercase">
                  CONTACTO
                </p>
                <h1 className="font-display text-[38px] sm:text-[44px] font-bold leading-[1.15] text-rp-black">
                  Hablemos de su próximo proyecto.
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
                      <p className="text-sm text-rp-gray-500 mt-0.5">
                        Atención rápida y personalizada.
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
                        Dirección
                      </p>
                      <p className="font-semibold text-rp-black">{address}</p>
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
                <h2 className="font-display text-2xl font-bold text-rp-black">
                  Escríbenos por WhatsApp
                </h2>
                <p className="text-sm text-rp-gray-500 leading-relaxed">
                  Nuestro equipo responde de forma rápida y personalizada.
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
                También puedes dejarnos tus datos a través de WhatsApp y un asesor se
                pondrá en contacto contigo.
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
              <p className="text-[10px] font-bold text-rp-red tracking-widest uppercase">
                UBICACIÓN
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-rp-black">
                Encuéntranos en Cúcuta
              </h2>
              <p className="text-sm text-rp-gray-700 leading-relaxed">
                {settings?.company_name ?? 'Riverpar SAS'} opera en la ciudad de Cúcuta,
                Norte de Santander. Nuestros proyectos están estratégicamente ubicados
                para ofrecer la mejor calidad de vida a nuestros clientes.
              </p>
              <div className="flex items-start gap-2 text-sm text-rp-gray-700">
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
