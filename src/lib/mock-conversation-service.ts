// This is a mock implementation of the conversation service for testing purposes
// It stores data in memory instead of using Supabase

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

// In-memory storage for conversations and messages
const conversations: Conversation[] = [];
const messages: Message[] = [];

export class ConversationService {
  // Create a new conversation
  static async createConversation(
    title: string, 
    category: string, 
    userId: string
  ): Promise<Conversation | null> {
    try {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        title,
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      conversations.push(newConversation);
      console.log('Created new conversation:', newConversation);
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  // Get user's conversations
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      return conversations
        .filter(conv => conv.user_id === userId)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  // Get a specific conversation by ID
  static async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const conversation = conversations.find(conv => conv.id === conversationId);
      return conversation || null;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }

  // Add a message to a conversation
  static async addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message | null> {
    try {
      // Update the conversation's updated_at timestamp
      const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
      if (conversationIndex >= 0) {
        conversations[conversationIndex].updated_at = new Date().toISOString();
      }

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id: conversationId,
        role,
        content,
        created_at: new Date().toISOString()
      };
      
      messages.push(newMessage);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  // Get messages for a conversation
  static async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      return messages
        .filter(msg => msg.conversation_id === conversationId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Update a conversation title
  static async updateConversationTitle(
    conversationId: string,
    title: string
  ): Promise<boolean> {
    try {
      const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
      if (conversationIndex >= 0) {
        conversations[conversationIndex].title = title;
        conversations[conversationIndex].updated_at = new Date().toISOString();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }
  }

  // Delete a conversation
  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const initialLength = conversations.length;
      const conversationIndex = conversations.findIndex(conv => conv.id === conversationId);
      
      if (conversationIndex >= 0) {
        conversations.splice(conversationIndex, 1);
        
        // Also remove all messages for this conversation
        const messagesToKeep = messages.filter(msg => msg.conversation_id !== conversationId);
        messages.length = 0;
        messages.push(...messagesToKeep);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }
}
