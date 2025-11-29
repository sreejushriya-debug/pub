'use client'

import { motion } from 'framer-motion'
import { Download, FileText, ExternalLink } from 'lucide-react'

interface ResourceCardProps {
  title: string
  description: string
  category: string
  downloadUrl: string
  fileType?: string
  previewUrl?: string
}

export default function ResourceCard({ 
  title, 
  description, 
  category, 
  downloadUrl,
  fileType = 'PDF',
  previewUrl
}: ResourceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group card-interactive h-full flex flex-col"
    >
      {/* Icon/Preview area */}
      <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-forest-50 to-sage-50 
                      flex items-center justify-center mb-6 overflow-hidden relative">
        <FileText className="w-16 h-16 text-forest-300 group-hover:text-forest-400 transition-colors" />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-forest-900/80 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 flex items-center justify-center gap-3">
          {previewUrl && (
            <a 
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                         hover:scale-110 transition-transform"
            >
              <ExternalLink className="w-5 h-5 text-forest-700" />
            </a>
          )}
          <a 
            href={downloadUrl}
            download
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center
                       hover:scale-110 transition-transform"
          >
            <Download className="w-5 h-5 text-forest-700" />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <span className="inline-block px-3 py-1 rounded-full bg-forest-100 text-forest-700 
                         text-xs font-medium mb-3 w-fit">
          {category}
        </span>
        
        <h3 className="text-lg font-display font-bold text-forest-800 mb-2 group-hover:text-forest-600 
                       transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 flex-1">
          {description}
        </p>

        {/* Download button */}
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-2 text-forest-700 font-semibold text-sm
                     hover:text-forest-600 transition-colors group/btn"
        >
          <Download className="w-4 h-4" />
          <span>Download {fileType}</span>
        </a>
      </div>
    </motion.div>
  )
}

