'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Sparkles, User, Loader2 } from 'lucide-react'

interface MissedQuestion {
  questionId: string
  questionText: string
  correctAnswer: string
  userAnswer: string
  term?: string
  conceptTags?: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TutorChatProps {
  isOpen: boolean
  onClose: () => void
  moduleNumber: number
  activityKey: string
  activityName: string
  missedQuestions: MissedQuestion[]
  correctCount: number
  totalCount: number
}

export default function TutorChat({
  isOpen,
  onClose,
  moduleNumber,
  activityKey,
  activityName,
  missedQuestions,
  correctCount,
  totalCount,
}: TutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Storage key for this specific quiz attempt
  const storageKey = `tutor-chat-${activityKey}-${missedQuestions.map(q => q.questionId).join('-')}`

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (isOpen && !hasStarted) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed.map((m: ChatMessage) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })))
          setHasStarted(true)
        } catch (e) {
          console.error('Failed to parse saved chat:', e)
        }
      }
    }
  }, [isOpen, storageKey, hasStarted])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, storageKey])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Start the conversation automatically when chat opens
  useEffect(() => {
    if (isOpen && !hasStarted && missedQuestions.length > 0) {
      startConversation()
    }
  }, [isOpen, hasStarted, missedQuestions])

  const startConversation = async () => {
    setHasStarted(true)
    setIsLoading(true)

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          moduleNumber,
          activityKey,
          activityName,
          missedQuestions,
          correctCount,
          totalCount,
          messages: [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start chat')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }
      
      setMessages([assistantMessage])
    } catch (error) {
      console.error('Error starting conversation:', error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: "Hi there! I'm Bright, your money tutor. I had a little trouble loading, but I'm here to help you with your quiz questions. What would you like to work on?",
        timestamp: new Date(),
      }
      setMessages([errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          moduleNumber,
          activityKey,
          activityName,
          missedQuestions,
          correctCount,
          totalCount,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          userInput: input.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: "Oops! I had a little trouble thinking about that. Can you try asking again?",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    localStorage.removeItem(storageKey)
    setMessages([])
    setHasStarted(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/30"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-2xl h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-600 to-forest-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Bright Tutor</h3>
                <p className="text-white/70 text-sm">Here to help with your quiz</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="text-white/70 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'assistant'
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-accent-500 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Bright is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
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
            <p className="text-xs text-gray-400 mt-2 text-center">
              Ask me about anything from your quiz! I&apos;m here to help you learn.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

