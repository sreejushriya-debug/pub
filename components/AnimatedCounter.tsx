'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  decimals?: number
}

export default function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2000,
  className = '',
  decimals = 0
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const updateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    requestAnimationFrame(updateValue)
  }, [isInView, value, duration])

  const formatValue = (val: number) => {
    if (value >= 1000) {
      return (val / 1000).toFixed(1) + 'k'
    }
    return decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString()
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  )
}
