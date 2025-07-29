'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConversationService, type Conversation, type Message } from '@/lib/conversation-service'
import { generateCreativeResponse } from '@/lib/free-ai-alternatives'

interface ChatInterfaceProps {
  activeConversation: Conversation | null
  showNewConversation: boolean
  onConversationCreated: (conversation: Conversation) => void
  userId: string
}

const CATEGORIES = [
  { id: 'story-development', name: 'Story Development', icon: '📖' },
  { id: 'character-creation', name: 'Character Creation', icon: '👥' },
  { id: 'plot-brainstorming', name: 'Plot Brainstorming', icon: '💡' },
  { id: 'writing-style', name: 'Writing Style', icon: '✍️' },
  { id: 'general', name: 'General Writing', icon: '💬' },
]

export function ChatInterface({ 
  activeConversation, 
  showNewConversation, 
  onConversationCreated,
  userId 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('story-development')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeConversation) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    if (!activeConversation) return
    
    setLoadingMessages(true)
    const conversationMessages = await ConversationService.getConversationMessages(
      activeConversation.id
    )
    setMessages(conversationMessages)
    setLoadingMessages(false)
  }

  const generateTitle = (message: string): string => {
    // Generate a concise title from the first message
    const words = message.split(' ').slice(0, 6)
    return words.join(' ') + (message.split(' ').length > 6 ? '...' : '')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    setLoading(true)
    const userMessage = inputMessage.trim()
    setInputMessage('')

    try {
      let conversation = activeConversation

      // Create new conversation if needed
      if (!conversation && showNewConversation) {
        const title = generateTitle(userMessage)
        conversation = await ConversationService.createConversation(
          title,
          selectedCategory,
          userId
        )

        if (!conversation) {
          throw new Error('Failed to create conversation')
        }

        onConversationCreated(conversation)
      }

      if (!conversation) {
        throw new Error('No active conversation')
      }

      // Add user message
      const userMessageObj = await ConversationService.addMessage(
        conversation.id,
        'user',
        userMessage
      )

      if (userMessageObj) {
        setMessages(prev => [...prev, userMessageObj])
      }

      // Generate AI response
      const aiResponse = await generateCreativeResponse(
        selectedCategory,
        userMessage,
        messages.map(m => ({ role: m.role, content: m.content }))
      )

      // Add AI response
      const aiMessageObj = await ConversationService.addMessage(
        conversation.id,
        'assistant',
        aiResponse
      )

      if (aiMessageObj) {
        setMessages(prev => [...prev, aiMessageObj])
      }

    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message to UI
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        conversation_id: activeConversation?.id || '',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        created_at: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        {activeConversation ? (
          <div>
            <h2 className="text-lg font-semibold text-white">
              {activeConversation.title}
            </h2>
            <p className="text-sm text-gray-400 capitalize">
              {activeConversation.category.replace('-', ' ')}
            </p>
          </div>
        ) : showNewConversation ? (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Start a New Conversation
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (showNewConversation || activeConversation) ? (
          <div className="text-center text-gray-400 mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Ready to unleash your creativity?</p>
            <p className="text-sm">Ask me anything about writing, and let&apos;s craft something amazing!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span>Artemis is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {(activeConversation || showNewConversation) && (
        <div className="border-t border-gray-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Artemis about your writing..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
