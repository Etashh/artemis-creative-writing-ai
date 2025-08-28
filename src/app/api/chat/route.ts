import { NextRequest, NextResponse } from 'next/server'
// Use the fixed version instead of the original
import { generateCreativeResponse } from '@/lib/fixed-ai-alternatives'

export async function POST(request: NextRequest) {
  try {
    const { message, category, conversationHistory } = await request.json()

    if (!message || !category) {
      return NextResponse.json(
        { error: 'Message and category are required' },
        { status: 400 }
      )
    }

    console.log('📝 Processing request with category:', category)
    console.log('📝 Message length:', message.length)
    console.log('📝 Message content:', message.substring(0, 50) + '...')
    console.log('📝 Environment variables available:',
      'GROQ_API_KEY:', !!process.env.GROQ_API_KEY,
      'HUGGINGFACE_API_KEY:', !!process.env.HUGGINGFACE_API_KEY,
      'TOGETHER_API_KEY:', !!process.env.TOGETHER_API_KEY
    )

    // Generate response using free AI alternatives with improved error handling
    const response = await generateCreativeResponse(category, message, conversationHistory)

    console.log('✅ Generated response successfully')

    return NextResponse.json({
      message: response,
      category,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('🔴 Chat API error:', error)
    
    // Return a more helpful error response
    return NextResponse.json({
      message: "I'm having trouble connecting to my creative writing brain right now. Let me help you with some general writing advice instead!\n\n" +
               "**Quick Writing Tips:**\n" +
               "- Write regularly, even if just for 15 minutes\n" +
               "- Read widely in your genre\n" +
               "- Get feedback from other writers\n" +
               "- Don't edit while drafting\n" +
               "- Remember: all first drafts need revision\n\n" +
               "How can I help with your writing project today?",
      category: 'general',
      timestamp: new Date().toISOString(),
      isErrorFallback: true
    })
  }
}