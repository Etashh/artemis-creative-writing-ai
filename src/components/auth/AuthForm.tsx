'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // Standard signup with email confirmation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        })

        if (error) throw error

        if (data.user) {
          // Show a message that the user needs to confirm their email
          setMessage('Account created! Please check your email for a confirmation link to complete your registration.')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        
        if (data.session) {
          // Successful login - redirect to home
          window.location.href = '/'
        }
      }
    } catch (error: unknown) {
      console.error('Auth error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-black/30 p-8 rounded-2xl border border-purple-500/20 shadow-xl animate-fadeIn">
        <div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white animate-fadeInUp">
            {mode === 'login' ? 'Sign in to Artemis' : 'Create your Artemis account'}
          </h2>
          <p className="mt-2 text-center text-sm text-purple-300 animate-fadeInUp animation-delay-150">
            Your creative writing assistant
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {mode === 'signup' && (
              <div className="animate-fadeInUp animation-delay-200">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  required
                  className="bg-gray-800/70 border-purple-500/30 focus:border-purple-400 transition-all duration-300 rounded-xl shadow-inner backdrop-blur-sm hover:border-purple-400 p-3"
                />
              </div>
            )}
            
            <div className="animate-fadeInUp animation-delay-300">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="bg-gray-800/70 border-purple-500/30 focus:border-purple-400 transition-all duration-300 rounded-xl shadow-inner backdrop-blur-sm hover:border-purple-400 p-3"
              />
            </div>
            
            <div className="animate-fadeInUp animation-delay-400">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-800/70 border-purple-500/30 focus:border-purple-400 transition-all duration-300 rounded-xl shadow-inner backdrop-blur-sm hover:border-purple-400 p-3"
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-3 rounded-lg animate-fadeIn backdrop-blur-sm ${
              message.includes('check your email') || message.includes('created') ? 
              'bg-green-500/20 text-green-300 border border-green-500/30' : 
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              <div className="flex items-center justify-center mb-1">
                {message.includes('check your email') || message.includes('created') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{message.includes('check your email') ? 'Success!' : message.includes('created') ? 'Success!' : 'Error'}</span>
              </div>
              <p>{message}</p>
            </div>
          )}

          <div className="animate-fadeInUp animation-delay-500">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl py-3 px-4 font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/30"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-l-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Signing In...' : 'Signing Up...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </div>

          <div className="text-center mt-6 animate-fadeInUp animation-delay-600">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-purple-300 hover:text-pink-300 text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:underline"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
