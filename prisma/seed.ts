import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding QuizQuestion entries for Module 1 vocab quiz (Activity 1.1B)...')

  // Activity 1.1B questions - matching the QUIZ_QUESTIONS array in Activity11B.tsx
  const questions = [
    {
      moduleNumber: 1,
      activityKey: 'activity-1.1b',
      questionKey: 'q1',
      questionText: 'What does "Inflation" mean?',
      correctAnswer: 'A general increase in prices over time',
      conceptTags: ['basic_vocab', 'inflation', 'economics'],
    },
    {
      moduleNumber: 1,
      activityKey: 'activity-1.1b',
      questionKey: 'q2',
      questionText: 'What does "Debt" mean?',
      correctAnswer: 'Money that is owed to someone else',
      conceptTags: ['basic_vocab', 'debt', 'borrowing'],
    },
    {
      moduleNumber: 1,
      activityKey: 'activity-1.1b',
      questionKey: 'q3',
      questionText: 'What does "Interest" mean?',
      correctAnswer: 'Extra money paid for borrowing money',
      conceptTags: ['basic_vocab', 'interest', 'borrowing'],
    },
    {
      moduleNumber: 1,
      activityKey: 'activity-1.1b',
      questionKey: 'q4',
      questionText: 'What does "Profit" mean?',
      correctAnswer: 'Money left over after paying all expenses',
      conceptTags: ['basic_vocab', 'profit', 'business'],
    },
    {
      moduleNumber: 1,
      activityKey: 'activity-1.1b',
      questionKey: 'q5',
      questionText: 'What does "Stock" mean?',
      correctAnswer: 'A share of ownership in a company',
      conceptTags: ['basic_vocab', 'stock', 'investing'],
    },
  ]

  // Create or update questions
  for (const q of questions) {
    await prisma.quizQuestion.upsert({
      where: {
        activityKey_questionKey: {
          activityKey: q.activityKey,
          questionKey: q.questionKey,
        },
      },
      update: q,
      create: q,
    })
  }

  console.log(`✅ Seeded ${questions.length} questions for Module 1 vocab quiz`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

