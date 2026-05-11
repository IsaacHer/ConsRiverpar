'use client'

import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface WhatsAppCTAProps {
  phone: string
  projectName: string
  projectUrl: string
  label?: string
  className?: string
}

export default function WhatsAppCTA({
  phone,
  projectName,
  projectUrl,
  label = 'Consultar por WhatsApp',
  className,
}: WhatsAppCTAProps) {
  const url = buildWhatsAppUrl(phone, projectName, projectUrl)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c]',
        'text-white font-medium px-5 py-2.5 rounded-md transition-colors duration-150',
        className
      )}
    >
      <MessageCircle size={18} aria-hidden="true" />
      {label}
    </a>
  )
}
