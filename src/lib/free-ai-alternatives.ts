/**
 * Free AI Alternatives for Creative Writing Assistant
 * 
 * This file provides multiple completely free AI integration options:
 * 1. Groq (free tier with fast inference)
 * 2. Together AI (free tier)
 * 3. Hugging Face Inference API (free tier)
 * 4. Ollama (local AI models)
 * 5. Enhanced local responses (no API required)
 */

import { HfInference } from '@huggingface/inference'
import Groq from 'groq-sdk'

// Initialize AI clients conditionally
export const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// Only initialize Groq if API key is available
export const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null

// Free models that work well for creative writing
export const FREE_MODELS = {
  groq: {
    // Groq offers free tier with very fast inference
    primary: 'llama3-8b-8192',
    advanced: 'mixtral-8x7b-32768'
  },
  together: {
    // Together AI free tier
    primary: 'meta-llama/Llama-2-7b-chat-hf',
    advanced: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
  },
  huggingface: {
    // These models are completely free to use
    primary: 'microsoft/DialoGPT-medium',
    creative: 'facebook/blenderbot-400M-distill',
    advanced: 'microsoft/DialoGPT-large',
  }
}

// 1. Groq Integration (Very fast, generous free tier)
export async function generateWithGroq(prompt: string, userMessage: string) {
  if (!process.env.GROQ_API_KEY || !groq) {
    return null
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMessage }
      ],
      model: FREE_MODELS.groq.primary,
      max_tokens: 1000,
      temperature: 0.8,
    })

    return chatCompletion.choices[0]?.message?.content || null
  } catch (error) {
    console.error('Groq API error:', error)
    return null
  }
}

// 2. Together AI Integration (Good free tier)
export async function generateWithTogether(prompt: string, userMessage: string) {
  if (!process.env.TOGETHER_API_KEY) {
    return null
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FREE_MODELS.together.primary,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      throw new Error(`Together API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content
  } catch (error) {
    console.error('Together API error:', error)
    return null
  }
}

// 3. Hugging Face Integration (Using text generation models)
export async function generateWithHuggingFace(prompt: string, userMessage: string) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return null
  }

  try {
    // Try different models that work well for text generation
    const models = [
      'google/flan-t5-large',
      'microsoft/DialoGPT-medium',
      'bigscience/bloom-560m'
    ]

    for (const modelName of models) {
      try {
        console.log(`🔄 Trying model: ${modelName}`)
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${modelName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Question about creative writing: ${userMessage}\n\nProvide helpful advice for creative writing:`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.95,
              repetition_penalty: 1.15
            },
            options: {
              wait_for_model: true,
              use_cache: false
            }
          })
        })

        console.log(`📡 Response status for ${modelName}: ${response.status}`)

        if (response.ok) {
          const data = await response.json()
          console.log(`📊 Response data for ${modelName}:`, JSON.stringify(data).substring(0, 200))
          
          if (Array.isArray(data) && data[0]?.generated_text) {
            let generatedText = data[0].generated_text.trim()
            
            // Clean up the response
            generatedText = generatedText.replace(/^(Question about creative writing:|Provide helpful advice for creative writing:)/gm, '').trim()
            
            if (generatedText.length > 30) {
              console.log(`✅ ${modelName} generated response:`, generatedText.substring(0, 100))
              return generatedText
            }
          } else if (data.generated_text) {
            const generatedText = data.generated_text.trim()
            if (generatedText.length > 30) {
              console.log(`✅ ${modelName} generated response:`, generatedText.substring(0, 100))
              return generatedText
            }
          }
        } else {
          const errorText = await response.text()
          console.log(`❌ ${modelName} error:`, response.status, errorText.substring(0, 100))
        }
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError)
        continue
      }
    }

    return null
  } catch (error) {
    console.error('❌ Hugging Face API error:', error)
    return null
  }
}

