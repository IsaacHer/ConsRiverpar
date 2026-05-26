import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatPrice(price: number | null, visible: boolean): string {
  if (!visible || price === null) return 'Consultar precio'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildWhatsAppUrl(
  phone: string,
  projectName: string,
  projectUrl: string
): string {
  const message = `Hola, estoy interesado(a) en el proyecto ${projectName}. ¿Podrían brindarme más información? ${projectUrl}`
  const encoded = encodeURIComponent(message)
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encoded}`
}
