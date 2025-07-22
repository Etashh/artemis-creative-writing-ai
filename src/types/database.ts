export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  writing_preferences?: WritingPreferences
  created_at: string
  updated_at: string
}

export interface WritingPreferences {
  genres: string[]
  writing_goals: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  preferred_session_length: number
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  category: 'story-development' | 'character-creation' | 'plot-brainstorming' | 'writing-style' | 'general'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: MessageMetadata
  created_at: string
}

export interface MessageMetadata {
  writing_prompt?: string
  character_details?: CharacterDetails
  plot_elements?: PlotElements
  style_feedback?: StyleFeedback
}

export interface CharacterDetails {
  name?: string
  age?: number
  personality_traits?: string[]
  backstory?: string
  goals?: string[]
  flaws?: string[]
}

export interface PlotElements {
  genre?: string
  setting?: string
  conflict?: string
  themes?: string[]
  plot_points?: string[]
}

export interface StyleFeedback {
  strengths?: string[]
  areas_for_improvement?: string[]
  suggestions?: string[]
}

export interface WritingProject {
  id: string
  user_id: string
  title: string
  description?: string
  genre: string
  status: 'planning' | 'drafting' | 'revising' | 'completed'
  word_count?: number
  target_word_count?: number
  characters?: CharacterDetails[]
  plot_outline?: string
  created_at: string
  updated_at: string
}
