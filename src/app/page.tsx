'use client'

import { useState } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  const [currentView, setCurrentView] = useState<'welcome' | 'chat'>('welcome')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleStartChat = (category: string) => {
    setSelectedCategory(category)
    setCurrentView('chat')
  }

  const handleBackToWelcome = () => {
    setCurrentView('welcome')
    setSelectedCategory('')
  }

  return (
    <>
      {currentView === 'welcome' ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatInterface 
          category={selectedCategory} 
          onBack={handleBackToWelcome} 
        />
      )}
    </>
  )
}
