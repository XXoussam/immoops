import { type ComponentProps, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function Conversation({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('relative flex flex-col h-full', className)} {...props}>
      {children}
    </div>
  )
}

export function ConversationContent({ className, children, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  })
  return (
    <div ref={ref} className={cn('flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function ConversationScrollButton() {
  return null
}
