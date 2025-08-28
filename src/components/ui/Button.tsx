import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'neon'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] duration-300 flex items-center justify-center'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md hover:shadow-purple-500/30 hover:-translate-y-1',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-md hover:shadow-gray-500/30 hover:-translate-y-1',
    outline: 'border border-purple-500 text-purple-400 hover:border-purple-400 backdrop-blur-sm hover:bg-purple-900/20 hover:text-purple-300 hover:-translate-y-1',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg animate-gradient hover:shadow-purple-500/50 hover:-translate-y-1',
    neon: 'bg-gray-900 text-white border border-purple-500 neon-border hover:-translate-y-1'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
