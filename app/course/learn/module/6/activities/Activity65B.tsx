'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Download, Printer } from 'lucide-react'

interface Props {
  quizScore: { correct: number; total: number }
  onComplete: (data: Record<string, unknown>) => void
}

export default function Activity65B({ quizScore, onComplete }: Props) {
  const { user } = useUser()
  const [certificateRef, setCertificateRef] = useState<HTMLDivElement | null>(null)
  const passed = (quizScore.correct / quizScore.total) >= 0.70

  const handleDownload = () => {
    if (!certificateRef) return
    // In a real implementation, you'd use a library like html2pdf or jsPDF
    window.print()
  }

  if (!passed) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Keep Practicing! 📚</h2>
          <p className="text-gray-600">You scored {quizScore.correct}/{quizScore.total} ({Math.round((quizScore.correct / quizScore.total) * 100)}%)</p>
          <p className="text-gray-600 mt-2">You need 70% to pass. Review the topics and try the quiz again!</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-amber-900 mb-3">Topics to Review:</h3>
          <ul className="space-y-2 text-amber-800">
            <li>• Vocabulary (interest, profit, assets, etc.)</li>
            <li>• Budgeting and money management</li>
            <li>• Business math (revenue, expenses, profit)</li>
            <li>• Credit vs debit</li>
            <li>• Tax and discount calculations</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ certificate_earned: false })}
            className="btn-primary px-8 py-3">
            Continue to Reflection <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-container,
          .certificate-container * {
            visibility: visible;
          }
          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="p-6 md:p-8">
        <div className="text-center mb-8 no-print">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Money Master Certificate! 🎉</h2>
          <p className="text-gray-600">Congratulations on completing the Financial Foundations course!</p>
        </div>

        <div ref={setCertificateRef} className="certificate-container bg-gradient-to-br from-amber-50 via-white to-amber-50 border-4 border-amber-300 rounded-2xl p-12 mb-8 max-w-3xl mx-auto shadow-2xl print:shadow-none print:border-amber-300 print:rounded-none print:max-w-none print:m-0 print:p-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">CERTIFICATE OF COMPLETION</h1>
            <div className="border-t-2 border-amber-400 w-32 mx-auto my-4"></div>
            <p className="text-xl text-gray-700 mb-6">
              This certifies that
            </p>
            <p className="text-3xl font-bold text-forest-700 mb-6">
              {user?.firstName || 'Student'} {user?.lastName || ''}
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              has completed the <strong>Financial Foundations</strong> course and can budget, save, spend wisely, 
              and understand basic investing, business, and shopping math.
            </p>
            <div className="flex justify-between items-end mt-12">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                <p className="text-sm text-gray-600">Project Bright Beginnings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6 no-print">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleDownload} className="btn-outline px-6 py-3 flex items-center gap-2">
            <Printer className="w-5 h-5" /> Print Certificate
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleDownload} className="btn-outline px-6 py-3 flex items-center gap-2">
            <Download className="w-5 h-5" /> Download PDF
          </motion.button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto no-print">
          <p className="text-green-800 text-center">
            <strong>🎉 Amazing work!</strong> You&apos;ve mastered financial literacy fundamentals. 
            Use these skills to make smart money decisions in real life!
          </p>
        </div>

        <div className="flex justify-center no-print">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ certificate_earned: true, certificate_date: new Date().toISOString() })}
            className="btn-primary px-8 py-3">
            Complete Course! 🎉 <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    </>
  )
}

