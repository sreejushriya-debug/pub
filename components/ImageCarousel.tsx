'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  interval?: number
  className?: string
}

export default function ImageCarousel({ images, interval = 4000, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-900 ${className}`}>
      {/* Show all images stacked, only animate opacity for smooth crossfade */}
      {images.map((image, idx) => (
        <motion.div
          key={idx}
          initial={false}
          animate={{ 
            opacity: idx === currentIndex ? 1 : 0,
            scale: idx === currentIndex ? 1 : 1.05,
          }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ zIndex: idx === currentIndex ? 1 : 0 }}
        >
          <Image
            src={image}
            alt={`Slide ${idx + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={idx === 0}
          />
        </motion.div>
      ))}
      
      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

