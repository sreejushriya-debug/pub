'use client'

import OpenEndedActivity, { OpenEndedQuestion } from '@/components/OpenEndedActivity'

interface Activity22BProps {
  scenarios: Record<string, string>
  onComplete: (data: Record<string, unknown>) => void
}

const SCENARIOS_FOR_WRITING = [
  { 
    id: 'hannah', 
    name: 'Hannah', 
    text: 'Hannah has $15 saved up and wants to buy a notebook that costs $20. Her birthday is next week.',
    correctChoice: 'save',
    rubric: 'Mentions that Hannah doesn\'t have enough money yet, or that waiting for birthday money is smart'
  },
  { 
    id: 'nishi', 
    name: 'Nishi', 
    text: 'Nishi has $100 saved and found shoes she wanted on sale for $75 (usually $100).',
    correctChoice: 'spend',
    rubric: 'Mentions that Nishi has enough money and the sale makes it a good time to buy, or weighs wanting vs needing'
  },
  { 
    id: 'jameson', 
    name: 'Jameson', 
    text: 'Jameson needs new shoes for school - his have holes. He has $50 and found shoes for $40.',
    correctChoice: 'spend',
    rubric: 'Mentions that new shoes are a NEED (not a want), and Jameson has enough money'
  },
]

export default function Activity22B({ scenarios, onComplete }: Activity22BProps) {
  const questions: OpenEndedQuestion[] = SCENARIOS_FOR_WRITING.map(s => {
    const userChoice = scenarios[s.id] || s.correctChoice
    return {
      id: s.id,
      prompt: `${s.name}: ${s.text}\n\nYou chose "${userChoice.toUpperCase()}." Explain why ${userChoice === 'save' ? 'saving' : 'spending'} is the better choice for ${s.name}.`,
      placeholder: `Why is ${userChoice}ing the better choice for ${s.name}?`,
      conceptTags: ['saving_vs_spending', 'decisions'],
      questionType: 'concept_check' as const,
      rubric: s.rubric,
      minLength: 20,
    }
  })

  const handleComplete = (answers: Record<string, string>) => {
    onComplete({ activity_22b_justifications: answers })
  }

  return (
    <OpenEndedActivity
      title="Activity 2.2B – Explain Your Thinking"
      description="Write 1-2 sentences explaining why saving or spending is the better choice for each scenario. Bright will check that your reasoning makes sense!"
      questions={questions}
      onComplete={handleComplete}
    />
  )
}
