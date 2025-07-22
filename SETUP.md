# Artemis Setup Guide 🚀

## Quick Demo Setup

To quickly test Artemis without full setup, you can run it with mock data:

### 1. Environment Variables (Minimal)
Create `.env.local` with at least:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=any_random_string_32_chars_long
NEXTAUTH_URL=http://localhost:3000
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see Artemis in action!

## Full Production Setup

### Step 1: Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (1-2 minutes)
3. Go to Settings > API to get your keys:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Database Schema
1. In Supabase, go to SQL Editor
2. Create a new query
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Run the query

### Step 3: OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information (GPT-4 requires a paid account)

### Step 4: Environment Variables
Update your `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Auth
NEXTAUTH_SECRET=your-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
```

### Step 5: Test Everything
```bash
npm run dev
```

## Deployment to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
```

### Option 2: Vercel Dashboard
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Settings
4. Deploy

### Environment Variables for Vercel
Add these in your Vercel dashboard (Settings > Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NEXTAUTH_SECRET` | Random 32-character string |
| `NEXTAUTH_URL` | Your production URL (e.g., https://artemis.vercel.app) |

## Testing Features

### 1. Welcome Screen
- Should see 4 specialized writing categories
- Dark theme with smooth animations
- Click any category to start chatting

### 2. Chat Interface
- AI responds with writing-focused advice
- Suggested prompts appear for new conversations
- Copy functionality for messages
- Smooth animations and transitions

### 3. Categories to Test
1. **Story Development**: "Help me structure a mystery novel"
2. **Character Creation**: "I need a complex villain for my fantasy story"
3. **Plot Brainstorming**: "Give me some plot twist ideas"
4. **Writing Style**: "How can I improve my dialogue?"

## Troubleshooting

### Common Issues

**1. OpenAI API Errors**
- Check if your API key is valid
- Ensure you have billing set up
- Verify you have GPT-4 access

**2. Supabase Connection Issues**
- Verify your project URL and keys
- Check if RLS policies are enabled
- Ensure database schema is created

**3. Build Errors**
- Run `npm run type-check` to find TypeScript errors
- Check `npm run lint` for linting issues

**4. Environment Variables**
- Make sure `.env.local` is in the root directory
- Restart dev server after changing env vars
- Don't commit `.env.local` to git

### Getting Help
- Check the console for error messages
- Verify all environment variables are set
- Test API endpoints individually
- Check Supabase and Vercel logs

## Customization Tips

### Adding New Categories
1. Update `categories` array in `WelcomeScreen.tsx`
2. Add prompts in `ChatInterface.tsx`
3. Add system prompt in `src/lib/openai.ts`

### Styling Changes
- Modify CSS variables in `src/app/globals.css`
- Update Tailwind classes in components
- Use Framer Motion for animations

### AI Behavior
- Edit system prompts in `src/lib/openai.ts`
- Adjust temperature and other parameters in API route
- Test different prompt strategies

Happy writing! ✍️
