# Quiz Result Tracking Setup Guide

This guide explains how to set up quiz result tracking for the Module 1 vocab quiz (Activity 1.1B).

## Step 1: Install Dependencies

Run these commands in your terminal:

```bash
npm install prisma @prisma/client
npm install -D tsx
```

## Step 2: Set Up Database

1. **Create a PostgreSQL database** (you can use Vercel Postgres, Supabase, or any PostgreSQL provider)

2. **Add your database URL to `.env.local`**:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

3. **Initialize Prisma and push the schema**:

```bash
npx prisma generate
npx prisma db push
```

This will create the `User`, `QuizQuestion`, and `UserQuestionResult` tables in your database.

## Step 3: Seed Quiz Questions

Run the seed script to create the QuizQuestion entries for Module 1 vocab quiz:

```bash
npm run db:seed
```

This creates 5 questions (q1 through q5) matching the questions in Activity11B.tsx.

## Step 4: Verify Setup

You can use Prisma Studio to view your database:

```bash
npm run db:studio
```

This opens a GUI where you can see:
- `User` table (will be populated when users take quizzes)
- `QuizQuestion` table (should have 5 entries for activity-1.1b)
- `UserQuestionResult` table (will be populated as students take the quiz)

## Step 5: Test the Quiz

1. **Start your dev server**:
```bash
npm run dev
```

2. **Navigate to Module 1, Activity 1.1B** (Lightning Quiz)

3. **Take the quiz** - answer all 5 questions

4. **Check the database** - After completing the quiz, you should see:
   - A new `User` entry (if it's the first time for that user)
   - 5 new `UserQuestionResult` entries (one for each question)

## How It Works

### Frontend (Activity11B.tsx)
- Tracks attempts per question
- Stores results in state as you answer
- Submits all results to `/api/quiz/submit` when quiz completes

### API Route (`/app/api/quiz/submit/route.ts`)
- Authenticates the user via Clerk
- Creates/updates User record
- Creates UserQuestionResult records for each question
- Returns grading summary

### Database Schema

**QuizQuestion**: Stores all quiz questions
- `id`: Unique identifier
- `moduleNumber`: Module number (1, 2, 3, etc.)
- `activityKey`: Activity identifier (e.g., "activity-1.1b")
- `questionKey`: Question identifier within activity (e.g., "q1", "q2")
- `questionText`: The question prompt
- `correctAnswer`: The correct answer
- `conceptTags`: Array of tags like ["basic_vocab", "inflation"]

**UserQuestionResult**: Tracks individual question attempts
- `id`: Unique identifier
- `userId`: Clerk user ID
- `questionId`: Reference to QuizQuestion
- `isCorrect`: Whether the answer was correct
- `attempts`: Number of attempts before getting it correct
- `submittedAnswer`: What the user submitted
- `createdAt`: Timestamp

## Viewing Results

### Using Prisma Studio
```bash
npm run db:studio
```

### Using SQL
```sql
-- See all quiz results for a user
SELECT 
  uqr.*,
  qq.questionText,
  qq.correctAnswer,
  qq.conceptTags
FROM "UserQuestionResult" uqr
JOIN "QuizQuestion" qq ON uqr."questionId" = qq.id
WHERE uqr."userId" = 'user_clerk_id_here'
ORDER BY uqr."createdAt" DESC;
```

## Next Steps

Once this is working for Module 1, you can:
1. Add more QuizQuestion entries for other activities
2. Generalize the API route to handle any activity
3. Add AI tutor integration using the conceptTags and attempt data

## Troubleshooting

**"Prisma Client not found"**
- Run `npx prisma generate`

**"Database connection error"**
- Check your `DATABASE_URL` in `.env.local`
- Ensure your database is accessible

**"Unauthorized" error when submitting**
- Make sure you're logged in via Clerk
- Check that Clerk middleware is properly configured

**No results appearing in database**
- Check browser console for API errors
- Verify the API route is accessible at `/api/quiz/submit`
- Check that questions were seeded (run `npm run db:seed` again)

