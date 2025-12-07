'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenLine, CheckCircle2 } from 'lucide-react'

interface Activity12BProps {
  missedWords: string[]
  onComplete: (data: Record<string, unknown>) => void
}

const DEFAULT_WORDS = ['debt', 'budget', 'savings', 'interest']

export default function Activity12B({ missedWords, onComplete }: Activity12BProps) {
  const wordsToUse = missedWords.length >= 3 
    ? missedWords.slice(0, 4) 
    : DEFAULT_WORDS

  const [sentences, setSentences] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (word: string, value: string) => {
    setSentences({ ...sentences, [word]: value })
    setErrors({ ...errors, [word]: '' })
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    
    wordsToUse.forEach(word => {
      const sentence = sentences[word]?.trim() || ''
      if (sentence.length < 10) {
        newErrors[word] = 'Please write a complete sentence (at least 10 characters)'
      } else if (!sentence.toLowerCase().includes(word.toLowerCase())) {
        newErrors[word] = `Make sure to include the word "${word}" in your sentence`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Great Writing! ✍️
          </h2>
          <p className="text-gray-600">
            You created your own sentences using financial terms!
          </p>
        </div>

        {/* Show their sentences */}
        <div className="space-y-4 mb-8">
          {wordsToUse.map(word => (
            <div key={word} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-700 mb-2 capitalize">{word}</p>
              <p className="text-gray-800">&ldquo;{sentences[word]}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({
              activity_12b_sentences: sentences
            })}
            className="btn-primary px-8 py-3"
          >
            Continue to Next Activity <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PenLine className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Activity 1.2B – Create Your Own Sentences
          </h2>
        </div>
        <p className="text-gray-600">
          Now it&apos;s your turn! Write a sentence using each word in a money example.
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Example:</strong> If the word is &ldquo;budget,&rdquo; you might write: 
          &ldquo;My mom uses a budget to plan how much we spend on groceries each week.&rdquo;
        </p>
      </div>

      {/* Sentence Writing */}
      <div className="space-y-6 mb-8">
        {wordsToUse.map(word => (
          <div key={word}>
            <label className="block mb-2">
              <span className="font-semibold text-gray-900">Write a sentence using: </span>
              <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full font-bold ml-2">
                {word}
              </span>
            </label>
            <textarea
              value={sentences[word] || ''}
              onChange={(e) => handleChange(word, e.target.value)}
              placeholder={`Write a sentence using the word "${word}" in a money example...`}
              className={`w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 h-24 ${
                errors[word] ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors[word] && (
              <p className="text-sm text-red-500 mt-1">{errors[word]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-primary px-8 py-3"
        >
          Submit My Sentences <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

