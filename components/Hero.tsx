'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import FloatingParticles from './FloatingParticles'

const DONATE_LINK = 'https://hcb.hackclub.com/donations/start/project-bright-beginnings-5ac9c1ad-9a9f-4135-bce7-597e9da85f30'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Floating particles */}
      <FloatingParticles count={25} />

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-forest-400/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-accent-400/15 blur-3xl" />

      <div className="relative container-custom pt-32 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm
                       text-white text-sm font-medium mb-8 border border-white/30"
          >
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span>Making Financial Education Accessible to All</span>
          </motion.div>

          {/* Headline - No italics */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-xl mb-6"
          >
            <span className="text-white font-medium">project</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 font-bold">
              bright beginnings
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Our mission is to provide foundational tools that educate students on the importance 
            of financial education and make financial literacy accessible to all.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/resources" className="btn-primary gap-2 group">
              <span>Check Out Our Resources</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a 
              href={DONATE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white gap-2 group"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
