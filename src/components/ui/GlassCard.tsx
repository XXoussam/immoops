import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hover ? 'hover:border-purple-light/40 hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
