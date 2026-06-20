import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface MessageProps extends ComponentProps<'div'> {
  from?: 'user' | 'assistant'
  title?: string
}

export function Message({ from = 'assistant', className, children, ...props }: MessageProps) {
  const isUser = from === 'user'
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start', 'is-' + from, className)} {...props}>
      {children}
    </div>
  )
}

export function MessageContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('max-w-[80%]', className)} {...props}>
      {children}
    </div>
  )
}

export function MessageResponse({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm leading-relaxed px-3 py-2 rounded-xl', className)} {...props}>
      {children}
    </p>
  )
}
