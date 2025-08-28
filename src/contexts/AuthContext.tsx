'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

// Mock user for bypassing authentication
const GUEST_USER: User = {
  id: 'guest-user-id',
  app_metadata: {},
  user_metadata: { full_name: 'Guest User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'guest@example.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: '',
  updated_at: new Date().toISOString(),
} as User

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always provide the guest user for testing
  const [user, setUser] = useState<User | null>(GUEST_USER)
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Mock function for creating user profile (not actually used)
  const createUserProfile = async (user: User) => {
    console.log('Mock: Creating user profile for testing')
  }

  useEffect(() => {
    // Mark as hydrated on client
    setHydrated(true)
    
    // Set guest user immediately
    setUser(GUEST_USER)
    setLoading(false)

    // No actual auth listeners needed for testing
  }, [])

  // Prevent hydration mismatch
  if (!hydrated) {
    return (
      <AuthContext.Provider value={{ user: GUEST_USER, loading: false, signOut: async () => {} }}>
        {children}
      </AuthContext.Provider>
    )
  }

  // Mock sign out function
  const signOut = async () => {
    console.log('Mock sign out (no actual auth)')
    // Don't clear user since we want to stay logged in
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
