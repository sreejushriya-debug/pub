'use client'

import OpenEndedActivity, { OpenEndedQuestion } from '@/components/OpenEndedActivity'

interface Activity23CProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUESTIONS: OpenEndedQuestion[] = [
  {
    id: 'realistic',
    prompt: 'Is your budget realistic? Why or why not?',
    placeholder: 'Think about: Can you actually stick to these amounts? Are there expenses you forgot?',
    conceptTags: ['budgeting', 'realistic_budget'],
    questionType: 'reflection',
    rubric: 'Mentions specific details about their budget choices and explains reasoning',
    minLength: 25,
  },
  {
    id: 'priority',
    prompt: 'Which category did you give the most money to? Does that match your real priorities?',
    placeholder: 'Consider what matters most to you and if your budget reflects that.',
    conceptTags: ['budgeting', 'priorities'],
    questionType: 'reflection',
    rubric: 'Names a specific category and reflects on whether it matches their actual priorities',
    minLength: 25,
  },
  {
    id: 'cut',
    prompt: 'If you had to cut 10% from your budget, where would you cut and why?',
    placeholder: 'Think about wants vs needs. What could you live without?',
    conceptTags: ['budgeting', 'needs_vs_wants'],
    questionType: 'reflection',
    rubric: 'Names a specific category and explains why they could reduce it (ideally mentions wants vs needs)',
    minLength: 25,
  },
]

export default function Activity23C({ onComplete }: Activity23CProps) {
  const handleComplete = (answers: Record<string, string>) => {
    onComplete({ budget_reflection: answers })
  }

  return (
    <OpenEndedActivity
      title="Activity 2.3C – Evaluate Your Budget"
      description="Reflect on the budget you created. Think about your choices and explain your thinking. Bright wants to hear your thoughts!"
      questions={QUESTIONS}
      onComplete={handleComplete}
    />
  )
}
