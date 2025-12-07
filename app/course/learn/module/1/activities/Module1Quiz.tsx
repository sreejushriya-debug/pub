'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module1QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Needs vs Wants
  {
    id: 'm1q1',
    type: 'mcq',
    questionText: 'Emma really wants a new video game, but she also needs new shoes for school because her old ones have holes. Which should she buy first?',
    options: ['The video game', 'The new shoes', 'Both at the same time', 'Neither'],
    correctAnswer: 'The new shoes',
    conceptTags: ['needs_vs_wants'],
    explanation: 'Needs come before wants! Shoes for school are a need because you have to wear them. Video games are wants—fun but not essential.'
  },
  {
    id: 'm1q2',
    type: 'select_all',
    questionText: 'Which of these are NEEDS? (Select all that apply)',
    options: ['Food for dinner', 'A new toy', 'Winter coat when it\'s cold', 'Candy from the store', 'Medicine when you\'re sick'],
    correctAnswers: ['Food for dinner', 'Winter coat when it\'s cold', 'Medicine when you\'re sick'],
    conceptTags: ['needs_vs_wants'],
    explanation: 'Needs are things you must have to survive and stay healthy: food, clothing for weather, and medicine. Toys and candy are wants—nice to have but not necessary.'
  },
  
  // Basic Vocabulary
  {
    id: 'm1q3',
    type: 'mcq',
    questionText: 'What is "income"?',
    options: [
      'Money you spend at the store',
      'Money you earn or receive',
      'Money you owe to someone',
      'Money you save in a piggy bank'
    ],
    correctAnswer: 'Money you earn or receive',
    conceptTags: ['basic_vocab', 'income'],
    explanation: 'Income is money that comes IN to you—from a job, allowance, gifts, or other sources.'
  },
  {
    id: 'm1q4',
    type: 'mcq',
    questionText: 'A "budget" is best described as:',
    options: [
      'A type of bank account',
      'A plan for how you will spend and save your money',
      'Money you borrow from a friend',
      'The total amount of money you have'
    ],
    correctAnswer: 'A plan for how you will spend and save your money',
    conceptTags: ['basic_vocab', 'budget'],
    explanation: 'A budget is like a roadmap for your money—it helps you decide how much to spend, save, and give.'
  },
  {
    id: 'm1q5',
    type: 'mcq',
    questionText: 'When you borrow money and have to pay it back later, that\'s called:',
    options: ['Savings', 'Income', 'Debt', 'Profit'],
    correctAnswer: 'Debt',
    conceptTags: ['basic_vocab', 'debt'],
    explanation: 'Debt is money you owe. If you borrow $5 from a friend, you\'re in debt until you pay it back!'
  },
  
  // Coins
  {
    id: 'm1q6',
    type: 'numeric',
    questionText: 'You have: 2 quarters, 1 dime, and 3 pennies. How many cents is that in total?',
    correctAnswer: 63,
    unit: 'cents',
    tolerance: 0,
    conceptTags: ['coins', 'counting_money'],
    explanation: '2 quarters = 50¢, 1 dime = 10¢, 3 pennies = 3¢. Total: 50 + 10 + 3 = 63 cents!'
  },
  {
    id: 'm1q7',
    type: 'numeric',
    questionText: 'You have: 1 quarter, 2 dimes, and 1 nickel. How many cents is that?',
    correctAnswer: 50,
    unit: 'cents',
    tolerance: 0,
    conceptTags: ['coins', 'counting_money'],
    explanation: '1 quarter = 25¢, 2 dimes = 20¢, 1 nickel = 5¢. Total: 25 + 20 + 5 = 50 cents!'
  },
  
  // Simple scenarios
  {
    id: 'm1q8',
    type: 'numeric',
    questionText: 'You get $10 allowance. You spend $3 on a snack and save the rest. How much did you save?',
    correctAnswer: 7,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['simple_math', 'saving'],
    explanation: '$10 - $3 = $7 saved! Great job putting money aside.'
  },
  {
    id: 'm1q9',
    type: 'mcq',
    questionText: 'Jake has $15. He wants to buy a book for $8 and a toy for $10. What should Jake do?',
    options: [
      'Buy both items',
      'Buy only the book since he can\'t afford both',
      'Borrow money to buy both',
      'Buy only the toy'
    ],
    correctAnswer: 'Buy only the book since he can\'t afford both',
    conceptTags: ['simple_math', 'spending_decisions'],
    explanation: '$8 + $10 = $18, but Jake only has $15. He can afford the $8 book but not both. It\'s smart to only spend what you have!'
  },
  {
    id: 'm1q10',
    type: 'mcq',
    questionText: '"Interest" is:',
    options: [
      'The price of something at the store',
      'Extra money paid for borrowing money, or earned on savings',
      'Money you give to charity',
      'The same as profit'
    ],
    correctAnswer: 'Extra money paid for borrowing money, or earned on savings',
    conceptTags: ['basic_vocab', 'interest'],
    explanation: 'Interest works both ways! Banks pay YOU interest on savings. But if you borrow money, YOU pay interest to the lender.'
  },
]

export default function Module1Quiz({ onComplete }: Module1QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={1}
      quizTitle="Module 1 Quiz: Money Basics"
      quizDescription="Test your knowledge of needs vs wants, money vocabulary, and counting coins!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module1_quiz_score: data.score,
        module1_quiz_total: data.total,
        module1_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module1_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

