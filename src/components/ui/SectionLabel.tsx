import { cn } from '@/lib/utils'

interface SectionLabelProps {
  eyebrow: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export default function SectionLabel({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn('space-y-3', centered && 'text-center', className)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-rp-red">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-rp-black leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-rp-gray-500 text-lg leading-relaxed max-w-2xl',
            centered && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
