'use client'

import OpenEndedActivity, { OpenEndedQuestion } from '@/components/OpenEndedActivity'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const QUESTIONS: OpenEndedQuestion[] = [
  {
    id: 'fixed',
    prompt: 'Write your own example of a FIXED expense (same cost each month):',
    placeholder: 'e.g., Rent, phone bill, streaming subscription...',
    conceptTags: ['expense_types', 'fixed_expenses'],
    questionType: 'concept_check',
    rubric: 'Names an expense that stays the same each month like rent, subscription, phone bill',
    minLength: 3,
  },
  {
    id: 'discretionary',
    prompt: 'Write your own example of a DISCRETIONARY expense (not essential, you choose when to spend):',
    placeholder: 'e.g., Movie tickets, new toy, concert...',
    conceptTags: ['expense_types', 'discretionary_expenses'],
    questionType: 'concept_check',
    rubric: 'Names a want/optional expense like entertainment, dining out, toys, games',
    minLength: 3,
  },
  {
    id: 'periodic',
    prompt: 'Write your own example of a PERIODIC expense (occurs regularly but not every month):',
    placeholder: 'e.g., Car insurance (every 6 months), school supplies (yearly)...',
    conceptTags: ['expense_types', 'periodic_expenses'],
    questionType: 'concept_check',
    rubric: 'Names an expense that happens regularly but not monthly like car insurance, school supplies, holiday gifts',
    minLength: 3,
  },
  {
    id: 'variable',
    prompt: 'Write your own example of a VARIABLE expense (cost changes from month to month):',
    placeholder: 'e.g., Groceries, gas, electricity...',
    conceptTags: ['expense_types', 'variable_expenses'],
    questionType: 'concept_check',
    rubric: 'Names an expense whose amount changes like groceries, gas, utilities, eating out',
    minLength: 3,
  },
]

export default function Activity46C({ onComplete }: Props) {
  const handleComplete = (answers: Record<string, string>) => {
    onComplete({ expense_examples: answers })
  }

  return (
    <OpenEndedActivity
      title="Activity 4.6C – Write Your Own Examples"
      description="Create your own examples for each expense type. Bright will check that your examples match the category!"
      questions={QUESTIONS}
      onComplete={handleComplete}
    />
  )
}
