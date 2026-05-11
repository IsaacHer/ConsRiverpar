import Link from 'next/link'
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'
import type { SiteSettings } from '@/types'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

const projectLinks = [
  { label: 'En preventa', href: '/proyectos?estado=preventa' },
  { label: 'En obra', href: '/proyectos?estado=en_obra' },
  { label: 'Listos para entrega', href: '/proyectos?estado=listo_entrega' },
]

interface FooterProps {
  settings: SiteSettings | null
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 — Marca */}
          <div className="space-y-4">
            <div>
              <span className="font-display font-bold text-[22px] text-rp-red block leading-none">
                RIVERPAR
              </span>
              <p className="text-sm text-rp-gray-500 mt-3 leading-relaxed">
                Construimos el hogar de tus sueños con calidad, confianza y visión de futuro.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-rp-gray-500 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-rp-gray-500 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-rp-gray-500 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Col 2 — Navegación */}
          <div>
            <h3 className="text-xs font-semibold text-rp-gray-200 uppercase tracking-wider mb-5">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-rp-gray-500 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Proyectos */}
          <div>
            <h3 className="text-xs font-semibold text-rp-gray-200 uppercase tracking-wider mb-5">
              Proyectos
            </h3>
            <ul className="space-y-2.5">
              {projectLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-rp-gray-500 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <h3 className="text-xs font-semibold text-rp-gray-200 uppercase tracking-wider mb-5">
              Contacto
            </h3>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-2.5 text-sm text-rp-gray-500">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-rp-red" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.contact_whatsapp && (
                <li className="flex items-center gap-2.5 text-sm text-rp-gray-500">
                  <Phone size={15} className="shrink-0 text-rp-red" />
                  <span>{settings.contact_whatsapp}</span>
                </li>
              )}
              {settings?.contact_email && (
                <li className="flex items-center gap-2.5 text-sm text-rp-gray-500">
                  <Mail size={15} className="shrink-0 text-rp-red" />
                  <span>{settings.contact_email}</span>
                </li>
              )}
              {!settings && (
                <li className="text-sm text-rp-gray-500 italic">
                  Información de contacto no disponible
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-rp-gray-700">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-rp-gray-500 text-center">
            © 2025 Riverpar Constructora SAS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
