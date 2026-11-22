import React, { useEffect, useRef, useState } from 'react'

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'up' | 'scale' | 'left' | 'right' | 'fade'
  delay?: number // in milliseconds
  threshold?: number
  className?: string
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  threshold = 0.12,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true)
      return
    }

    const currentEl = ref.current
    if (!currentEl) return

    // Immediately reveal if already visible in viewport
    const rect = currentEl.getBoundingClientRect()
    if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(currentEl)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  const variantClass =
    variant === 'scale'
      ? 'reveal-scale'
      : variant === 'left'
      ? 'reveal-left'
      : variant === 'right'
      ? 'reveal-right'
      : ''

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${variantClass} ${isRevealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
