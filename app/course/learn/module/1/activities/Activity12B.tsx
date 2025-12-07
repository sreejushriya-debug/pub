'use client'

import OpenEndedActivity, { OpenEndedQuestion } from '@/components/OpenEndedActivity'

interface Activity12BProps {
  missedWords: string[]
  onComplete: (data: Record<string, unknown>) => void
}

const DEFAULT_WORDS = ['debt', 'budget', 'savings', 'interest']

const WORD_RUBRICS: Record<string, string> = {
  debt: 'Shows understanding that debt is money you owe to someone else',
  budget: 'Shows understanding that a budget is a plan for spending and saving money',
  savings: 'Shows understanding that savings is money you set aside for later',
  interest: 'Shows understanding that interest is extra money paid on loans or earned in savings',
  income: 'Shows understanding that income is money earned from work or other sources',
  expenses: 'Shows understanding that expenses are things you spend money on',
  loan: 'Shows understanding that a loan is borrowed money that must be paid back',
  credit: 'Shows understanding that credit is borrowing money to pay for something',
  inflation: 'Shows understanding that inflation is when prices go up over time',
  profit: 'Shows understanding that profit is money left after paying expenses',
  stock: 'Shows understanding that a stock is a small piece of ownership in a company',
}

export default function Activity12B({ missedWords, onComplete }: Activity12BProps) {
  const wordsToUse = missedWords.length >= 3 
    ? missedWords.slice(0, 4) 
    : DEFAULT_WORDS

  const questions: OpenEndedQuestion[] = wordsToUse.map(word => ({
    id: `sentence-${word}`,
    prompt: `Write a sentence using the word "${word}" in a money example.`,
    placeholder: `Write a sentence using the word "${word}"...`,
    conceptTags: [word.toLowerCase(), 'basic_vocab'],
    questionType: 'concept_check' as const,
    rubric: WORD_RUBRICS[word.toLowerCase()] || `Uses the word "${word}" correctly in a money context`,
    minLength: 15,
  }))

  const handleComplete = (answers: Record<string, string>) => {
    // Convert answer IDs back to word keys
    const sentences: Record<string, string> = {}
    Object.entries(answers).forEach(([key, value]) => {
      const word = key.replace('sentence-', '')
      sentences[word] = value
    })
    
    onComplete({
      activity_12b_sentences: sentences
    })
  }

  return (
    <OpenEndedActivity
      title="Activity 1.2B – Create Your Own Sentences"
      description="Now it's your turn! Write a sentence using each word in a money example. Bright will check that you're using the words correctly."
      questions={questions}
      onComplete={handleComplete}
    />
  )
}
