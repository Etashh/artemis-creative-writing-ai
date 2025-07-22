# Model Configuration Guide

## Current Setup: GPT-3.5-turbo

Artemis is currently configured to use **GPT-3.5-turbo**, which is:
- ✅ Available on free OpenAI accounts (with usage limits)
- ✅ Fast and efficient
- ✅ Great for creative writing tasks
- ✅ Cost-effective

## Model Comparison

| Feature | GPT-3.5-turbo | GPT-4 |
|---------|---------------|-------|
| **Account Type** | Free + Paid | Paid only |
| **Speed** | Fast | Slower |
| **Cost** | Lower | Higher |
| **Creativity** | Good | Excellent |
| **Context Length** | 4,096 tokens | 8,192+ tokens |
| **Writing Quality** | Very good | Exceptional |

## Upgrading to GPT-4 (Optional)

If you want to upgrade to GPT-4 later:

1. **Add billing to your OpenAI account**
2. **Change the model in the API:**
   ```typescript
   // In src/app/api/chat/route.ts
   model: 'gpt-4'  // or 'gpt-4-turbo-preview'
   ```
3. **Increase max_tokens if needed:**
   ```typescript
   max_tokens: 1200  // GPT-4 can handle more
   ```

## Fine-tuning for Creative Writing

Current optimizations for creative writing:
- **Temperature: 0.8** - High creativity
- **Presence penalty: 0.6** - Encourages diverse responses
- **Frequency penalty: 0.3** - Reduces repetition
- **Max tokens: 800** - Good balance for detailed responses

## Cost Considerations

**GPT-3.5-turbo rates (as of 2025):**
- Input: ~$0.50 per 1M tokens
- Output: ~$1.50 per 1M tokens

**Typical usage:**
- A conversation with 10 exchanges ≈ 2,000-4,000 tokens
- Cost per conversation ≈ $0.002-$0.006

**Free tier includes:**
- $5 in free credits for new accounts
- Rate limits apply (requests per minute)

Your current setup should work perfectly for testing and moderate usage!
