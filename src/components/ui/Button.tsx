import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const variants: Record<string, string> = {
  primary: 'bg-rp-red text-white hover:bg-rp-red-dark',
  outline: 'border-2 border-rp-red text-rp-red hover:bg-rp-red hover:text-white',
  ghost: 'text-rp-gray-700 hover:text-rp-red hover:bg-rp-red-light',
}

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-7 py-3.5 text-base rounded-md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  children,
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-red focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
