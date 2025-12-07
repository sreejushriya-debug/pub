'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module2QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Save vs Spend Decisions
  {
    id: 'm2q1',
    type: 'mcq',
    questionText: 'Maya wants to buy a skateboard that costs $50. She has $30 saved. Her friend invites her to spend $15 on a movie today. What should Maya do?',
    options: [
      'Go to the movie and use her savings',
      'Skip the movie and keep saving for the skateboard',
      'Borrow money from her parents for both',
      'Buy something else instead'
    ],
    correctAnswer: 'Skip the movie and keep saving for the skateboard',
    conceptTags: ['saving_vs_spending', 'goals'],
    explanation: 'Maya has a bigger goal (skateboard). If she spends $15 on the movie, she\'ll only have $15 left—further from her goal. Saving now means reaching her goal sooner!'
  },
  {
    id: 'm2q2',
    type: 'mcq',
    questionText: 'Leo gets $20 for his birthday. He doesn\'t really need anything right now. What\'s the BEST choice?',
    options: [
      'Spend it all on candy',
      'Save most of it for something he might want later',
      'Give it all away',
      'Lose it'
    ],
    correctAnswer: 'Save most of it for something he might want later',
    conceptTags: ['saving_vs_spending', 'smart_choices'],
    explanation: 'When you don\'t need anything, saving is smart! Your money grows and you\'ll have it for something special later.'
  },
  
  // Budget Reading
  {
    id: 'm2q3',
    type: 'numeric',
    questionText: 'Sam\'s monthly budget: Income = $100. Spending: Food $30, Fun $25, Clothes $20, Savings $15. How much is LEFT OVER after all spending and saving?',
    correctAnswer: 10,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['budgeting', 'budget_math'],
    explanation: 'Total planned: $30 + $25 + $20 + $15 = $90. Left over: $100 - $90 = $10. That\'s extra money Sam can save or use!'
  },
  {
    id: 'm2q4',
    type: 'mcq',
    questionText: 'Which budget is MORE REALISTIC for someone earning $50/month?',
    options: [
      'Spend $60 on fun, $10 on savings',
      'Spend $30 on needs, $10 on wants, $10 on savings',
      'Spend $50 on wants, $0 on savings',
      'Save $100, spend $0'
    ],
    correctAnswer: 'Spend $30 on needs, $10 on wants, $10 on savings',
    conceptTags: ['budgeting', 'realistic_budget'],
    explanation: 'A realistic budget doesn\'t spend more than you earn! Option B totals $50, matches income, and includes needs, wants, AND savings.'
  },
  {
    id: 'm2q5',
    type: 'numeric',
    questionText: 'Ava earns $80/month. Her budget: Needs $40, Wants $30, Savings $20. Is she over or under budget, and by how much? (Enter negative if over, positive if under)',
    correctAnswer: -10,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['budgeting', 'budget_math'],
    explanation: 'Total planned: $40 + $30 + $20 = $90. But Ava only earns $80! She\'s $10 OVER budget. She needs to cut $10 from somewhere.'
  },

  // Save vs Spend Scenarios
  {
    id: 'm2q6',
    type: 'mcq',
    questionText: 'Your favorite toy is on sale for 50% off TODAY ONLY. But you\'re saving for a bike. You have exactly enough for the toy. Should you:',
    options: [
      'Buy the toy because sales don\'t last',
      'Keep saving for the bike—your bigger goal',
      'Buy the toy and forget about the bike',
      'Borrow money to buy both'
    ],
    correctAnswer: 'Keep saving for the bike—your bigger goal',
    conceptTags: ['saving_vs_spending', 'goals', 'impulse_control'],
    explanation: 'Sales can be tempting! But if the bike is your real goal, spending on the toy delays it. There will be other sales—stay focused on your goal!'
  },

  // Pie Chart
  {
    id: 'm2q7',
    type: 'mcq',
    questionText: 'A pie chart shows: Needs = 50%, Wants = 30%, Savings = 20%. Which category gets the MOST money?',
    options: ['Needs', 'Wants', 'Savings', 'They\'re all equal'],
    correctAnswer: 'Needs',
    conceptTags: ['pie_charts', 'budgeting'],
    explanation: 'In a pie chart, the biggest slice is the biggest percentage. 50% (Needs) > 30% (Wants) > 20% (Savings).'
  },
  {
    id: 'm2q8',
    type: 'mcq',
    questionText: 'Looking at a budget pie chart, which slice should usually be the SMALLEST for a healthy budget?',
    options: ['Needs', 'Wants', 'Savings', 'It doesn\'t matter'],
    correctAnswer: 'Wants',
    conceptTags: ['pie_charts', 'budgeting', 'priorities'],
    explanation: 'A healthy budget puts needs first, then savings, then wants. Wants are fun but should be the smallest piece!'
  },

  // More scenarios
  {
    id: 'm2q9',
    type: 'mcq',
    questionText: 'Charity is a way of:',
    options: [
      'Spending money only on yourself',
      'Giving money or help to people in need',
      'Saving money in a bank',
      'Borrowing money from others'
    ],
    correctAnswer: 'Giving money or help to people in need',
    conceptTags: ['basic_vocab', 'charity'],
    explanation: 'Charity means giving to help others! It could be money, food, or your time. Many people include charity in their budget.'
  },
  {
    id: 'm2q10',
    type: 'numeric',
    questionText: 'You have $25. You want to split it: 50% savings, 30% spending, 20% charity. How much goes to SAVINGS?',
    correctAnswer: 12.50,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['budgeting', 'percentages', 'budget_math'],
    explanation: '50% of $25 = $25 × 0.50 = $12.50 goes to savings!'
  },
]

export default function Module2Quiz({ onComplete }: Module2QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={2}
      quizTitle="Module 2 Quiz: Saving, Spending & Budgets"
      quizDescription="Test your skills with save vs spend decisions, budgets, and pie charts!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module2_quiz_score: data.score,
        module2_quiz_total: data.total,
        module2_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module2_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

