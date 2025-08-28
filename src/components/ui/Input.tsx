import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'default' | 'glass' | 'neon'
}

export function Input({ 
  label, 
  error, 
  variant = 'default', 
  className = '', 
  ...props 
}: InputProps) {
  const baseClasses = 'w-full px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-gray-800 border border-gray-600 focus:border-purple-400 hover:border-purple-500 shadow-sm',
    glass: 'bg-gray-800/40 backdrop-filter backdrop-blur-sm border border-gray-600/60 focus:border-purple-400 hover:border-purple-500/80 shadow-sm',
    neon: 'bg-gray-900 border border-purple-500 neon-border focus:neon-border'
  }
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`${baseClasses} ${variantClasses[variant]} ${error ? 'border-red-500' : ''} ${className} focus:shadow-purple-500/20 hover:-translate-y-1 hover:shadow-md transition-transform`}
          {...props}
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-10 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      </div>
      {error && (
        <p className="text-sm text-red-400 animate-fadeIn">{error}</p>
      )}
    </div>
  )
}
