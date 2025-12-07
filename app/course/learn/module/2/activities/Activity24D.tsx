'use client'

import OpenEndedActivity, { OpenEndedQuestion } from '@/components/OpenEndedActivity'

interface Activity24DProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUESTIONS: OpenEndedQuestion[] = [
  {
    id: 'why_plan',
    prompt: 'Why did you choose your plan? (Think about: needs, wants, savings levels)',
    placeholder: 'I chose these plans because...',
    conceptTags: ['budgeting', 'decisions'],
    questionType: 'reflection',
    rubric: 'Explains why they chose specific levels for needs, wants, or savings',
    minLength: 20,
  },
  {
    id: 'tough_decision',
    prompt: 'What budget decision was tough for you to make?',
    placeholder: 'The hardest choice was...',
    conceptTags: ['budgeting', 'tradeoffs'],
    questionType: 'reflection',
    rubric: 'Names a specific decision and explains why it was difficult',
    minLength: 20,
  },
  {
    id: 'wish',
    prompt: 'What is one thing you wish you could have, but couldn\'t afford?',
    placeholder: 'I wish I could afford...',
    conceptTags: ['budgeting', 'wants'],
    questionType: 'reflection',
    rubric: 'Names something specific they wanted but couldn\'t fit in the budget',
    minLength: 15,
  },
  {
    id: 'change',
    prompt: 'Is there anything you would change about your plan now that you\'ve seen the numbers?',
    placeholder: 'Looking at my budget, I would change...',
    conceptTags: ['budgeting', 'evaluation'],
    questionType: 'reflection',
    rubric: 'Shows they thought about their choices and what they might do differently',
    minLength: 20,
  },
]

export default function Activity24D({ onComplete }: Activity24DProps) {
  const handleComplete = (answers: Record<string, string>) => {
    onComplete({ budget_simulation_reflection: answers })
  }

  return (
    <OpenEndedActivity
      title="Activity 2.4D – Budget Reflection"
      description="Reflect on your budget simulation experience. Think about your choices and what you learned. Bright wants to hear your thoughts!"
      questions={QUESTIONS}
      onComplete={handleComplete}
    />
  )
}