// 4. Local Ollama Integration (Completely free, runs locally)
export async function generateWithOllama(prompt: string, userMessage: string) {
  try {
    // Check if Ollama is running locally
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b', // Small, fast model
        prompt: `${prompt}\n\nUser: ${userMessage}\nAssistant:`,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 500,
        },
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.response
  } catch (_error) {
    // Ollama not running locally - this is expected
    return null
  }
}

// Creative Writing System Prompts
export const CREATIVE_WRITING_PROMPTS = {
  'story-development': `You are Artemis, a specialized Creative Writing Assistant AI focused on story development. You help writers:

- Develop compelling plots and story structures
- Create engaging beginnings, middles, and endings
- Build narrative tension and pacing
- Resolve plot holes and inconsistencies
- Adapt stories for different genres and audiences

Provide specific, actionable advice with examples. Ask clarifying questions to better understand the writer's vision.`,

  'character-development': `You are Artemis, a Creative Writing Assistant specializing in character development. You help writers create:

- Multi-dimensional characters with clear motivations
- Realistic character flaws and growth arcs
- Compelling backstories and relationships
- Authentic dialogue that reflects personality
- Character-driven conflicts and resolutions

Always provide concrete examples and character development exercises.`,

  'plot-brainstorming': `You are Artemis, focused on plot brainstorming and story ideation. You help writers:

- Generate creative plot ideas and concepts
- Develop interesting conflicts and obstacles
- Create surprising but logical plot twists
- Build satisfying story resolutions
- Connect subplots to the main narrative

Think creatively and offer multiple options for the writer to consider.`,

  'writing-style': `You are Artemis, a writing craft specialist. You help writers improve their prose through:

- Show vs. tell techniques
- Vivid imagery and sensory details
- Dialogue improvement and tags
- Point of view consistency
- Voice development and tone
- Genre-specific writing conventions

Provide before/after examples to illustrate improvements.`,

  'genre-guidance': `You are Artemis, a genre-specific writing guide. You help writers understand and master:

- Fantasy: World-building, magic systems, mythology
- Science Fiction: Technology, world-building, scientific accuracy
- Romance: Character chemistry, relationship development, emotional arcs
- Mystery/Thriller: Clues, red herrings, pacing, suspense
- Horror: Atmosphere, tension, psychological elements
- Historical Fiction: Research, authenticity, period details

Tailor advice to the specific genre requirements and conventions.`,

  'writing-prompts': `You are Artemis, a creative prompt generator. You provide:

- Unique story starters and scenario ideas
- Character development exercises
- World-building challenges
- Writing technique practice prompts
- Genre-specific creative exercises

Make prompts engaging, specific, and designed to spark creativity.`
}

// Fallback to cascading AI providers
export async function generateCreativeResponse(
  category: string, 
  userMessage: string,
  _conversationHistory: Array<{role: string, content: string}> = []
): Promise<string> {
  const prompt = CREATIVE_WRITING_PROMPTS[category as keyof typeof CREATIVE_WRITING_PROMPTS] || 
                CREATIVE_WRITING_PROMPTS['story-development']

  console.log(`🎯 Generating response for: "${userMessage}"`)
  console.log(`📝 Category: ${category}`)
  console.log(`🔑 HF API Key available: ${!!process.env.HUGGINGFACE_API_KEY}`)

  // Try AI providers in order of preference (free tier first)
  
  // 1. Try Hugging Face first (we have API key)
  console.log('🤖 Trying Hugging Face...')
  const hfResponse = await generateWithHuggingFace(prompt, userMessage)
  if (hfResponse && hfResponse.length > 20) {
    console.log('✅ Generated response using Hugging Face')
    return hfResponse
  }

  // 2. Try Groq (if API key available)
  console.log('🤖 Trying Groq...')
  const groqResponse = await generateWithGroq(prompt, userMessage)
  if (groqResponse) {
    console.log('✅ Generated response using Groq')
    return groqResponse
  }

  // 3. Try Together AI
  console.log('🤖 Trying Together AI...')
  const togetherResponse = await generateWithTogether(prompt, userMessage)
  if (togetherResponse) {
    console.log('✅ Generated response using Together AI')
    return togetherResponse
  }

  // 4. Try local Ollama
  console.log('🤖 Trying Ollama...')
  const ollamaResponse = await generateWithOllama(prompt, userMessage)
  if (ollamaResponse) {
    console.log('✅ Generated response using local Ollama')
    return ollamaResponse
  }

  // 5. Use intelligent local analysis as fallback
  console.log('🧠 Using intelligent local analysis (analyzing user input)')
  return generateEnhancedLocalResponse(category, userMessage)
}

