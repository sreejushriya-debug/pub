'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: string
  delay: number
  duration: number
  initialBottom: string
}

export default function FloatingParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles only on client side
    // Spread particles throughout the section initially for continuity
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: 0, // No delay - start immediately
      duration: 6 + Math.random() * 6,
      // Start particles at different heights (0-100% of the container)
      initialBottom: `${Math.random() * 100}%`,
    }))
    setParticles(newParticles)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            bottom: particle.initialBottom,
            animationDelay: `-${Math.random() * particle.duration}s`, // Negative delay = already in progress
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

