'use client'

import ModuleQuiz, { QuizQuestion } from '@/components/ModuleQuiz'

interface Module5QuizProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Single Item Tax
  {
    id: 'm5q1',
    type: 'numeric',
    questionText: 'A toy costs $10. Sales tax is 10%. How much is the TAX amount?',
    correctAnswer: 1,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['sales_tax', 'tax_calculation'],
    explanation: 'Tax = Price × Tax Rate. So $10 × 0.10 = $1.00 in tax.'
  },
  {
    id: 'm5q2',
    type: 'numeric',
    questionText: 'A book costs $20. Tax is 5%. What is the TOTAL price including tax?',
    correctAnswer: 21,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['sales_tax', 'total_with_tax'],
    explanation: 'Tax: $20 × 0.05 = $1. Total: $20 + $1 = $21.'
  },

  // Multiple Items + Tax
  {
    id: 'm5q3',
    type: 'numeric',
    questionText: 'You buy a $15 shirt and $25 jeans. Tax is 8%. What is the TOTAL with tax?',
    correctAnswer: 43.20,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['sales_tax', 'multiple_items'],
    explanation: 'Subtotal: $15 + $25 = $40. Tax: $40 × 0.08 = $3.20. Total: $40 + $3.20 = $43.20.'
  },

  // Discount Calculation
  {
    id: 'm5q4',
    type: 'numeric',
    questionText: 'A $40 backpack is 25% off. How much is the DISCOUNT?',
    correctAnswer: 10,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['discounts', 'percent_off'],
    explanation: 'Discount = Original × Percent Off. So $40 × 0.25 = $10 discount.'
  },
  {
    id: 'm5q5',
    type: 'numeric',
    questionText: 'A $40 backpack is 25% off. What is the SALE PRICE (before tax)?',
    correctAnswer: 30,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['discounts', 'sale_price'],
    explanation: 'Discount: $10. Sale price: $40 - $10 = $30.'
  },

  // Discount + Tax Combined
  {
    id: 'm5q6',
    type: 'numeric',
    questionText: 'Shoes are $60, with 20% off, then 10% tax. What is the FINAL price?',
    correctAnswer: 52.80,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['tax_plus_discount', 'order_of_operations'],
    explanation: 'Step 1: Discount of 20% = $12 off. Sale price: $60 - $12 = $48. Step 2: Tax of 10% = $4.80. Final: $48 + $4.80 = $52.80.'
  },
  {
    id: 'm5q7',
    type: 'mcq',
    questionText: 'When calculating a price with BOTH a discount AND tax, which do you apply FIRST?',
    options: [
      'Tax first, then discount',
      'Discount first, then tax',
      'It doesn\'t matter—same result either way',
      'You can\'t have both on one item'
    ],
    correctAnswer: 'Discount first, then tax',
    conceptTags: ['tax_plus_discount', 'order_of_operations'],
    explanation: 'Always apply the discount FIRST to get the sale price, then add tax on that lower price. This is how stores do it!'
  },

  // Better Deal Comparison
  {
    id: 'm5q8',
    type: 'mcq',
    questionText: 'Store A: Headphones $50, 10% off. Store B: Same headphones $48, no discount. Which is the better deal (before tax)?',
    options: [
      'Store A ($50 with 10% off)',
      'Store B ($48 no discount)',
      'They\'re exactly the same',
      'Need more information'
    ],
    correctAnswer: 'Store A ($50 with 10% off)',
    conceptTags: ['discounts', 'comparison_shopping'],
    explanation: 'Store A: $50 - $5 = $45 after discount. Store B: $48. Store A is $3 cheaper!'
  },
  {
    id: 'm5q9',
    type: 'numeric',
    questionText: 'An item is $100. There\'s a 30% off sale, and then 6% tax. What is the final price?',
    correctAnswer: 74.20,
    unit: 'dollars',
    tolerance: 0.01,
    conceptTags: ['tax_plus_discount', 'complex_calculation'],
    explanation: 'Discount: $100 × 0.30 = $30 off. Sale price: $70. Tax: $70 × 0.06 = $4.20. Final: $70 + $4.20 = $74.20.'
  },
  {
    id: 'm5q10',
    type: 'mcq',
    questionText: 'Why is it important to budget for sales tax?',
    options: [
      'Sales tax is optional—you can skip it',
      'The total at checkout is always MORE than the price tag',
      'Tax only applies to expensive items',
      'Stores keep the tax money'
    ],
    correctAnswer: 'The total at checkout is always MORE than the price tag',
    conceptTags: ['sales_tax', 'budgeting'],
    explanation: 'The price tag doesn\'t include tax! Always remember to add tax mentally so you don\'t come up short at checkout.'
  },
]

export default function Module5Quiz({ onComplete }: Module5QuizProps) {
  return (
    <ModuleQuiz
      moduleNumber={5}
      quizTitle="Module 5 Quiz: Tax & Discounts"
      quizDescription="Test your skills calculating sales tax, discounts, and final prices!"
      questions={QUIZ_QUESTIONS}
      onComplete={(data) => onComplete({
        module5_quiz_score: data.score,
        module5_quiz_total: data.total,
        module5_quiz_passed: data.score >= Math.ceil(data.total * 0.7),
        module5_quiz_missed: data.missedQuestions,
      })}
    />
  )
}