// Enhanced local responses that analyze user input and provide tailored advice
function generateEnhancedLocalResponse(category: string, userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Analyze user's specific question and provide tailored response
  const analysisResult = analyzeUserIntent(message, category)
  
  return generateTailoredResponse(analysisResult, userMessage, category)
}

// Analyze what the user is specifically asking about
function analyzeUserIntent(message: string, category: string) {
  const analysis = {
    topics: [] as string[],
    keywords: [] as string[],
    intent: 'general',
    specificity: 'low'
  }

  // Detect specific topics and keywords
  const topicMaps = {
    'story-development': {
      'plot': ['plot', 'story', 'narrative', 'structure', 'beginning', 'middle', 'end', 'climax'],
      'pacing': ['pacing', 'tempo', 'rhythm', 'flow', 'speed', 'slow', 'fast'],
      'conflict': ['conflict', 'tension', 'problem', 'obstacle', 'struggle', 'opposition'],
      'theme': ['theme', 'meaning', 'message', 'moral', 'deeper', 'symbolism'],
      'genre': ['fantasy', 'sci-fi', 'romance', 'mystery', 'horror', 'thriller', 'literary']
    },
    'character-development': {
      'personality': ['personality', 'traits', 'quirks', 'behavior', 'psychology'],
      'backstory': ['backstory', 'history', 'past', 'background', 'origin'],
      'motivation': ['motivation', 'goals', 'wants', 'needs', 'desires', 'drive'],
      'relationships': ['relationships', 'family', 'friends', 'romance', 'enemies'],
      'dialogue': ['dialogue', 'speech', 'voice', 'conversation', 'talking', 'speaking']
    },
    'plot-brainstorming': {
      'ideas': ['ideas', 'concepts', 'brainstorm', 'thinking', 'stuck', 'blank'],
      'twists': ['twist', 'surprise', 'unexpected', 'shock', 'reveal'],
      'scenes': ['scene', 'chapter', 'moment', 'event', 'sequence'],
      'endings': ['ending', 'conclusion', 'finale', 'resolution', 'finish']
    },
    'writing-style': {
      'prose': ['prose', 'writing', 'style', 'voice', 'tone', 'flow'],
      'description': ['description', 'imagery', 'sensory', 'details', 'vivid'],
      'dialogue': ['dialogue', 'conversation', 'speech', 'talking'],
      'grammar': ['grammar', 'punctuation', 'sentence', 'paragraph']
    }
  }

  const categoryTopics = topicMaps[category as keyof typeof topicMaps] || {}
  
  for (const [topic, keywords] of Object.entries(categoryTopics)) {
    const matches = keywords.filter(keyword => message.includes(keyword))
    if (matches.length > 0) {
      analysis.topics.push(topic)
      analysis.keywords.push(...matches)
    }
  }

  // Determine intent based on question words
  if (message.includes('how')) analysis.intent = 'howTo'
  else if (message.includes('what') || message.includes('which')) analysis.intent = 'definition'
  else if (message.includes('why')) analysis.intent = 'explanation'
  else if (message.includes('help') || message.includes('stuck')) analysis.intent = 'assistance'
  else if (message.includes('example') || message.includes('show')) analysis.intent = 'examples'

  // Determine specificity
  if (analysis.keywords.length > 3 || message.length > 50) analysis.specificity = 'high'
  else if (analysis.keywords.length > 1 || message.length > 20) analysis.specificity = 'medium'

  return analysis
}

