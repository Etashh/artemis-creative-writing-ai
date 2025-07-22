'use client'

import { motion } from 'framer-motion'
import { Feather, Sparkles, BookOpen, Users, PenTool, Lightbulb } from 'lucide-react'

interface WelcomeScreenProps {
  onStartChat: (category: string) => void
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const categories = [
    {
      id: 'story-development',
      title: 'Story Development',
      description: 'Build compelling narratives and plot structures',
      icon: BookOpen,
      color: 'from-blue-500 to-purple-600',
      examples: ['Plot structure help', 'Story pacing advice', 'Conflict development']
    },
    {
      id: 'character-creation',
      title: 'Character Creation',
      description: 'Develop rich, multi-dimensional characters',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      examples: ['Character backgrounds', 'Personality development', 'Character arcs']
    },
    {
      id: 'plot-brainstorming',
      title: 'Plot Brainstorming',
      description: 'Generate and refine creative plot ideas',
      icon: Lightbulb,
      color: 'from-pink-500 to-red-600',
      examples: ['Plot twists', 'Scene ideas', 'Story premises']
    },
    {
      id: 'writing-style',
      title: 'Writing Style',
      description: 'Improve your prose and narrative voice',
      icon: PenTool,
      color: 'from-green-500 to-teal-600',
      examples: ['Dialogue improvement', 'Show vs tell', 'Voice development']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full mr-4"
            >
              <Feather className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text">Artemis</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered creative writing companion. Specialized in helping you craft compelling stories, 
            develop rich characters, and overcome creative blocks.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center mt-4 text-amber-400"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-sm">Designed specifically for creative writers</span>
          </motion.div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartChat(category.id)}
                className="group cursor-pointer"
              >
                <div className="glass rounded-xl p-6 h-full hover:bg-slate-800/50 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{category.description}</p>
                  <div className="space-y-1">
                    {category.examples.map((example, i) => (
                      <div key={i} className="text-xs text-slate-500 flex items-center">
                        <div className="w-1 h-1 bg-slate-500 rounded-full mr-2"></div>
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-slate-400 mb-6">
            Choose a category above to start your creative writing session, or click below for a general conversation.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartChat('general')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Start General Chat
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-8">Why Choose Artemis?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Specialized Knowledge</h3>
              <p className="text-slate-400 text-sm">
                Trained specifically for creative writing tasks, not general problem-solving
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Personalized Guidance</h3>
              <p className="text-slate-400 text-sm">
                Adapts to your writing style, genre preferences, and experience level
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Creative Inspiration</h3>
              <p className="text-slate-400 text-sm">
                Generates unique ideas and helps overcome writer&apos;s block with targeted prompts
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
