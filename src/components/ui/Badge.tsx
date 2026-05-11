import { cn } from '@/lib/utils'
import type { CommercialStatus } from '@/types'

const statusConfig: Record<
  CommercialStatus,
  { label: string; bg: string; color: string }
> = {
  preventa: { label: 'En preventa', bg: '#fff3cd', color: '#856404' },
  en_obra: { label: 'En obra', bg: '#d1ecf1', color: '#0c5460' },
  listo_entrega: { label: 'Listo para entrega', bg: '#d4edda', color: '#155724' },
  vendido: { label: 'Vendido', bg: '#f8d7da', color: '#721c24' },
}

interface BadgeProps {
  status: CommercialStatus
  className?: string
}

export default function Badge({ status, className }: BadgeProps) {
  const { label, bg, color } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        className
      )}
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  )
}
