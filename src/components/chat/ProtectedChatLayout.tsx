'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationSidebar } from '@/components/chat/ConversationSidebar'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { type Conversation } from '@/lib/mock-conversation-service'
import { Button } from '@/components/ui/Button'
import { LogOut, User } from 'lucide-react'

export function ProtectedChatLayout() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [showNewConversation, setShowNewConversation] = useState(true)  // Start with new conversation by default

  // No need to redirect to auth page anymore, remove that effect
  // The user is always available as a guest

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setShowNewConversation(false)
  }

  const handleNewConversation = () => {
    setActiveConversation(null)
    setShowNewConversation(true)
  }

  const handleConversationCreated = (conversation: Conversation) => {
    setActiveConversation(conversation)
    setShowNewConversation(false)
  }

  const handleSignOut = async () => {
    await signOut()
    // No redirect needed for testing
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // We'll always have a user now (guest user), so we can render the chat interface
  // We'll always have a user now (guest user), so we can render the chat interface
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 right-0 z-10 p-4 flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <User className="w-4 h-4" />
          <span>{user?.user_metadata?.full_name || "Guest User"}</span>
        </div>
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Sidebar */}
      <ConversationSidebar
        activeConversationId={activeConversation?.id}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatInterface
          activeConversation={activeConversation}
          showNewConversation={showNewConversation}
          onConversationCreated={handleConversationCreated}
          userId={user?.id || 'guest-user-id'}
        />
      </div>
    </div>
  )
}
