'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, X, Sparkles, Send, Loader2, CheckCircle2, 
  XCircle, Trophy, Target, RotateCcw
} from 'lucide-react'
import { 
  updateConceptScores, 
  addPracticeSession,
  CONCEPT_DISPLAY_NAMES 
} from '@/lib/conceptProgress'

interface PracticeSessionProps {
  userId: string
  topics: string[]
  onComplete: () => void
  onExit: () => void
}

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  isQuestion?: boolean
  questionData?: {
    concept: string
    correctAnswer: string
  }
}

interface SessionStats {
  questionsAttempted: number
  questionsCorrect: number
  conceptsWorked: string[]
  startTime: Date
}

export default function PracticeSession({ userId, topics, onComplete, onExit }: PracticeSessionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [currentConcept, setCurrentConcept] = useState<string | null>(null)
  const [waitingForAnswer, setWaitingForAnswer] = useState(false)
  const [currentQuestionData, setCurrentQuestionData] = useState<{ concept: string; correctAnswer: string } | null>(null)
  const [stats, setStats] = useState<SessionStats>({
    questionsAttempted: 0,
    questionsCorrect: 0,
    conceptsWorked: [],
    startTime: new Date()
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevMessageCount = useRef(0)

  // Only scroll to bottom when a NEW message is added, not on every render
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      // Small delay to let the message render
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
    prevMessageCount.current = messages.length
  }, [messages.length])

  useEffect(() => {
    if (!waitingForAnswer) {
      inputRef.current?.focus()
    }
  }, [waitingForAnswer, messages])

  // Start the session
  useEffect(() => {
    startSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startSession = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/practice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          topics,
          messages: [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      setMessages([{
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.message,
      }])

      // If the first message includes a question, set up for answer
      if (data.isQuestion && data.questionData) {
        setWaitingForAnswer(true)
        setCurrentQuestionData(data.questionData)
        setCurrentConcept(data.questionData.concept)
        if (!stats.conceptsWorked.includes(data.questionData.concept)) {
          setStats(s => ({ ...s, conceptsWorked: [...s.conceptsWorked, data.questionData.concept] }))
        }
      }
    } catch (error) {
      console.error('Error starting session:', error)
      setMessages([{
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm Bright, and I'm here to help you practice ${topics.map(t => CONCEPT_DISPLAY_NAMES[t] || t).join(', ')}. Let's start with a warm-up question! What would you like to begin with?`,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/practice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          topics,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          userInput: input.trim(),
          waitingForAnswer,
          currentQuestionData,
          stats,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      // Update stats if this was an answer
      if (waitingForAnswer && currentQuestionData) {
        const newStats = { ...stats }
        newStats.questionsAttempted += 1
        
        if (data.wasCorrect) {
          newStats.questionsCorrect += 1
        }
        
        setStats(newStats)
        
        // Update concept progress
        updateConceptScores(userId, [{
          concept: currentQuestionData.concept,
          correct: data.wasCorrect
        }])
      }

      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message,
      }])

      // Check if session should end
      if (data.sessionComplete) {
        endSession()
        return
      }

      // Set up for next question if there is one
      if (data.isQuestion && data.questionData) {
        setWaitingForAnswer(true)
        setCurrentQuestionData(data.questionData)
        setCurrentConcept(data.questionData.concept)
        if (!stats.conceptsWorked.includes(data.questionData.concept)) {
          setStats(s => ({ ...s, conceptsWorked: [...s.conceptsWorked, data.questionData.concept] }))
        }
      } else {
        setWaitingForAnswer(false)
        setCurrentQuestionData(null)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Oops! I had a little trouble there. (Error: ${errorMsg}) Can you try again?`,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const endSession = () => {
    // Save practice session
    const duration = Math.round((new Date().getTime() - stats.startTime.getTime()) / 1000)
    
    addPracticeSession(userId, {
      date: new Date(),
      conceptsWorked: stats.conceptsWorked,
      questionsAttempted: stats.questionsAttempted,
      questionsCorrect: stats.questionsCorrect,
      duration,
    })

    setIsComplete(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Format message content (handle bold, etc.)
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g)
      return (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    })
  }

  // Completion screen
  if (isComplete) {
    const percentage = stats.questionsAttempted > 0 
      ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100)
      : 0

    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
        <div className="container-custom max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Practice Session Complete! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Great work practicing today!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-forest-600">{stats.questionsAttempted}</p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{stats.questionsCorrect}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-accent-600">{percentage}%</p>
                <p className="text-sm text-gray-500">Accuracy</p>
              </div>
            </div>

            <div className="bg-forest-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-medium text-forest-800 mb-2">Concepts practiced:</p>
              <div className="flex flex-wrap gap-2">
                {stats.conceptsWorked.map(c => (
                  <span key={c} className="px-3 py-1 bg-white rounded-full text-sm text-forest-700">
                    {CONCEPT_DISPLAY_NAMES[c] || c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsComplete(false)
                  setMessages([])
                  setStats({
                    questionsAttempted: 0,
                    questionsCorrect: 0,
                    conceptsWorked: [],
                    startTime: new Date()
                  })
                  startSession()
                }}
                className="px-6 py-3 border-2 border-forest-300 text-forest-700 rounded-xl font-medium hover:bg-forest-50 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="btn-primary px-6 py-3"
              >
                Back to Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Practice Session</h1>
              <p className="text-sm text-gray-500">
                {topics.map(t => CONCEPT_DISPLAY_NAMES[t] || t).join(', ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Score</p>
              <p className="font-bold text-forest-600">
                {stats.questionsCorrect}/{stats.questionsAttempted}
              </p>
            </div>
            <button
              onClick={onExit}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-forest-500 to-forest-600'
                      : 'bg-gradient-to-br from-accent-500 to-accent-600'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm font-medium">You</span>
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'assistant'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-accent-500 text-white'
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {formatContent(message.content)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={waitingForAnswer ? "Type your answer..." : "Type a message..."}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:bg-gray-100"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Quick actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setInput("I don't understand")}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100"
              >
                I don&apos;t understand
              </button>
              <button
                onClick={() => setInput("Give me a hint")}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100"
              >
                Give me a hint
              </button>
              <button
                onClick={() => setInput("Next topic please")}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100"
              >
                Next topic
              </button>
              <button
                onClick={endSession}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100"
              >
                End session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