// Generate a response tailored to the user's specific question
function generateTailoredResponse(analysis: { topics: string[]; intent: string; specificity: string; keywords: string[] }, userMessage: string, category: string): string {
  const { topics, intent, specificity, keywords } = analysis

  let response = ""

  // Start with a personalized acknowledgment
  if (specificity === 'high') {
    response += `Great question about ${topics.join(' and ') || 'your creative writing'}! `
  } else {
    response += `I'd love to help you with ${category.replace('-', ' ')}! `
  }

  // Provide tailored advice based on detected topics and intent
  if (intent === 'howTo') {
    response += generateHowToResponse(topics, keywords, category)
  } else if (intent === 'examples') {
    response += generateExampleResponse(topics, keywords, category)
  } else if (intent === 'assistance' || userMessage.toLowerCase().includes('stuck')) {
    response += generateAssistanceResponse(topics, keywords, category)
  } else {
    response += generateGeneralAdvice(topics, keywords, category)
  }

  // Add specific techniques based on detected topics
  if (topics.includes('plot')) {
    response += `\n\n**Plot Development Tips:**
- Consider the three-act structure: Setup → Confrontation → Resolution
- Each scene should either advance plot or develop character
- Build tension through escalating obstacles
- Give your protagonist both external and internal conflicts`
  }

  if (topics.includes('character') || category === 'character-development') {
    response += `\n\n**Character Development Techniques:**
- Give characters clear motivations and goals
- Create believable flaws alongside strengths
- Show character growth through actions, not just dialogue
- Develop unique voices for each character`
  }

  if (topics.includes('dialogue')) {
    response += `\n\n**Dialogue Tips:**
- Each character should have a distinct speaking style
- Use subtext - characters rarely say exactly what they mean
- Break up dialogue with action beats
- Read dialogue aloud to test if it sounds natural`
  }

  // Add follow-up questions to encourage deeper exploration
  response += generateFollowUpQuestions(topics, category, userMessage)

  return response
}

function generateHowToResponse(topics: string[], keywords: string[], category: string): string {
  if (topics.includes('plot')) {
    return `Here's how to develop a compelling plot:

1. **Start with your character's goal** - What does your protagonist desperately want?
2. **Create obstacles** - What prevents them from getting it?
3. **Escalate the stakes** - What happens if they fail?
4. **Plan key turning points** - When does everything change?
5. **Build to a climax** - How will the main conflict be resolved?`
  }

  if (topics.includes('character') || category === 'character-development') {
    return `Here's how to create compelling characters:

1. **Define their core motivation** - What drives them?
2. **Give them a fatal flaw** - What weakness will cause problems?
3. **Create a detailed backstory** - What shaped them?
4. **Establish their voice** - How do they speak and think?
5. **Plan their character arc** - How will they change?`
  }

  return `Here's a step-by-step approach to ${category.replace('-', ' ')}:

1. **Start with the basics** - Understand the fundamentals
2. **Practice specific techniques** - Focus on one skill at a time
3. **Study examples** - Read works in your genre
4. **Write regularly** - Consistency builds skill
5. **Seek feedback** - Get input from other writers`
}

function generateExampleResponse(topics: string[], keywords: string[], category: string): string {
  if (topics.includes('character')) {
    return `Here are some character examples:

**Complex Protagonist:** A detective who breaks rules to solve cases, but struggles with alcoholism and failed relationships. Their strength (determination) is also their weakness (obsession).

**Compelling Antagonist:** A corporate CEO who genuinely believes they're saving the world through technology, but their methods harm communities. They're not evil - they're convinced they're right.

**Supporting Character:** A wise mentor who appears helpful but secretly manipulates events for their own agenda, revealed only at the story's climax.`
  }

  if (topics.includes('plot')) {
    return `Here are some plot structure examples:

**Three-Act Structure:**
- Act I: Harry Potter learns he's a wizard (Setup)
- Act II: He faces challenges at Hogwarts and discovers Voldemort's plan (Confrontation)  
- Act III: Final confrontation and resolution (Resolution)

**Hero's Journey:**
- Ordinary World → Call to Adventure → Crossing the Threshold → Tests and Trials → Return Transformed`
  }

  return `Here are some practical examples for ${category.replace('-', ' ')}:

**Good:** Shows character emotion through action
**Better:** "Sarah's hands trembled as she reached for the letter"

**Good:** Describes the setting
**Better:** "The abandoned house groaned in the wind, its broken shutters flapping like wounded birds"`
}

