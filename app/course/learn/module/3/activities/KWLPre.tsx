'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ArrowRight, Lightbulb } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function KWLPreActivity({ onComplete }: Props) {
  const [know, setKnow] = useState('')
  const [want, setWant] = useState('')
  const [errors, setErrors] = useState<{ know?: string; want?: string }>({})

  const handleSubmit = () => {
    const newErrors: { know?: string; want?: string } = {}
    if (know.trim().length < 20) newErrors.know = 'Please write at least a sentence (20+ characters)'
    if (want.trim().length < 20) newErrors.want = 'Please write at least a sentence (20+ characters)'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onComplete({ kwl_pre_know: know, kwl_pre_want: want })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Module 3 KWL – Before You Start</h2>
        <p className="text-gray-600">Let&apos;s see what you know about banking, credit, and investing!</p>
      </div>

      <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-forest-600 mt-0.5" />
          <div>
            <p className="font-semibold text-forest-800">Learning Target:</p>
            <p className="text-forest-700">I can understand credit & debit, read stock trends, and write checks.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">K – What I <span className="text-forest-600">Know</span></label>
          <p className="text-sm text-gray-500 mb-3">What do you know about credit cards, banks, or stocks?</p>
          <textarea value={know} onChange={(e) => { setKnow(e.target.value); setErrors({ ...errors, know: undefined }) }}
            placeholder="I know that..." className={`w-full h-40 p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.know ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
          {errors.know && <p className="text-sm text-red-500 mt-1">{errors.know}</p>}
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">W – What I <span className="text-accent-600">Want</span> to Know</label>
          <p className="text-sm text-gray-500 mb-3">What questions do you have about banking?</p>
          <textarea value={want} onChange={(e) => { setWant(e.target.value); setErrors({ ...errors, want: undefined }) }}
            placeholder="I want to learn about..." className={`w-full h-40 p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 ${errors.want ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
          {errors.want && <p className="text-sm text-red-500 mt-1">{errors.want}</p>}
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">L – What I <span className="text-sage-600">Learned</span></label>
          <p className="text-sm text-gray-500 mb-3">You&apos;ll fill this out after finishing!</p>
          <div className="w-full h-40 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <div className="text-center"><span className="text-3xl mb-2 block">🔒</span><p className="text-sm">Complete the module to unlock!</p></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="btn-primary text-lg px-8 py-4">
          Save and Start Learning <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

