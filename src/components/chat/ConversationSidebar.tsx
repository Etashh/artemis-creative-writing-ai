'use client'

import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ConversationService, type Conversation } from '@/lib/mock-conversation-service'
import { Button } from '@/components/ui/Button'

interface ConversationSidebarProps {
  activeConversationId?: string
  onConversationSelect: (conversation: Conversation) => void
  onNewConversation: () => void
}

export function ConversationSidebar({ 
  activeConversationId, 
  onConversationSelect,
  onNewConversation 
}: ConversationSidebarProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return
    
    setLoading(true)
    const userConversations = await ConversationService.getUserConversations(user.id)
    setConversations(userConversations)
    setLoading(false)
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirm('Are you sure you want to delete this conversation?')) {
      const success = await ConversationService.deleteConversation(conversationId)
      if (success) {
        setConversations(conversations.filter(c => c.id !== conversationId))
      }
    }
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

  const truncateTitle = (title: string, maxLength = 30) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-800/70 backdrop-blur-sm border-r border-gray-700/50 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700/60 rounded-lg glass-card"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-800/70 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
      <div className="p-4 border-b border-gray-700/50">
        <Button 
          onClick={onNewConversation}
          className="w-full"
          variant="gradient"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 animate-fadeInUp">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <MessageSquare className="w-16 h-16 mx-auto text-purple-400 animate-float" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <p className="text-sm gradient-text-purple">No conversations yet</p>
            <p className="text-xs mt-2 animate-fadeIn animation-delay-300">Start a new conversation to begin!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation)}
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-300 animate-fadeIn glass-card hover:shadow-lg ${
                  activeConversationId === conversation.id
                    ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-filter backdrop-blur-sm'
                    : 'bg-gray-700/60 hover:bg-gray-700/80 backdrop-filter backdrop-blur-sm'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className={`text-xl ${activeConversationId === conversation.id ? 'animate-bounce' : ''}`}>
                      {getCategoryIcon(conversation.category)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-white truncate ${
                        activeConversationId === conversation.id ? 'gradient-text-purple' : ''
                      }`}>
                        {truncateTitle(conversation.title)}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {conversation.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
