import { supabase } from './supabase'

export interface Conversation {
  id: string
  user_id: string
  title: string
  category: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export class ConversationService {
  // Create a new conversation
  static async createConversation(
    title: string, 
    category: string, 
    userId: string
  ): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title,
          category,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }

  // Get user's conversations
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  // Add message to conversation
  static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        })
        .select()
        .single()

      if (error) throw error

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      return data
    } catch (error) {
      console.error('Error adding message:', error)
      return null
    }
  }

  // Get conversation messages
  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Delete conversation
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }

  // Update conversation title
  static async updateConversationTitle(
    conversationId: string, 
    title: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title })
        .eq('id', conversationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating conversation title:', error)
      return false
    }
  }
}
