'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module3QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Credit vs Debit
  {
    id: 'm3q1',
    type: 'mcq',
    questionText: 'You\'re buying groceries and have enough money in your bank account. Which card should you use?',
    options: [
      'Credit card—always use credit',
      'Debit card—it takes money directly from your account',
      'Neither—always use cash',
      'It doesn\'t matter'
    ],
    correctAnswer: 'Debit card—it takes money directly from your account',
    conceptTags: ['credit_vs_debit'],
    explanation: 'When you have the money, debit is smart! It uses YOUR money directly, so you don\'t risk debt or interest charges.'
  },
  {
    id: 'm3q2',
    type: 'mcq',
    questionText: 'When might using a credit card be a better choice?',
    options: [
      'Buying candy every day',
      'Emergency car repair when you don\'t have savings',
      'Buying toys you can\'t afford',
      'Shopping at 2am because you\'re bored'
    ],
    correctAnswer: 'Emergency car repair when you don\'t have savings',
    conceptTags: ['credit_vs_debit', 'smart_credit_use'],
    explanation: 'Credit can help in true emergencies when you NEED something but don\'t have the money yet. Just make sure to pay it back quickly!'
  },
  
  // Credit Terms
  {
    id: 'm3q3',
    type: 'mcq',
    questionText: 'The person who BORROWS money is called the:',
    options: ['Lender', 'Borrower', 'Banker', 'Creditor'],
    correctAnswer: 'Borrower',
    conceptTags: ['credit_terms', 'borrower_lender'],
    explanation: 'The borrower takes the money and promises to pay it back. The lender is the one who gives the loan.'
  },
  {
    id: 'm3q4',
    type: 'mcq',
    questionText: 'If you borrow $100 and pay back $110, the extra $10 is called:',
    options: ['Profit', 'Tax', 'Interest', 'Discount'],
    correctAnswer: 'Interest',
    conceptTags: ['credit_terms', 'interest'],
    explanation: 'Interest is the "cost" of borrowing money. The lender charges it as a fee for letting you use their money.'
  },

  // Stock Trends
  {
    id: 'm3q5',
    type: 'mcq',
    questionText: 'A stock chart shows these prices over 5 days: $10, $12, $11, $14, $15. Overall, this stock trend is:',
    options: ['Going down', 'Going up', 'Staying the same', 'Too volatile to tell'],
    correctAnswer: 'Going up',
    conceptTags: ['stock_trend', 'investing'],
    explanation: 'Even though it dipped on day 3, it ended at $15—higher than it started at $10. That\'s an overall upward trend!'
  },
  {
    id: 'm3q6',
    type: 'mcq',
    questionText: 'Looking at the same stock ($10, $12, $11, $14, $15), what was the LOWEST price?',
    options: ['$15', '$14', '$11', '$10'],
    correctAnswer: '$10',
    conceptTags: ['stock_trend', 'reading_charts'],
    explanation: 'The lowest point on the chart was $10 on the first day.'
  },
  {
    id: 'm3q7',
    type: 'mcq',
    questionText: 'If you bought a stock at $20 and sold it when it was worth $25, did you make money or lose money?',
    options: [
      'Made $5 profit',
      'Lost $5',
      'Broke even (no gain or loss)',
      'Can\'t tell from this information'
    ],
    correctAnswer: 'Made $5 profit',
    conceptTags: ['stock_trend', 'investing', 'profit'],
    explanation: 'You bought at $20 and sold at $25. That\'s $25 - $20 = $5 profit! Buy low, sell high is the goal.'
  },

  // Check Basics
  {
    id: 'm3q8',
    type: 'mcq',
    questionText: 'On a check, where do you write the amount in WORDS (like "Twenty-five dollars")?',
    options: [
      'In the memo line',
      'In the small box with the $ sign',
      'On the long line below the payee name',
      'On the signature line'
    ],
    correctAnswer: 'On the long line below the payee name',
    conceptTags: ['check_basics', 'check_parts'],
    explanation: 'The written amount goes on that long line! The number amount goes in the small box. They should match!'
  },
  {
    id: 'm3q9',
    type: 'mcq',
    questionText: 'What\'s WRONG with a check that says "$50" in the box but "Forty dollars" written out?',
    options: [
      'Nothing—one is just a backup',
      'The amounts don\'t match, which is a problem',
      'You can\'t write both',
      'The written amount is always ignored'
    ],
    correctAnswer: 'The amounts don\'t match, which is a problem',
    conceptTags: ['check_basics', 'check_errors'],
    explanation: 'Both amounts MUST match! If they don\'t, the bank might not accept the check, or they\'ll use the written amount.'
  },
  {
    id: 'm3q10',
    type: 'mcq',
    questionText: 'Which part of a check contains YOUR bank account information?',
    options: [
      'The memo line',
      'The payee line',
      'The numbers at the bottom (routing & account numbers)',
      'The date'
    ],
    correctAnswer: 'The numbers at the bottom (routing & account numbers)',
    conceptTags: ['check_basics', 'check_parts'],
    explanation: 'Those long numbers at the bottom identify YOUR bank (routing number) and YOUR specific account (account number).'
  },
]

export default function Module3Quiz({ onComplete }: Module3QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={3}
      quizTitle="Module 3 Quiz: Credit, Investing & Checks"
      quizDescription="Test your knowledge of credit vs debit, stock trends, and check writing!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module3_quiz_score: data.score,
        module3_quiz_total: data.total,
        module3_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module3_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

