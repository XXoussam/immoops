import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface MessageProps extends ComponentProps<'div'> {
  from?: 'user' | 'assistant'
  title?: string
}

export function Message({ from = 'assistant', className, children, ...props }: MessageProps) {
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      {children}
    </div>
  )
}

export function MessageContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('max-w-[90%] text-center', className)} {...props}>
      {children}
    </div>
  )
}

export function MessageResponse({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('font-sans leading-snug', className)}
      style={{ fontSize: 13, color: 'rgba(200, 210, 230, 0.70)' }}
      {...props}
    >
      {children}
    </p>
  )
}
