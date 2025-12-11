'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react'

interface VideoLessonProps {
  videoId: string
  title: string
  onComplete: (data?: Record<string, unknown>) => void
}

export default function VideoLesson({ videoId, title, onComplete }: VideoLessonProps) {
  const [hasWatched, setHasWatched] = useState(false)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Play className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">Watch the video, then continue to the activity</p>
      </div>

      <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 mb-6">
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?rel=0`} title={title}
          frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
          onLoad={() => setTimeout(() => setHasWatched(true), 5000)} />
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={() => setHasWatched(!hasWatched)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${hasWatched ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
          <CheckCircle2 className={`w-5 h-5 ${hasWatched ? 'text-forest-500' : 'text-gray-400'}`} />
          I watched the video
        </button>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onComplete()} disabled={!hasWatched}
          className={`btn-primary text-lg px-8 py-3 ${!hasWatched ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Continue to Activity <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


