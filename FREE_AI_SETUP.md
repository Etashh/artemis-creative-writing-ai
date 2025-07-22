# Free AI Alternatives Setup Guide

Your creative writing chatbot can now use multiple **completely free** AI providers! Here's how to set them up:

## 🎯 Quick Start (No Setup Required)

Your app works immediately with **enhanced local responses** - no API keys needed! Just run:

```bash
npm run dev
```

The app will provide intelligent creative writing advice using sophisticated local responses.

## 🚀 Free AI Upgrades (Optional)

For even better AI responses, you can add free API keys:

### 1. Groq (Recommended - Very Fast & Free)

Groq offers **free API access** with very fast inference:

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create a new API key
4. Add to your `.env.local`:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

**Free Tier:**
- 6,000 requests per minute
- Very fast response times
- High-quality Llama models

### 2. Together AI (Good Free Tier)

1. Visit [api.together.xyz](https://api.together.xyz)
2. Sign up for free
3. Get your API key
4. Add to your `.env.local`:
   ```bash
   TOGETHER_API_KEY=your_together_api_key_here
   ```

**Free Tier:**
- $25 free credits monthly
- Access to Llama 2 and other open models

### 3. Hugging Face (Completely Free)

1. Go to [huggingface.co](https://huggingface.co)
2. Create a free account
3. Generate a User Access Token
4. Add to your `.env.local`:
   ```bash
   HUGGINGFACE_API_KEY=your_hf_token_here
   ```

**Free Tier:**
- Unlimited usage on many models
- Some models require no API key at all

### 4. Ollama (Run AI Locally - Free Forever)

Install Ollama to run AI models on your own computer:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a creative writing model
ollama pull llama3.2:3b

# Start Ollama (runs on localhost:11434)
ollama serve
```

No API key needed - runs completely offline!

## 🔧 How It Works

The app tries AI providers in this order:

1. **Groq** (if API key available) - Fastest
2. **Together AI** (if API key available) - Good quality
3. **Ollama** (if running locally) - Completely private
4. **Hugging Face** (if API key available) - Free models
5. **Enhanced Local Responses** - Always works as fallback

## 🎨 Customizing AI Behavior

Edit `/src/lib/free-ai-alternatives.ts` to:

- Adjust creative writing prompts for each category
- Add new response categories
- Modify AI model parameters (temperature, max tokens)
- Add additional free AI providers

## 📊 Comparison of Free Options

| Provider | Setup Difficulty | Response Quality | Speed | Monthly Limit |
|----------|------------------|------------------|-------|---------------|
| **Enhanced Local** | None | Good | Instant | Unlimited |
| **Groq** | Easy | Excellent | Very Fast | 6K req/min |
| **Together AI** | Easy | Good | Fast | $25 credits |
| **Hugging Face** | Easy | Good | Medium | Unlimited* |
| **Ollama** | Medium | Good | Fast | Unlimited |

*Some models unlimited, others have rate limits

## 🛠️ Troubleshooting

### API Key Issues
```bash
# Check if your API keys are loaded
echo $GROQ_API_KEY
echo $TOGETHER_API_KEY
echo $HUGGINGFACE_API_KEY
```

### Ollama Not Working
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve
```

### App Falls Back to Local Responses
This is normal! The app always works, even without API keys. Local responses are sophisticated and helpful for creative writing.

## 🎯 Recommended Setup

For the best experience with zero cost:

1. **Start with local responses** (works immediately)
2. **Add Groq API key** (best free performance)
3. **Install Ollama** (for private, offline usage)

This gives you three tiers of AI assistance, all completely free!

## 🔒 Privacy & Security

- **Local responses**: No data sent anywhere
- **Ollama**: Runs entirely on your computer
- **API providers**: Data sent to provider but not stored permanently
- **No tracking**: Your creative writing stays private

## 💡 Tips for Creative Writers

1. **Start broad, get specific**: Begin with general story ideas, then drill down
2. **Mix AI with your creativity**: Use AI for brainstorming, not final writing
3. **Try different providers**: Each has unique "personalities" for creative advice
4. **Use conversation history**: The AI remembers context within each session
5. **Experiment with categories**: Each category specializes in different aspects

Happy writing! 🖋️✨
