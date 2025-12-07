'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module6QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ===== MODULE 1: Money Basics (3 questions) =====
  {
    id: 'm6q1',
    type: 'mcq',
    questionText: 'Which of these is a NEED?',
    options: ['Video game', 'Food for dinner', 'Movie tickets', 'Fancy headphones'],
    correctAnswer: 'Food for dinner',
    conceptTags: ['needs_vs_wants', 'module1'],
    explanation: 'Needs are things you must have to survive and be healthy. Food is essential!'
  },
  {
    id: 'm6q2',
    type: 'numeric',
    questionText: 'You have 3 quarters and 2 dimes. How many cents is that?',
    correctAnswer: 95,
    unit: 'cents',
    tolerance: 0,
    conceptTags: ['coins', 'counting_money', 'module1'],
    explanation: '3 quarters = 75¢, 2 dimes = 20¢. Total: 75 + 20 = 95 cents!'
  },
  {
    id: 'm6q3',
    type: 'mcq',
    questionText: 'Money you earn from a job or allowance is called your:',
    options: ['Expense', 'Debt', 'Income', 'Interest'],
    correctAnswer: 'Income',
    conceptTags: ['basic_vocab', 'income', 'module1'],
    explanation: 'Income is money coming IN to you—from work, allowance, or gifts.'
  },

  // ===== MODULE 2: Saving & Budgets (3 questions) =====
  {
    id: 'm6q4',
    type: 'mcq',
    questionText: 'You\'re saving for a $30 game but friends want you to spend $20 at the mall today. What\'s the smartest choice?',
    options: [
      'Spend the $20 at the mall',
      'Keep saving for your goal',
      'Borrow money to do both',
      'Give up on the game'
    ],
    correctAnswer: 'Keep saving for your goal',
    conceptTags: ['saving_vs_spending', 'goals', 'module2'],
    explanation: 'Staying focused on your savings goal helps you get what you really want!'
  },
  {
    id: 'm6q5',
    type: 'numeric',
    questionText: 'Monthly income: $80. Budget: Needs $35, Wants $25, Savings $15. How much is LEFT OVER?',
    correctAnswer: 5,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['budgeting', 'budget_math', 'module2'],
    explanation: 'Total budgeted: $35 + $25 + $15 = $75. Left over: $80 - $75 = $5.'
  },
  {
    id: 'm6q6',
    type: 'mcq',
    questionText: 'In a healthy budget pie chart, which category should usually be LARGEST?',
    options: ['Wants', 'Savings', 'Needs', 'Entertainment'],
    correctAnswer: 'Needs',
    conceptTags: ['pie_charts', 'budgeting', 'module2'],
    explanation: 'Needs (food, housing, clothes) should get the biggest portion since they\'re essential.'
  },

  // ===== MODULE 3: Credit, Investing, Checks (4 questions) =====
  {
    id: 'm6q7',
    type: 'mcq',
    questionText: 'You have money in your bank account and want to buy lunch. Which card is best?',
    options: ['Credit card', 'Debit card', 'Gift card', 'Library card'],
    correctAnswer: 'Debit card',
    conceptTags: ['credit_vs_debit', 'module3'],
    explanation: 'Debit uses YOUR money directly—no borrowing, no interest!'
  },
  {
    id: 'm6q8',
    type: 'mcq',
    questionText: 'If you borrow $50 and pay back $55, the extra $5 is:',
    options: ['A tip', 'Interest', 'Profit', 'Tax'],
    correctAnswer: 'Interest',
    conceptTags: ['interest', 'credit_terms', 'module3'],
    explanation: 'Interest is the cost of borrowing money. Lenders charge it as a fee.'
  },
  {
    id: 'm6q9',
    type: 'mcq',
    questionText: 'Stock prices over 4 days: $8, $10, $9, $12. Overall trend?',
    options: ['Going down', 'Going up', 'Staying flat', 'Impossible to tell'],
    correctAnswer: 'Going up',
    conceptTags: ['stock_trend', 'investing', 'module3'],
    explanation: 'Started at $8, ended at $12. Despite some ups and downs, the overall trend is UP!'
  },
  {
    id: 'm6q10',
    type: 'mcq',
    questionText: 'On a check, the written amount and the number amount must:',
    options: ['Be different', 'Match exactly', 'One can be blank', 'Be in different colors'],
    correctAnswer: 'Match exactly',
    conceptTags: ['check_basics', 'module3'],
    explanation: 'Both amounts must match! If they don\'t, the bank may reject the check.'
  },

  // ===== MODULE 4: Business & Expenses (4 questions) =====
  {
    id: 'm6q11',
    type: 'numeric',
    questionText: 'Revenue: $100. Expenses: $65. What is the profit?',
    correctAnswer: 35,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['profit_loss', 'revenue', 'expenses', 'module4'],
    explanation: 'Profit = Revenue - Expenses. $100 - $65 = $35 profit!'
  },
  {
    id: 'm6q12',
    type: 'mcq',
    questionText: 'A drought destroys half the wheat crops. What happens to bread prices?',
    options: ['Prices go down', 'Prices go up', 'Prices stay the same', 'Bread becomes free'],
    correctAnswer: 'Prices go up',
    conceptTags: ['scarcity', 'supply_demand', 'module4'],
    explanation: 'Less wheat (scarcity) means less bread can be made. Less supply = higher prices!'
  },
  {
    id: 'm6q13',
    type: 'mcq',
    questionText: 'Monthly rent that stays the same every month is a:',
    options: ['Variable expense', 'Fixed expense', 'Discretionary expense', 'One-time expense'],
    correctAnswer: 'Fixed expense',
    conceptTags: ['expense_types', 'fixed_expenses', 'module4'],
    explanation: 'Fixed expenses don\'t change—same amount every time, like rent or subscriptions.'
  },
  {
    id: 'm6q14',
    type: 'mcq',
    questionText: 'Ingredients for each pizza you make would be a:',
    options: ['Fixed expense', 'Variable expense', 'Periodic expense', 'Asset'],
    correctAnswer: 'Variable expense',
    conceptTags: ['expense_types', 'variable_expenses', 'module4'],
    explanation: 'Variable expenses change with production. More pizzas = more ingredient costs!'
  },

  // ===== MODULE 5: Tax & Discounts (4 questions) =====
  {
    id: 'm6q15',
    type: 'numeric',
    questionText: 'A game costs $50. Sales tax is 8%. What is the tax amount?',
    correctAnswer: 4,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['sales_tax', 'tax_calculation', 'module5'],
    explanation: 'Tax = $50 × 0.08 = $4.00'
  },
  {
    id: 'm6q16',
    type: 'numeric',
    questionText: 'A $80 jacket is 25% off. What is the sale price?',
    correctAnswer: 60,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['discounts', 'sale_price', 'module5'],
    explanation: 'Discount: $80 × 0.25 = $20. Sale price: $80 - $20 = $60.'
  },
  {
    id: 'm6q17',
    type: 'numeric',
    questionText: 'Shoes: $50, 20% off, then 10% tax. Final price?',
    correctAnswer: 44,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['tax_plus_discount', 'module5'],
    explanation: 'After 20% off: $50 - $10 = $40. After 10% tax: $40 + $4 = $44.'
  },
  {
    id: 'm6q18',
    type: 'mcq',
    questionText: 'When there\'s a discount AND tax, which do you calculate first?',
    options: ['Tax first', 'Discount first', 'It doesn\'t matter', 'Neither—they cancel out'],
    correctAnswer: 'Discount first',
    conceptTags: ['tax_plus_discount', 'order_of_operations', 'module5'],
    explanation: 'Always apply the discount first, then calculate tax on the lower sale price!'
  },

  // ===== MIXED/COMPREHENSIVE (2 questions) =====
  {
    id: 'm6q19',
    type: 'select_all',
    questionText: 'Which are signs of good financial habits? (Select all)',
    options: [
      'Spending all your money as soon as you get it',
      'Saving some money every month',
      'Making a budget and sticking to it',
      'Only buying wants and ignoring needs',
      'Comparing prices before buying'
    ],
    correctAnswers: ['Saving some money every month', 'Making a budget and sticking to it', 'Comparing prices before buying'],
    conceptTags: ['financial_habits', 'comprehensive'],
    explanation: 'Good habits include saving regularly, budgeting, and being a smart shopper!'
  },
  {
    id: 'm6q20',
    type: 'mcq',
    questionText: 'You have $25. You want to buy: Toy ($15), Snack ($3), Save ($7). What should you do?',
    options: [
      'Buy everything—it adds up to $25',
      'Skip the toy since needs come first',
      'Borrow more money',
      'Don\'t save anything'
    ],
    correctAnswer: 'Buy everything—it adds up to $25',
    conceptTags: ['budgeting', 'comprehensive'],
    explanation: '$15 + $3 + $7 = $25 exactly! This budget works because it matches your income and includes savings.'
  },
]

export default function Module6Quiz({ onComplete }: Module6QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={6}
      quizTitle="Final Review Quiz: Financial Foundations"
      quizDescription="Comprehensive test covering all modules—vocabulary, budgets, credit, business, tax & discounts!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module6_quiz_score: data.score,
        module6_quiz_total: data.total,
        module6_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module6_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

