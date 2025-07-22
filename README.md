# Artemis - Creative Writing Assistant AI 🖋️

A specialized AI chatbot designed exclusively for creative writers. Unlike generic AI assistants, Artemis focuses on story development, character creation, plot brainstorming, and writing style improvement.

![Artemis Creative Writing Assistant](https://your-image-url-here.com/screenshot.png)

## ✨ Features

### Specialized Writing Categories
- **Story Development**: Plot structure, pacing, conflict development
- **Character Creation**: Character backgrounds, personality development, character arcs  
- **Plot Brainstorming**: Plot twists, scene ideas, story premises
- **Writing Style**: Dialogue improvement, show vs tell, voice development

### Key Highlights
- 🎯 **Specialized**: Built specifically for creative writing, not general problem-solving
- 🌙 **Dark Theme**: Beautiful, modern UI optimized for long writing sessions
- 🚀 **AI-Powered**: Multiple free AI providers (Groq, Together AI, Hugging Face, Ollama) with enhanced local fallback
- 💾 **Persistent**: Supabase backend for conversation history and user data
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Multiple free providers (Groq, Together AI, Hugging Face, Ollama) + enhanced local responses
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- AI provider API keys (optional - see [FREE_AI_SETUP.md](./FREE_AI_SETUP.md))
  - **Groq** (recommended - excellent free tier)
  - **Together AI** (good free tier)
  - **Hugging Face** (completely free models)
  - **Ollama** (run locally, completely free)
  - **Note**: App works immediately with enhanced local responses, no API keys required!
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/artemis-creative-writing-ai.git
   cd artemis-creative-writing-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # AI Providers (Optional - choose one or more for enhanced responses)
   GROQ_API_KEY=your_groq_api_key          # Recommended - fast & free
   TOGETHER_API_KEY=your_together_api_key  # Good free tier  
   HUGGINGFACE_API_KEY=your_hf_token       # Free models available
   
   # Note: App works immediately without API keys using enhanced local responses
   ```
   NEXTAUTH_SECRET=your_random_secret_string
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   ```bash
   # Run the migration in your Supabase SQL editor
   # Copy and paste the content from supabase/migrations/001_initial_schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Setup

### Supabase Configuration

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migration**
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy the content from `supabase/migrations/001_initial_schema.sql`
   - Run the migration

3. **Configure Authentication** (optional)
   - Enable email authentication in Supabase Auth settings
   - Configure OAuth providers if needed

### Database Schema

The database includes tables for:
- **Users**: User profiles and writing preferences
- **Conversations**: Chat sessions organized by category
- **Messages**: Individual chat messages with metadata
- **Writing Projects**: User's writing projects and progress

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel
   ```

2. **Configure environment variables in Vercel**
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the environment variables from your `.env.local`

3. **Configure custom domain** (optional)
   - Add your custom domain in Vercel dashboard
   - Update `NEXTAUTH_URL` to your production URL

### Environment Variables for Production

Set these in your Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEXTAUTH_SECRET` | Random string for NextAuth |
| `NEXTAUTH_URL` | Your production URL |

## 🎨 Customization

### Themes
The app uses a custom dark theme defined in `src/app/globals.css`. You can customize colors by modifying the CSS custom properties.

### AI Prompts
Modify the AI behavior by editing the prompts in `src/lib/openai.ts`. Each category has its own specialized prompt.

### Categories
Add new writing categories by:
1. Adding to the `categories` array in `WelcomeScreen.tsx`
2. Adding prompts in `ChatInterface.tsx`
3. Adding system prompts in `src/lib/openai.ts`

## 📁 Project Structure

```
artemis/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Chat API endpoint
│   │   ├── globals.css            # Global styles and theme
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ChatInterface.tsx      # Main chat interface
│   │   └── WelcomeScreen.tsx      # Landing page
│   ├── lib/
│   │   ├── openai.ts              # OpenAI configuration
│   │   └── supabase.ts            # Supabase client
│   └── types/
│       └── database.ts            # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── .env.example                   # Environment variables template
└── vercel.json                    # Vercel deployment config
```

## 🔧 API Reference

### Chat Endpoint
`POST /api/chat`

**Request Body:**
```json
{
  "message": "Help me develop a fantasy character",
  "category": "character-creation",
  "messages": [] // Previous conversation context
}
```

**Response:**
```json
{
  "response": "I'd love to help you create a fantasy character! Let's start with..."
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Backend by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For support, email support@artemis-ai.com or join our Discord community.

---

Made with ❤️ for creative writers everywhere.
