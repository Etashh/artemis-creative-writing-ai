import { NextRequest, NextResponse } from 'next/server'
import { generateCreativeResponse } from '@/lib/free-ai-alternatives'

export async function POST(request: NextRequest) {
  try {
    const { message, category, conversationHistory } = await request.json()

    if (!message || !category) {
      return NextResponse.json(
        { error: 'Message and category are required' },
        { status: 400 }
      )
    }

    // Generate response using free AI alternatives with fallback
    const response = await generateCreativeResponse(category, message, conversationHistory)

    return NextResponse.json({
      message: response,
      category,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