function generateAssistanceResponse(_topics: string[], _keywords: string[], _category: string): string {
  return `I understand you're feeling stuck! This is completely normal for writers. Here are some strategies to break through:

**Quick Exercises:**
- Write for just 10 minutes without stopping
- Change your writing environment
- Interview your characters about their secrets
- Write the scene you're avoiding

**If you're stuck on plot:**
- Ask "What's the worst thing that could happen right now?"
- Consider what your character fears most, then make them face it
- Try writing the ending first, then work backward

**If you're stuck on characters:**
- Write a scene of them doing something mundane (grocery shopping, etc.)
- Create a dialogue between two characters who disagree
- Write their internal monologue during a stressful moment

What specifically are you stuck on? I can provide more targeted help!`
}

function generateGeneralAdvice(topics: string[], keywords: string[], category: string): string {
  const adviceMap = {
    'story-development': `Let's build your story foundation:

**Core Elements:**
- **Protagonist:** Who is your main character?
- **Goal:** What do they want more than anything?
- **Conflict:** What stands in their way?
- **Stakes:** What happens if they fail?

Start with these elements, and your plot will naturally emerge from your character's struggle to achieve their goal.`,

    'character-development': `Character creation is about building believable people:

**The Character Diamond:**
- **Want:** What they consciously desire
- **Need:** What they unconsciously require for growth  
- **Flaw:** The weakness that holds them back
- **Strength:** The quality that will eventually save them

Characters become compelling when their wants and needs conflict, forcing difficult choices.`,

    'plot-brainstorming': `Let's generate some plot ideas:

**Plot Spark Techniques:**
- **What If:** Start with "What if..." and explore possibilities
- **Conflict Escalation:** Small problem → bigger problem → impossible situation
- **Character Collision:** Put two opposing characters in the same space
- **Secret Reveal:** What hidden truth would change everything?

The best plots come from character motivation meeting external obstacles.`,

    'writing-style': `Let's refine your writing craft:

**Style Fundamentals:**
- **Show vs. Tell:** Demonstrate emotions through actions and dialogue
- **Sensory Details:** Engage all five senses in your descriptions
- **Varied Sentences:** Mix short, punchy sentences with longer, flowing ones
- **Active Voice:** Use strong, specific verbs

Your unique voice develops through consistent practice and conscious choice.`
  }

  return adviceMap[category as keyof typeof adviceMap] || adviceMap['story-development']
}

function generateFollowUpQuestions(topics: string[], category: string, _userMessage: string): string {
  const questions = []

  if (topics.includes('character') || category === 'character-development') {
    questions.push("What's your character's biggest fear?")
    questions.push("How do they handle conflict?")
  }

  if (topics.includes('plot') || category === 'story-development') {
    questions.push("What genre are you writing in?")
    questions.push("What's at stake if your protagonist fails?")
  }

  if (topics.includes('dialogue')) {
    questions.push("Do your characters have distinct speaking styles?")
  }

  if (questions.length === 0) {
    questions.push("What specific aspect would you like to explore further?")
    questions.push("What's the biggest challenge you're facing with this project?")
  }

  return `\n\n**Let's dig deeper:**
${questions.slice(0, 2).map(q => `- ${q}`).join('\n')}

Feel free to share more details about your project - the more specific you are, the better I can help!`
}
