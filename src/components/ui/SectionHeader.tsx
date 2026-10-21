import type { ReactNode } from 'react'

interface SectionHeaderProps {
  label: string
  title: ReactNode
  description?: ReactNode
  /** white text variants for dark sections */
  dark?: boolean
  className?: string
  /** keep description under the title (for narrow columns) */
  stacked?: boolean
}

/** Galadrim-style section header: [LABEL] + title on the left, description on the right. */
export function SectionHeader({ label, title, description, dark = false, className = 'mb-14', stacked = false }: SectionHeaderProps) {
  return (
    <div className={`grid grid-cols-1 ${stacked ? 'gap-5' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] gap-6 lg:gap-16 lg:items-end'} ${className}`}>
      <div>
        <span className={dark ? 'label-white' : 'label'}>[{label}]</span>
        <h2 className={dark ? 'h2-white' : 'h2'}>{title}</h2>
      </div>
      {description && (
        <p
          className={stacked ? 'body2 max-w-[480px]' : 'body2 lg:text-right lg:pb-2'}
          style={dark ? { color: 'rgba(255,255,255,0.6)' } : undefined}
        >
          {description}
        </p>
      )}
    </div>
  )
}
