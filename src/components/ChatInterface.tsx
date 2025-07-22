'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Sparkles, User, Bot, Copy, RefreshCw } from 'lucide-react'
import type { Message } from '@/types/database'

interface ChatInterfaceProps {
  category: string
  onBack: () => void
}

export default function ChatInterface({ category, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const categoryTitles = {
    'story-development': 'Story Development',
    'character-creation': 'Character Creation',
    'plot-brainstorming': 'Plot Brainstorming',
    'writing-style': 'Writing Style',
    'general': 'General Writing Chat'
  }

  const categoryPrompts = {
    'story-development': [
      "Help me develop a compelling plot structure",
      "I'm stuck on my story's pacing",
      "How can I create better conflict in my narrative?"
    ],
    'character-creation': [
      "Help me create a complex protagonist",
      "How do I develop realistic character flaws?",
      "I need help with character backstories"
    ],
    'plot-brainstorming': [
      "Generate some plot twist ideas",
      "Help me brainstorm scene ideas",
      "I need a unique story premise"
    ],
    'writing-style': [
      "How can I improve my dialogue?",
      "Help me show instead of tell",
      "I want to develop my narrative voice"
    ],
    'general': [
      "What writing project should I start?",
      "Help me overcome writer's block",
      "Give me some creative writing exercises"
    ]
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      conversation_id: 'current',
      role: 'assistant',
      content: getWelcomeMessage(category),
      created_at: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [category])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getWelcomeMessage = (cat: string) => {
    const messages = {
      'story-development': "Welcome to Story Development! I'm here to help you craft compelling narratives and build strong plot structures. What story are you working on, or what aspect of storytelling would you like to explore?",
      'character-creation': "Welcome to Character Creation! I specialize in helping you develop rich, multi-dimensional characters. Whether you're creating protagonists, antagonists, or supporting characters, I'm here to help bring them to life. What character are you working on?",
      'plot-brainstorming': "Welcome to Plot Brainstorming! Let's generate some exciting ideas for your story. I can help you develop plot twists, scene concepts, story premises, and more. What kind of story or scene are you imagining?",
      'writing-style': "Welcome to Writing Style coaching! I'm here to help you refine your prose, improve your dialogue, and develop your unique narrative voice. What aspect of your writing would you like to work on?",
      'general': "Hello! I'm Artemis, your creative writing assistant. I'm here to help with all aspects of creative writing - from story development to character creation, plot brainstorming to style improvement. What would you like to work on today?"
    }
    return messages[cat as keyof typeof messages] || messages.general
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      conversation_id: 'current',
      role: 'user',
      content: input.trim(),
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          category,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })) // Send last 10 messages for context
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: 'current',
        role: 'assistant',
        content: data.message, // Changed from data.response to data.message
        created_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversation_id: 'current',
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or check your connection.",
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="glass border-b border-slate-700/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {categoryTitles[category as keyof typeof categoryTitles]}
              </h1>
              <p className="text-sm text-slate-400">AI-powered creative writing assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Artemis</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`group relative ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'glass'
                    } rounded-xl p-4 shadow-lg`}>
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700/50"
                      >
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex space-x-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="container mx-auto max-w-4xl">
            <p className="text-sm text-slate-400 mb-3">Try these prompts:</p>
            <div className="flex flex-wrap gap-2">
              {categoryPrompts[category as keyof typeof categoryPrompts]?.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="text-sm bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 px-3 py-2 rounded-lg transition-colors border border-slate-600/50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="glass border-t border-slate-700/50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your writing ideas, ask for help, or describe what you're working on..."
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 text-white p-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
