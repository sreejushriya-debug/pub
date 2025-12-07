'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module4QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Profit/Loss Problems
  {
    id: 'm4q1',
    type: 'numeric',
    questionText: 'A lemonade stand made $50 in sales (revenue). The supplies cost $20 (expenses). What is the PROFIT?',
    correctAnswer: 30,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['profit_loss', 'revenue', 'expenses'],
    explanation: 'Profit = Revenue - Expenses. So $50 - $20 = $30 profit!'
  },
  {
    id: 'm4q2',
    type: 'mcq',
    questionText: 'A bakery made $200 in sales but spent $250 on ingredients and supplies. This business has:',
    options: ['A profit of $50', 'A loss of $50', 'Broken even', 'A profit of $450'],
    correctAnswer: 'A loss of $50',
    conceptTags: ['profit_loss', 'revenue', 'expenses'],
    explanation: '$200 - $250 = -$50. When expenses are MORE than revenue, you have a LOSS, not a profit.'
  },
  {
    id: 'm4q3',
    type: 'numeric',
    questionText: 'You sell 10 cookies for $2 each. Your ingredients cost $8 total. What is your profit?',
    correctAnswer: 12,
    unit: 'dollars',
    tolerance: 0,
    conceptTags: ['profit_loss', 'revenue', 'expenses'],
    explanation: 'Revenue: 10 × $2 = $20. Expenses: $8. Profit: $20 - $8 = $12!'
  },

  // Business Vocabulary
  {
    id: 'm4q4',
    type: 'mcq',
    questionText: '"Revenue" means:',
    options: [
      'Money left after paying bills',
      'Total money a business brings in from sales',
      'Money borrowed from a bank',
      'The same as profit'
    ],
    correctAnswer: 'Total money a business brings in from sales',
    conceptTags: ['business_vocab', 'revenue'],
    explanation: 'Revenue is ALL the money coming in from sales—before you subtract any costs. Profit is what\'s LEFT after costs.'
  },
  {
    id: 'm4q5',
    type: 'mcq',
    questionText: 'Which is an ASSET (something valuable you own)?',
    options: [
      'A loan you need to repay',
      'Money in your savings account',
      'Your monthly rent bill',
      'Interest you owe on a credit card'
    ],
    correctAnswer: 'Money in your savings account',
    conceptTags: ['business_vocab', 'assets_liabilities'],
    explanation: 'Assets are things you OWN that have value—like savings, a car, or equipment. Debts and bills are liabilities (what you OWE).'
  },

  // Scarcity & Costs
  {
    id: 'm4q6',
    type: 'mcq',
    questionText: 'A big storm destroys half the orange farms. What happens to orange prices?',
    options: [
      'Prices go DOWN because fewer oranges',
      'Prices go UP because oranges are scarce',
      'Prices stay the same',
      'Oranges become free'
    ],
    correctAnswer: 'Prices go UP because oranges are scarce',
    conceptTags: ['scarcity', 'supply_demand'],
    explanation: 'When something becomes scarce (rare), the price usually goes UP. Less supply + same demand = higher prices!'
  },
  {
    id: 'm4q7',
    type: 'mcq',
    questionText: 'A factory finds a cheaper way to make sneakers. Production costs go from $20 to $10. What likely happens?',
    options: [
      'Sneaker prices go up',
      'Sneaker prices might go down or profits increase',
      'Nothing changes',
      'The factory closes'
    ],
    correctAnswer: 'Sneaker prices might go down or profits increase',
    conceptTags: ['scarcity', 'production_costs'],
    explanation: 'Lower costs mean the business can either lower prices (to sell more) or keep prices the same and make more profit!'
  },

  // Types of Expenses
  {
    id: 'm4q8',
    type: 'mcq',
    questionText: 'Rent for a store is $1,000 every month, no matter how much you sell. This is a:',
    options: ['Variable expense', 'Fixed expense', 'Periodic expense', 'Discretionary expense'],
    correctAnswer: 'Fixed expense',
    conceptTags: ['expense_types', 'fixed_expenses'],
    explanation: 'Fixed expenses stay the SAME every period—like rent, insurance, or a subscription. They don\'t change with sales.'
  },
  {
    id: 'm4q9',
    type: 'mcq',
    questionText: 'A pizza shop\'s cost for ingredients depends on how many pizzas they make. More pizzas = more ingredient costs. This is a:',
    options: ['Fixed expense', 'Variable expense', 'Periodic expense', 'One-time expense'],
    correctAnswer: 'Variable expense',
    conceptTags: ['expense_types', 'variable_expenses'],
    explanation: 'Variable expenses CHANGE based on how much you produce or sell. More pizzas = more cheese, sauce, and dough costs!'
  },
  {
    id: 'm4q10',
    type: 'mcq',
    questionText: 'You pay for a business license once a year. This is a:',
    options: ['Fixed expense', 'Variable expense', 'Periodic expense', 'Discretionary expense'],
    correctAnswer: 'Periodic expense',
    conceptTags: ['expense_types', 'periodic_expenses'],
    explanation: 'Periodic expenses happen on a schedule but not monthly—like yearly license fees, quarterly taxes, or annual insurance.'
  },
  {
    id: 'm4q11',
    type: 'select_all',
    questionText: 'Which of these are VARIABLE expenses? (Select all that apply)',
    options: [
      'Monthly rent ($500 every month)',
      'Ingredients for each product you make',
      'Shipping costs per order',
      'Annual business license',
      'Packaging materials per item'
    ],
    correctAnswers: ['Ingredients for each product you make', 'Shipping costs per order', 'Packaging materials per item'],
    conceptTags: ['expense_types', 'variable_expenses'],
    explanation: 'Variable expenses change with production: ingredients, shipping per order, and packaging per item all increase when you sell more!'
  },
  {
    id: 'm4q12',
    type: 'mcq',
    questionText: 'A business owner decides to buy fancy new office decorations. This is a:',
    options: ['Fixed expense', 'Variable expense', 'Periodic expense', 'Discretionary expense'],
    correctAnswer: 'Discretionary expense',
    conceptTags: ['expense_types', 'discretionary_expenses'],
    explanation: 'Discretionary means "optional" or "by choice." Fancy decorations aren\'t required—the owner CHOSE to spend on them.'
  },
]

export default function Module4Quiz({ onComplete }: Module4QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={4}
      quizTitle="Module 4 Quiz: Business & Expenses"
      quizDescription="Test your knowledge of profit, loss, revenue, and types of expenses!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module4_quiz_score: data.score,
        module4_quiz_total: data.total,
        module4_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module4_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

