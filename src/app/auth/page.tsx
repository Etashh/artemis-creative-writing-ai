'use client'

import { useState, useEffect } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // If user is already logged in, redirect to home
      router.push('/')
    }
  }, [user, loading, router])

  return (
    <AuthForm 
      mode={mode} 
      onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')} 
    />
  )
}
