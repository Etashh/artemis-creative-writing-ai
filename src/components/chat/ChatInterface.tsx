'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConversationService, type Conversation, type Message } from '@/lib/mock-conversation-service'
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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'story-development': return '📖'
      case 'character-creation': return '👥'
      case 'plot-brainstorming': return '💡'
      case 'writing-style': return '✍️'
      default: return '💬'
    }
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

      // Generate AI response using the API endpoint
      try {
        // Call the API endpoint instead of the function directly
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            category: selectedCategory,
            conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.message;

        // Add AI response
        const aiMessageObj = await ConversationService.addMessage(
          conversation.id,
          'assistant',
          aiResponse
        )

      if (aiMessageObj) {
        setMessages(prev => [...prev, aiMessageObj])
      }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        throw new Error(`API call failed: ${apiError.message}`);
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add a more detailed error message to UI
      const errorMessage = error instanceof Error 
        ? `Error: ${error.message}` 
        : 'Sorry, I encountered an error. Please try again.';
      
      // Add more detailed troubleshooting info
      const troubleshootingMsg = 
        "This could be due to API rate limits or connection issues. " +
        "I'll use my built-in creative writing expertise instead.";
      
      setMessages(prev => [...prev, {
        id: 'error-' + Date.now(),
        conversation_id: activeConversation?.id || '',
        role: 'assistant',
        content: 'Sorry, I encountered an error while connecting to the AI service. ' + 
                 troubleshootingMsg + 
                 '\n\nLet me help with your creative writing question anyway!',
        created_at: new Date().toISOString()
      }])
      
      // After showing error, try to generate a local fallback response
      try {
        setTimeout(async () => {
          if (!activeConversation) return;
          
          const localResponse = 
            "Here are some creative writing tips that might help:\n\n" +
            "1. **Write regularly** - Even just 15 minutes a day keeps your creativity flowing\n" +
            "2. **Read widely** - The best writers are also avid readers\n" +
            "3. **Show, don't tell** - Use sensory details to bring scenes to life\n" +
            "4. **Embrace revision** - First drafts are just the beginning\n" +
            "5. **Join a writing community** - Feedback is essential for growth\n\n" +
            "What specific aspect of writing would you like me to explore further?";
            
          const fallbackMessage = await ConversationService.addMessage(
            activeConversation.id,
            'assistant',
            localResponse
          );
          
          if (fallbackMessage) {
            setMessages(prev => [...prev, fallbackMessage]);
          }
        }, 2000);
      } catch (fallbackError) {
        console.error('Error generating fallback response:', fallbackError);
      }
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
      <div className="border-b border-gray-700/50 p-4 backdrop-blur-sm glass">
        {activeConversation ? (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold gradient-text-purple">
              {activeConversation.title}
            </h2>
            <p className="text-sm text-gray-400 capitalize flex items-center mt-1">
              <span className="mr-2">{getCategoryIcon(activeConversation.category)}</span>
              {activeConversation.category.replace('-', ' ')}
            </p>
          </div>
        ) : showNewConversation ? (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold gradient-text-purple mb-3">
              Start a New Conversation
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transform hover:scale-105'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 backdrop-blur-sm transform hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <span className="mr-2 animate-bounce">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-2 animate-fadeIn">
            <div className="relative w-10 h-10 mx-auto mb-3">
              <Sparkles className="w-10 h-10 mx-auto text-purple-400 animate-float" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="gradient-text-purple">Select a conversation or start a new one</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (showNewConversation || activeConversation) ? (
          <div className="text-center text-gray-400 mt-8 animate-fadeInUp">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Sparkles className="w-20 h-20 mx-auto text-purple-400 animate-float" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-xl font-medium gradient-text-purple">Ready to unleash your creativity?</p>
            <p className="text-sm mt-2 animate-fadeIn animation-delay-300">Ask me anything about writing, and let&apos;s craft something amazing!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white glass-card'
                    : 'bg-gray-800/80 text-gray-100 glass-card'
                } transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-gray-800/80 text-gray-100 px-4 py-3 rounded-lg glass-card">
              <div className="flex items-center space-x-3">
                <div className="relative w-6 h-6">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-pink-500 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <span className="gradient-text-purple">Artemis is crafting a response...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {(activeConversation || showNewConversation) && (
        <div className="border-t border-gray-700/50 p-4 backdrop-blur-sm">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Artemis about your writing..."
              disabled={loading}
              variant="glass"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              variant="gradient"
              className="px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
