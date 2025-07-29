'use client'

import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ConversationService, type Conversation } from '@/lib/conversation-service'
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
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Button 
          onClick={onNewConversation}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new conversation to begin!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation)}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-sm">
                      {getCategoryIcon(conversation.category)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
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
                  >
                    <Trash2 className="w-3 h-3" />
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
