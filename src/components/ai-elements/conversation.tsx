import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Conversation({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('relative flex flex-col h-full', className)} {...props}>
      {children}
    </div>
  )
}

export function ConversationContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-3 px-2 py-2', className)} {...props}>
      {children}
    </div>
  )
}

export function ConversationScrollButton() {
  return null
}
