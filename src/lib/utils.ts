import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  const message = `Hola, estoy interesado en el proyecto *${projectName}*. Lo vi en: ${projectUrl}`
  const encoded = encodeURIComponent(message)
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encoded}`
}
