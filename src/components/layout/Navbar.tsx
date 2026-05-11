'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

interface NavbarProps {
  settings: SiteSettings | null
}

export default function Navbar({ settings: _settings }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-display font-bold text-[22px] text-rp-red tracking-tight">
              RIVERPAR
            </span>
            <span className="text-[9px] text-rp-gray-500 tracking-[0.2em] uppercase mt-0.5">
              Constructora S.A.S.
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-sm font-medium pb-1 transition-colors duration-150',
                    isActive
                      ? 'text-rp-red border-b-2 border-rp-red'
                      : 'text-rp-gray-700 hover:text-rp-red border-b-2 border-transparent'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-rp-gray-700 hover:text-rp-red transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-rp-gray-200 bg-white">
          <nav
            className="flex flex-col px-4 sm:px-6 py-4 gap-1"
            aria-label="Navegación móvil"
          >
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-sm font-medium py-2.5 px-2 rounded transition-colors',
                    isActive
                      ? 'text-rp-red bg-rp-red-light font-semibold'
                      : 'text-rp-gray-700 hover:text-rp-red hover:bg-rp-gray-100'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
