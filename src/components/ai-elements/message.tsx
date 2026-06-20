import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface MessageProps extends ComponentProps<'div'> {
  from?: 'user' | 'assistant'
  title?: string
}

export function Message({ from = 'assistant', className, children, ...props }: MessageProps) {
  const isUser = from === 'user'
  return (
    <div className={cn('flex gap-2 px-1', isUser ? 'justify-end' : 'justify-start', className)} {...props}>
      {children}
    </div>
  )
}

export function MessageContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('max-w-[85%]', className)} {...props}>
      {children}
    </div>
  )
}

export function MessageResponse({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('text-xs leading-relaxed', className)} style={{ color: 'rgba(255,255,255,0.75)' }} {...props}>
      {children}
    </p>
  )
}
