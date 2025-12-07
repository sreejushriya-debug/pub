import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding QuizQuestion entries for all quiz activities...')

  const allQuestions = [
    // Module 1 - Activity 1.1B (Lightning Quiz)
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
    // Module 2 - Activity 2.1B (Lightning Quiz)
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q1',
      questionText: 'What does "Budget" mean?',
      correctAnswer: 'A plan for how you will use your money',
      conceptTags: ['budgeting', 'planning', 'money_management'],
    },
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q2',
      questionText: 'What does "Needs" mean?',
      correctAnswer: 'Things you must have to survive',
      conceptTags: ['needs_vs_wants', 'spending', 'priorities'],
    },
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q3',
      questionText: 'What does "Wants" mean?',
      correctAnswer: 'Things you would like but don\'t need to survive',
      conceptTags: ['needs_vs_wants', 'spending', 'priorities'],
    },
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q4',
      questionText: 'What does "Save" mean?',
      correctAnswer: 'To keep money for later instead of spending it',
      conceptTags: ['saving', 'money_management', 'future_planning'],
    },
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q5',
      questionText: 'What does "Income" mean?',
      correctAnswer: 'Money you receive from work or allowance',
      conceptTags: ['income', 'earning', 'money_flow'],
    },
    {
      moduleNumber: 2,
      activityKey: 'activity-2.1b',
      questionKey: 'q6',
      questionText: 'What does "Charity" mean?',
      correctAnswer: 'Giving money or help to people in need',
      conceptTags: ['charity', 'giving', 'social_responsibility'],
    },
    // Module 3 - Activity 3.4A (Stock Chart Reading)
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q1',
      questionText: 'What does this graph show?',
      correctAnswer: 'Stock price over 10 days',
      conceptTags: ['investing', 'stocks', 'data_reading'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q2',
      questionText: 'What is the highest price?',
      correctAnswer: '$11',
      conceptTags: ['investing', 'stocks', 'data_analysis'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q3',
      questionText: 'What is the lowest price?',
      correctAnswer: '$2',
      conceptTags: ['investing', 'stocks', 'data_analysis'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q4',
      questionText: 'On which day was the price highest?',
      correctAnswer: 'Day 5',
      conceptTags: ['investing', 'stocks', 'data_analysis'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q5',
      questionText: 'Did the price go UP or DOWN from Day 5 to Day 6?',
      correctAnswer: 'Down',
      conceptTags: ['investing', 'stocks', 'trends'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q6',
      questionText: 'What was the price on Day 1?',
      correctAnswer: '$5',
      conceptTags: ['investing', 'stocks', 'data_reading'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q7',
      questionText: 'What was the price on Day 10?',
      correctAnswer: '$6',
      conceptTags: ['investing', 'stocks', 'data_reading'],
    },
    {
      moduleNumber: 3,
      activityKey: 'activity-3.4a',
      questionKey: 'q8',
      questionText: 'Overall, is this stock doing well?',
      correctAnswer: 'Yes, it ended higher than it started',
      conceptTags: ['investing', 'stocks', 'evaluation'],
    },
    // Module 6 - Activity 6.1A (Timed Matching Rounds)
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q1',
      questionText: 'Money you owe that you haven\'t paid back yet',
      correctAnswer: 'debt',
      conceptTags: ['vocab_review', 'debt', 'borrowing'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q2',
      questionText: 'Money you earn from selling products or services',
      correctAnswer: 'revenue',
      conceptTags: ['vocab_review', 'revenue', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q3',
      questionText: 'A plan for how you\'ll spend and save your money',
      correctAnswer: 'budget',
      conceptTags: ['vocab_review', 'budget', 'planning'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q4',
      questionText: 'Money you make after subtracting expenses from revenue',
      correctAnswer: 'profit',
      conceptTags: ['vocab_review', 'profit', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q5',
      questionText: 'Money you set aside for future use',
      correctAnswer: 'savings',
      conceptTags: ['vocab_review', 'savings', 'money_management'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q6',
      questionText: 'Things a business owns that have value',
      correctAnswer: 'assets',
      conceptTags: ['vocab_review', 'assets', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q7',
      questionText: 'Things a business owes to others',
      correctAnswer: 'liability',
      conceptTags: ['vocab_review', 'liability', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q8',
      questionText: 'The extra money you pay when borrowing',
      correctAnswer: 'interest',
      conceptTags: ['vocab_review', 'interest', 'borrowing'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q9',
      questionText: 'The original amount of money borrowed',
      correctAnswer: 'principal',
      conceptTags: ['vocab_review', 'principal', 'borrowing'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q10',
      questionText: 'A tax added to the price of goods you buy',
      correctAnswer: 'sales tax',
      conceptTags: ['vocab_review', 'tax', 'shopping'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q11',
      questionText: 'A reduction in the original price',
      correctAnswer: 'discount',
      conceptTags: ['vocab_review', 'discount', 'shopping'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.1a',
      questionKey: 'q12',
      questionText: 'Money you receive regularly, like from a job',
      correctAnswer: 'income',
      conceptTags: ['vocab_review', 'income', 'earning'],
    },
    // Module 6 - Activity 6.5A (Final Challenge Quiz)
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q1',
      questionText: 'What is the extra money you pay when borrowing?',
      correctAnswer: 'interest',
      conceptTags: ['final_quiz', 'interest', 'borrowing'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q2',
      questionText: 'Money you make after subtracting expenses from revenue is called?',
      correctAnswer: 'profit',
      conceptTags: ['final_quiz', 'profit', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q3',
      questionText: 'Things a business owns that have value are called?',
      correctAnswer: 'assets',
      conceptTags: ['final_quiz', 'assets', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q4',
      questionText: 'If you have 3 quarters, 2 dimes, and 1 nickel, how much money do you have?',
      correctAnswer: '1.00',
      conceptTags: ['final_quiz', 'coins', 'money_calculation'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q5',
      questionText: 'How many pennies equal one dollar?',
      correctAnswer: '100',
      conceptTags: ['final_quiz', 'coins', 'money_basics'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q6',
      questionText: 'You have $100. You spend $35 on needs and $20 on wants. How much is left?',
      correctAnswer: '45',
      conceptTags: ['final_quiz', 'budgeting', 'calculation'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q7',
      questionText: 'A budget is a plan for how you\'ll:',
      correctAnswer: 'spend and save your money',
      conceptTags: ['final_quiz', 'budgeting', 'planning'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q8',
      questionText: 'If revenue is $500 and expenses are $300, what is the profit?',
      correctAnswer: '200',
      conceptTags: ['final_quiz', 'business', 'profit_calculation'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q9',
      questionText: 'If you spent $50 and earned $80, did you make a profit or loss?',
      correctAnswer: 'profit',
      conceptTags: ['final_quiz', 'business', 'profit_loss'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q10',
      questionText: 'Which uses your own money from your bank account?',
      correctAnswer: 'debit',
      conceptTags: ['final_quiz', 'credit_debit', 'banking'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q11',
      questionText: 'Credit cards charge interest if you:',
      correctAnswer: 'don\'t pay back the full amount',
      conceptTags: ['final_quiz', 'credit', 'interest'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q12',
      questionText: 'An item costs $20. Tax is 6.25%. What is the tax amount?',
      correctAnswer: '1.25',
      conceptTags: ['final_quiz', 'tax', 'calculation'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q13',
      questionText: 'An item is $40 with 20% off. What is the sale price?',
      correctAnswer: '32',
      conceptTags: ['final_quiz', 'discount', 'calculation'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q14',
      questionText: 'Which expense type stays the same each month?',
      correctAnswer: 'Fixed',
      conceptTags: ['final_quiz', 'expenses', 'business'],
    },
    {
      moduleNumber: 6,
      activityKey: 'activity-6.5a',
      questionKey: 'q15',
      questionText: 'Groceries are an example of which expense type?',
      correctAnswer: 'Variable',
      conceptTags: ['final_quiz', 'expenses', 'business'],
    },
  ]

  // Create or update all questions
  let created = 0
  for (const q of allQuestions) {
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
    created++
  }

  console.log(`✅ Seeded ${created} questions across all quiz activities`)
  console.log(`   - Module 1 (Activity 1.1B): 5 questions`)
  console.log(`   - Module 2 (Activity 2.1B): 6 questions`)
  console.log(`   - Module 3 (Activity 3.4A): 8 questions`)
  console.log(`   - Module 6 (Activity 6.1A): 12 questions`)
  console.log(`   - Module 6 (Activity 6.5A): 15 questions`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
