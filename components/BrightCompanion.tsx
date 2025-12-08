'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Sparkles, User, Loader2, HelpCircle, BookOpen } from 'lucide-react'

interface ActivityContext {
  moduleNumber: number
  activityKey: string
  activityName: string
  conceptTags: string[]
  recentAttempt?: {
    questionText?: string
    userAnswer?: string
    correctAnswer?: string
    wasCorrect?: boolean
  }
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface BrightCompanionProps {
  isOpen: boolean
  onClose: () => void
  context: ActivityContext
}

// Helper function to render markdown-like formatting
function formatMessage(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  const paragraphs = text.split(/\n\n+/)
  
  paragraphs.forEach((paragraph, pIdx) => {
    if (pIdx > 0) {
      elements.push(<div key={`space-${pIdx}`} className="h-3" />)
    }
    
    // Handle block math \[ ... \]
    if (paragraph.match(/^\s*\\\[.*\\\]\s*$/)) {
      const math = paragraph.replace(/^\s*\\\[\s*/, '').replace(/\s*\\\]\s*$/, '')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\$/g, '$')
      elements.push(
        <div key={`math-${pIdx}`} className="bg-forest-50 rounded-lg px-4 py-2 my-2 font-mono text-center text-forest-800 font-semibold">
          {math}
        </div>
      )
      return
    }
    
    const lines = paragraph.split('\n')
    lines.forEach((line, lIdx) => {
      if (lIdx > 0) {
        elements.push(<br key={`br-${pIdx}-${lIdx}`} />)
      }
      const formattedLine = formatInline(line, `${pIdx}-${lIdx}`)
      elements.push(<span key={`line-${pIdx}-${lIdx}`}>{formattedLine}</span>)
    })
  })
  
  return elements
}

function formatInline(text: string, keyPrefix: string): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let remaining = text
  let keyIdx = 0
  
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/)
    if (boldMatch) {
      result.push(<strong key={`${keyPrefix}-b-${keyIdx++}`} className="font-semibold">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }
    
    const italicMatch = remaining.match(/^\*([^*]+?)\*/)
    if (italicMatch) {
      result.push(<em key={`${keyPrefix}-i-${keyIdx++}`}>{italicMatch[1]}</em>)
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }
    
    const nextSpecial = remaining.search(/\*/)
    if (nextSpecial === -1) {
      result.push(remaining)
      break
    } else if (nextSpecial === 0) {
      result.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      result.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }
  
  return result
}

export default function BrightCompanion({ isOpen, onClose, context }: BrightCompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'activity' | 'general' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const storageKey = `bright-companion-${context.activityKey}`

  // Load chat history
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed.messages.map((m: ChatMessage) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })))
          setMode(parsed.mode || null)
        } catch (e) {
          console.error('Failed to parse saved chat:', e)
        }
      }
    }
  }, [isOpen, storageKey])

  // Save chat history
  useEffect(() => {
    if (messages.length > 0 || mode) {
      localStorage.setItem(storageKey, JSON.stringify({ messages, mode }))
    }
  }, [messages, mode, storageKey])

  // Scroll to bottom only when new messages are added (scroll container, not page)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(0)
  useEffect(() => {
    if (messages.length > prevMessageCount.current && messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
      }, 100)
    }
    prevMessageCount.current = messages.length
  }, [messages.length])

  // Focus input
  useEffect(() => {
    if (isOpen && mode) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, mode])

  const startConversation = async (selectedMode: 'activity' | 'general') => {
    setMode(selectedMode)
    setIsLoading(true)

    try {
      const response = await fetch('/api/tutor/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          mode: selectedMode,
          context,
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
        timestamp: new Date(),
      }])
    } catch (error) {
      console.error('Error starting conversation:', error)
      setMessages([{
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: selectedMode === 'activity' 
          ? `Hi! I'm Bright, your money tutor! 😊 I see you're working on ${context.activityName}. What would you like help with?`
          : "Hi! I'm Bright! 😊 I'm here to help you learn about money. What's your question?",
        timestamp: new Date(),
      }])
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
      const response = await fetch('/api/tutor/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          mode,
          context,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          userInput: input.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Oops! I had a little trouble. (${errorMsg}) Can you try again?`,
        timestamp: new Date(),
      }])
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
    setMode(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-600 to-forest-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Bright</h3>
              <p className="text-white/70 text-xs">Your money tutor</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {mode && (
              <button
                onClick={resetChat}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                New Chat
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selection or Chat */}
        {!mode ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-forest-50 to-white">
            <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hi! I'm Bright! 👋</h3>
            <p className="text-gray-600 text-sm text-center mb-6">
              I'm here to help you learn about money. What would you like help with?
            </p>
            
            <div className="w-full space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startConversation('activity')}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-4 bg-white border-2 border-forest-200 rounded-xl hover:border-forest-400 hover:bg-forest-50 transition-all text-left"
              >
                <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Help with this activity</p>
                  <p className="text-sm text-gray-500">{context.activityName}</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startConversation('general')}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-4 bg-white border-2 border-accent-200 rounded-xl hover:border-accent-400 hover:bg-accent-50 transition-all text-left"
              >
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">I have a general question</p>
                  <p className="text-sm text-gray-500">About money, saving, business, etc.</p>
                </div>
              </motion.button>
            </div>
            
            {isLoading && (
              <div className="mt-4 flex items-center gap-2 text-forest-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Starting chat...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-forest-500 to-forest-600'
                        : 'bg-gradient-to-br from-accent-500 to-accent-600'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      message.role === 'assistant'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-accent-500 text-white'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:bg-gray-100"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-forest-600 text-white rounded-xl hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

