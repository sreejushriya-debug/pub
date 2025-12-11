# AI Tutor Setup Guide

## Step 1: Get Your OpenAI API Key

1. **Go to OpenAI's website**: https://platform.openai.com/api-keys
2. **Sign in** (or create an account if you don't have one)
3. **Click "Create new secret key"**
4. **Name it** (e.g., "Bright Beginnings Tutor")
5. **Copy the key** - it will look like: `sk-proj-...` (starts with `sk-`)
   - ⚠️ **Important**: Copy it immediately! You won't be able to see it again.

## Step 2: Add API Key to Your Project

1. **Create a `.env.local` file** in your project root (if it doesn't exist)
2. **Add your OpenAI API key**:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. **Make sure `.env.local` is in `.gitignore`** (it should be already)

## Step 3: Restart Your Dev Server

After adding the API key, restart your Next.js dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test the AI Tutor

1. Go to Module 1, Activity 1.1B (Lightning Quiz)
2. Take the quiz and miss some questions
3. Click "Get help on what I missed"
4. You should see the AI tutor response!

## Troubleshooting

**Error: "OpenAI API key not configured"**
- Make sure `.env.local` exists in the project root
- Make sure the key starts with `sk-`
- Make sure you restarted the dev server after adding it

**Error: "Questions not found in database"**
- Run: `npm run db:seed` to seed the quiz questions

**Error: "Failed to get tutor response from AI"**
- Check your OpenAI account has credits/billing set up
- Verify the API key is correct
- Check server logs for detailed error messages

## Cost Note

OpenAI charges per API call. The `gpt-4o-mini` model is very affordable:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

Each tutor response is typically a few hundred tokens, so it's very cheap (fractions of a cent per response).


