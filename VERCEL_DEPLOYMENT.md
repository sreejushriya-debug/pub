# Vercel Deployment - Environment Variables Setup

## Add OpenAI API Key to Vercel

To make the AI tutor work on your live website (not just localhost), you need to add the OpenAI API key to Vercel:

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Select Your Project**
   - Click on your "project-bright-beginnings" (or whatever you named it)

3. **Go to Settings**
   - Click the "Settings" tab at the top

4. **Click "Environment Variables"**
   - In the left sidebar, click "Environment Variables"

5. **Add the OpenAI API Key**
   - Click "Add New" or the "+" button
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Copy this from your `.env.local` file (it starts with `sk-proj-...`)
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click "Save"

6. **Redeploy Your Site**
   - After adding the environment variable, Vercel will automatically trigger a new deployment
   - OR you can manually redeploy:
     - Go to "Deployments" tab
     - Click the "..." menu on the latest deployment
     - Click "Redeploy"

### Also Add Database URL (if you haven't already)

If you're using a database for quiz tracking, also add:
- **Key**: `DATABASE_URL`
- **Value**: Your PostgreSQL connection string
- **Environment**: All three (Production, Preview, Development)

### Verify It's Working

After redeployment:
1. Visit your live website
2. Take the Module 1 vocab quiz
3. Miss some questions
4. Click "Get help on what I missed"
5. The AI tutor should work!

## Security Note

✅ Your API key is secure:
- It's stored in Vercel's encrypted environment variables
- It's not visible in your code or GitHub
- Only accessible to your Vercel project


