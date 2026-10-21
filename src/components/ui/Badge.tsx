import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`tag bg-accent/15 text-accent border border-accent/30 ${className}`}
    >
      {children}
    </span>
  )
}
