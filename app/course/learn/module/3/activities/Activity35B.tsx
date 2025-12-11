'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, FileText } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function Activity35B({ onComplete }: Props) {
  const [form, setForm] = useState({ date: '', payee: '', amountNum: '', amountWords: '', memo: '', signature: '' })
  const [checked, setChecked] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCheck = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.date) newErrors.date = 'Enter a date'
    if (!form.payee) newErrors.payee = 'Enter the charity name'
    
    const numAmount = parseFloat(form.amountNum.replace(/[$,]/g, ''))
    if (isNaN(numAmount) || numAmount < 324 || numAmount > 326) {
      newErrors.amountNum = 'Amount should be $325.00'
    }
    
    const wordsLower = form.amountWords.toLowerCase()
    if (!wordsLower.includes('three hundred') || !wordsLower.includes('twenty') || !wordsLower.includes('five')) {
      newErrors.amountWords = 'Write "Three hundred twenty-five and 00/100"'
    }
    
    if (!form.signature) newErrors.signature = 'Sign the check'
    
    setErrors(newErrors)
    setChecked(true)
    return Object.keys(newErrors).length === 0
  }

  const allValid = checked && Object.keys(errors).length === 0

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.5B – Write a Check for $325</h2>
        </div>
        <p className="text-gray-600">Fill out this check to your favorite charity</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800"><strong>Task:</strong> Write a check for <strong>$325.00</strong> to your favorite charity.</p>
      </div>

      {/* Check form */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-gray-300 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Your Name</p>
            <p className="font-semibold">Student Name</p>
            <p className="text-xs text-gray-500">123 Main Street</p>
          </div>
          <div className="text-right">
            <label className="text-sm text-gray-600 block mb-1">Date</label>
            <input type="text" placeholder="MM/DD/YYYY" value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`w-32 px-2 py-1 border-b-2 bg-transparent focus:outline-none ${errors.date ? 'border-red-400' : 'border-gray-400'}`}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium whitespace-nowrap">Pay to the Order of:</span>
          <input type="text" placeholder="Charity Name" value={form.payee}
            onChange={(e) => setForm({ ...form, payee: e.target.value })}
            className={`flex-1 px-2 py-1 border-b-2 bg-transparent focus:outline-none ${errors.payee ? 'border-red-400' : 'border-gray-400'}`}
          />
          <div className="flex items-center">
            <span className="font-bold">$</span>
            <input type="text" placeholder="325.00" value={form.amountNum}
              onChange={(e) => setForm({ ...form, amountNum: e.target.value })}
              className={`w-24 px-2 py-1 border-2 rounded bg-white focus:outline-none ${errors.amountNum ? 'border-red-400' : 'border-gray-400'}`}
            />
          </div>
        </div>
        {(errors.payee || errors.amountNum) && (
          <p className="text-xs text-red-500 mb-2">{errors.payee || errors.amountNum}</p>
        )}

        <div className="mb-4">
          <input type="text" placeholder="Three hundred twenty-five and 00/100" value={form.amountWords}
            onChange={(e) => setForm({ ...form, amountWords: e.target.value })}
            className={`w-full px-2 py-1 border-b-2 bg-transparent focus:outline-none ${errors.amountWords ? 'border-red-400' : 'border-gray-400'}`}
          />
          <span className="text-sm text-gray-500">DOLLARS</span>
          {errors.amountWords && <p className="text-xs text-red-500 mt-1">{errors.amountWords}</p>}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <label className="text-sm text-gray-600">Memo:</label>
            <input type="text" placeholder="Donation" value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              className="w-40 px-2 py-1 border-b-2 border-gray-400 bg-transparent focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block">Signature:</label>
            <input type="text" placeholder="Sign here" value={form.signature}
              onChange={(e) => setForm({ ...form, signature: e.target.value })}
              className={`w-40 px-2 py-1 border-b-2 bg-transparent focus:outline-none italic ${errors.signature ? 'border-red-400' : 'border-gray-400'}`}
            />
            {errors.signature && <p className="text-xs text-red-500 mt-1">{errors.signature}</p>}
          </div>
        </div>
      </div>

      {allValid && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> <strong>Great job!</strong> Your check is filled out correctly!</p>
        </div>
      )}

      {checked && !allValid && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 flex items-center gap-2"><XCircle className="w-5 h-5" /> Please fix the errors above and try again.</p>
        </div>
      )}

      <div className="flex justify-center">
        {!allValid && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={validateCheck} className="btn-primary px-6 py-3">
            Check My Check
          </motion.button>
        )}
        {allValid && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ check1: form })} className="btn-primary px-8 py-3">
            Write Another Check <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}


