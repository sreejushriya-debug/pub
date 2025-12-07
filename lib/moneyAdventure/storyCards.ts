import { StoryCard } from './types'

export const STORY_CARDS: StoryCard[] = [
  // INCOME CARDS
  {
    id: 'birthday-money',
    title: '🎂 Birthday Money!',
    description: 'It\'s your birthday! Your grandparents gave you $40 as a gift. You\'ve been eyeing a new video game that costs $35...',
    conceptTags: ['saving_vs_spending', 'wants'],
    category: 'income',
    choices: [
      {
        id: 'save-all',
        label: 'Save it all for later',
        effects: { savings: 40, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'Smart choice! You put all $40 in savings. Your future self will thank you!'
      },
      {
        id: 'save-half',
        label: 'Save half, keep half as cash',
        effects: { cash: 20, savings: 20, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'Great balance! You saved $20 and kept $20 for spending. Best of both worlds!'
      },
      {
        id: 'spend-game',
        label: 'Buy the video game now',
        effects: { cash: 5, wellbeing: 10 },
        wisdomTag: 'neutral',
        outcomeText: 'You bought the game for $35 and kept $5. Fun now, but your savings didn\'t grow.'
      },
      {
        id: 'spend-all',
        label: 'Spend it all on treats and fun',
        effects: { cash: 0, wellbeing: 15 },
        wisdomTag: 'risky',
        outcomeText: 'You had a blast spending $40 on snacks, games, and fun! But now it\'s all gone...'
      }
    ],
    bonusQuestion: {
      id: 'bq-birthday',
      questionText: 'What is money you set aside for the future called?',
      answerType: 'mcq',
      options: ['Spending', 'Savings', 'Debt', 'Income'],
      correctAnswer: 'Savings',
      conceptTags: ['savings', 'basic_vocab'],
      bonusReward: 5
    }
  },
  {
    id: 'allowance-day',
    title: '💵 Allowance Day!',
    description: 'You earned your weekly allowance of $15 for doing chores. Your friend invited you to the movies this weekend (tickets are $12).',
    conceptTags: ['income', 'saving_vs_spending', 'budgeting'],
    category: 'income',
    choices: [
      {
        id: 'save-allowance',
        label: 'Save all of it',
        effects: { savings: 15, wellbeing: 0 },
        wisdomTag: 'wise',
        outcomeText: 'You saved all $15! Your friend was disappointed, but your savings are growing.'
      },
      {
        id: 'movies-save-rest',
        label: 'Go to movies, save the rest ($3)',
        effects: { cash: 0, savings: 3, wellbeing: 10 },
        wisdomTag: 'wise',
        outcomeText: 'You enjoyed the movie with your friend AND saved $3. Nice planning!'
      },
      {
        id: 'movies-snacks',
        label: 'Movies + popcorn (spend it all)',
        effects: { cash: 0, wellbeing: 12 },
        wisdomTag: 'neutral',
        outcomeText: 'Movie plus snacks = great time! But you spent your whole allowance.'
      }
    ],
    bonusQuestion: {
      id: 'bq-allowance',
      questionText: 'Money you earn from work or chores is called:',
      answerType: 'mcq',
      options: ['Debt', 'Expenses', 'Income', 'Profit'],
      correctAnswer: 'Income',
      conceptTags: ['income', 'basic_vocab'],
      bonusReward: 5
    }
  },
  {
    id: 'lemonade-stand',
    title: '🍋 Lemonade Stand Success!',
    description: 'You set up a lemonade stand and made $25 in sales! But you spent $8 on supplies (cups, lemons, sugar).',
    conceptTags: ['profit_loss', 'revenue', 'expenses', 'business'],
    category: 'income',
    choices: [
      {
        id: 'reinvest',
        label: 'Save profit, buy more supplies for tomorrow',
        effects: { cash: 0, savings: 9, wellbeing: 8 },
        wisdomTag: 'wise',
        outcomeText: 'You saved your $17 profit and bought $8 more supplies. Ready for more business!'
      },
      {
        id: 'save-profit',
        label: 'Save all the profit',
        effects: { savings: 17, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'You saved your $17 profit. Smart entrepreneur thinking!'
      },
      {
        id: 'spend-profit',
        label: 'Treat yourself - you earned it!',
        effects: { cash: 17, wellbeing: 12 },
        wisdomTag: 'neutral',
        outcomeText: 'You kept the $17 profit as spending money. Time to celebrate!'
      }
    ],
    bonusQuestion: {
      id: 'bq-lemonade',
      questionText: 'If you made $25 in sales and spent $8 on supplies, what is your profit?',
      answerType: 'numeric',
      correctAnswer: '17',
      conceptTags: ['profit_loss', 'revenue', 'expenses'],
      bonusReward: 10
    }
  },
  // EXPENSE CARDS
  {
    id: 'new-shoes-needed',
    title: '👟 Your Shoes Have Holes!',
    description: 'Your school shoes have holes in them. You NEED new shoes, and they cost $45. You have $60 in savings.',
    conceptTags: ['needs_vs_wants', 'expenses'],
    category: 'expense',
    choices: [
      {
        id: 'buy-needed',
        label: 'Use savings to buy needed shoes',
        effects: { savings: -45, wellbeing: 10 },
        wisdomTag: 'wise',
        outcomeText: 'You bought the shoes you needed. This is exactly what savings are for!'
      },
      {
        id: 'buy-fancy',
        label: 'Buy fancier shoes for $75 (go into debt)',
        effects: { savings: -60, debt: 15, wellbeing: 5 },
        wisdomTag: 'risky',
        outcomeText: 'You got fancy shoes but now owe $15. Was the upgrade worth it?'
      },
      {
        id: 'wait',
        label: 'Wait and save more first',
        effects: { wellbeing: -10 },
        wisdomTag: 'risky',
        outcomeText: 'You\'re still wearing broken shoes... this is uncomfortable and embarrassing.'
      }
    ],
    bonusQuestion: {
      id: 'bq-shoes',
      questionText: 'School shoes you actually need are a:',
      answerType: 'mcq',
      options: ['Want', 'Need', 'Luxury', 'Debt'],
      correctAnswer: 'Need',
      conceptTags: ['needs_vs_wants'],
      bonusReward: 5
    }
  },
  {
    id: 'flash-sale',
    title: '🏷️ Flash Sale!',
    description: 'Your favorite store has a 50% off sale on toys! A toy you\'ve wanted (usually $30) is now only $15. But you don\'t really NEED it...',
    conceptTags: ['discounts', 'needs_vs_wants', 'saving_vs_spending'],
    category: 'expense',
    choices: [
      {
        id: 'skip-sale',
        label: 'Skip it - I don\'t need it',
        effects: { wellbeing: -5 },
        wisdomTag: 'wise',
        outcomeText: 'You resisted the sale! Your money stays safe. The urge will pass.'
      },
      {
        id: 'buy-from-cash',
        label: 'Buy it with my cash',
        effects: { cash: -15, wellbeing: 12 },
        wisdomTag: 'neutral',
        outcomeText: 'You got a great deal! The toy was 50% off, and you used cash you already had.'
      },
      {
        id: 'buy-from-savings',
        label: 'Dip into savings for this deal',
        effects: { savings: -15, wellbeing: 8 },
        wisdomTag: 'risky',
        outcomeText: 'You got the toy, but used savings for a want. Sales can be tempting!'
      }
    ],
    bonusQuestion: {
      id: 'bq-sale',
      questionText: 'If a $30 toy is 50% off, how much do you pay?',
      answerType: 'numeric',
      correctAnswer: '15',
      conceptTags: ['discounts'],
      bonusReward: 10
    }
  },
  // EMERGENCY CARDS
  {
    id: 'bike-repair',
    title: '🚲 Bike Breakdown!',
    description: 'Your bike\'s tire went flat and the chain broke! The repair shop says it\'ll cost $25 to fix. You need your bike to get to school.',
    conceptTags: ['emergency_expense', 'needs'],
    category: 'emergency',
    choices: [
      {
        id: 'use-savings',
        label: 'Pay from savings',
        effects: { savings: -25, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'You fixed your bike using savings. This is why we save - for emergencies!'
      },
      {
        id: 'borrow',
        label: 'Borrow money from parents (owe them back)',
        effects: { debt: 25, wellbeing: 0 },
        wisdomTag: 'neutral',
        outcomeText: 'Bike is fixed, but now you owe your parents $25. You\'ll need to pay them back.'
      },
      {
        id: 'walk',
        label: 'Walk to school instead',
        effects: { wellbeing: -15 },
        wisdomTag: 'risky',
        outcomeText: 'You saved money but now have to walk 30 minutes each way. Tired and late!'
      }
    ],
    bonusQuestion: {
      id: 'bq-bike',
      questionText: 'Money you owe someone else is called:',
      answerType: 'mcq',
      options: ['Savings', 'Income', 'Debt', 'Profit'],
      correctAnswer: 'Debt',
      conceptTags: ['debt', 'basic_vocab'],
      bonusReward: 5
    }
  },
  {
    id: 'pet-sick',
    title: '🐕 Pet Emergency!',
    description: 'Your dog ate something bad and needs to go to the vet! The vet bill is $50. You have $40 in savings and $20 in cash.',
    conceptTags: ['emergency_expense', 'needs', 'debt'],
    category: 'emergency',
    choices: [
      {
        id: 'use-both',
        label: 'Use all savings + some cash',
        effects: { savings: -40, cash: -10, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'Your dog is healthy again! You used savings and cash for this important need.'
      },
      {
        id: 'borrow-some',
        label: 'Use savings + borrow the rest',
        effects: { savings: -40, debt: 10, wellbeing: 5 },
        wisdomTag: 'neutral',
        outcomeText: 'Dog is okay! You used savings and borrowed $10. Remember to pay it back.'
      },
      {
        id: 'wait-hope',
        label: 'Wait and hope the dog gets better',
        effects: { wellbeing: -25 },
        wisdomTag: 'risky',
        outcomeText: 'Your dog got worse and now needs even MORE expensive treatment. Emergencies need action!'
      }
    ],
    bonusQuestion: {
      id: 'bq-vet',
      questionText: 'An unexpected expense you didn\'t plan for is called a(n):',
      answerType: 'mcq',
      options: ['Discount', 'Emergency expense', 'Income', 'Fixed expense'],
      correctAnswer: 'Emergency expense',
      conceptTags: ['emergency_expense', 'expense_types'],
      bonusReward: 5
    }
  },
  // OPPORTUNITY CARDS
  {
    id: 'babysitting-gig',
    title: '👶 Babysitting Opportunity!',
    description: 'Your neighbor offers to pay you $20 to babysit on Saturday. But your friends are going to the arcade that day.',
    conceptTags: ['income', 'opportunity_cost', 'decisions'],
    category: 'opportunity',
    choices: [
      {
        id: 'babysit',
        label: 'Take the babysitting job',
        effects: { cash: 20, wellbeing: -5 },
        wisdomTag: 'wise',
        outcomeText: 'You earned $20! Your friends missed you, but your wallet is happy.'
      },
      {
        id: 'arcade',
        label: 'Go to the arcade with friends',
        effects: { cash: -10, wellbeing: 15 },
        wisdomTag: 'neutral',
        outcomeText: 'Great time with friends! But you spent $10 and missed earning $20.'
      },
      {
        id: 'both',
        label: 'Babysit in the morning, arcade after',
        effects: { cash: 10, wellbeing: 10 },
        wisdomTag: 'wise',
        outcomeText: 'You negotiated a shorter babysitting shift for $10, then joined friends. Nice balance!'
      }
    ],
    bonusQuestion: {
      id: 'bq-babysit',
      questionText: 'If you babysit for $20 but miss out on arcade fun, the arcade fun is your:',
      answerType: 'mcq',
      options: ['Profit', 'Opportunity cost', 'Savings', 'Debt'],
      correctAnswer: 'Opportunity cost',
      conceptTags: ['opportunity_cost'],
      bonusReward: 5
    }
  },
  {
    id: 'garage-sale',
    title: '🏠 Garage Sale Finds!',
    description: 'There\'s a neighborhood garage sale! You could sell your old toys for cash, or buy cool used stuff cheap.',
    conceptTags: ['income', 'saving_vs_spending', 'decisions'],
    category: 'opportunity',
    choices: [
      {
        id: 'sell-only',
        label: 'Sell old toys, don\'t buy anything',
        effects: { cash: 15, wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'You made $15 selling old toys! Less clutter, more cash.'
      },
      {
        id: 'sell-and-buy',
        label: 'Sell toys and buy a few things',
        effects: { cash: 5, wellbeing: 10 },
        wisdomTag: 'neutral',
        outcomeText: 'You sold $15 worth and bought $10 of used stuff. Net gain: $5 and some cool finds!'
      },
      {
        id: 'buy-only',
        label: 'Buy cool used stuff',
        effects: { cash: -20, wellbeing: 8 },
        wisdomTag: 'risky',
        outcomeText: 'You found great deals but spent $20. Your room has more stuff now!'
      }
    ],
    bonusQuestion: {
      id: 'bq-garage',
      questionText: 'Selling your old items to make money is earning:',
      answerType: 'mcq',
      options: ['Debt', 'Revenue', 'Tax', 'Interest'],
      correctAnswer: 'Revenue',
      conceptTags: ['revenue', 'income'],
      bonusReward: 5
    }
  },
  // LIFESTYLE CARDS
  {
    id: 'lunch-choice',
    title: '🍕 Lunch Decisions',
    description: 'At school, you can buy lunch for $5 or you brought a lunch from home. Your friend wants you to buy pizza with them.',
    conceptTags: ['saving_vs_spending', 'peer_pressure', 'budgeting'],
    category: 'lifestyle',
    choices: [
      {
        id: 'packed-lunch',
        label: 'Eat my packed lunch',
        effects: { wellbeing: 0 },
        wisdomTag: 'wise',
        outcomeText: 'You saved $5 by eating what you brought. Smart and still tasty!'
      },
      {
        id: 'buy-pizza',
        label: 'Buy pizza with my friend',
        effects: { cash: -5, wellbeing: 8 },
        wisdomTag: 'neutral',
        outcomeText: 'Pizza with friends is fun! But that\'s $5 you could have saved.'
      },
      {
        id: 'buy-extra',
        label: 'Buy pizza AND dessert',
        effects: { cash: -8, wellbeing: 10 },
        wisdomTag: 'risky',
        outcomeText: 'Yummy feast! But $8 on lunch? That adds up over time.'
      }
    ],
    bonusQuestion: {
      id: 'bq-lunch',
      questionText: 'If you buy lunch for $5 every day for 5 days, how much do you spend?',
      answerType: 'numeric',
      correctAnswer: '25',
      conceptTags: ['budgeting', 'expenses'],
      bonusReward: 5
    }
  },
  {
    id: 'streaming-service',
    title: '📺 Streaming Service',
    description: 'A new streaming service has shows you love! It costs $10/month. You could share an account with a friend for $5/month each.',
    conceptTags: ['expenses', 'fixed_expenses', 'budgeting'],
    category: 'lifestyle',
    choices: [
      {
        id: 'skip',
        label: 'Skip it - I have enough entertainment',
        effects: { wellbeing: -5 },
        wisdomTag: 'wise',
        outcomeText: 'You resisted! Your budget stays the same, and free options exist.'
      },
      {
        id: 'share',
        label: 'Split with a friend ($5/month)',
        effects: { cash: -5, wellbeing: 10 },
        wisdomTag: 'wise',
        outcomeText: 'Smart! You get the shows for half the price by sharing.'
      },
      {
        id: 'own-account',
        label: 'Get my own account ($10/month)',
        effects: { cash: -10, wellbeing: 10 },
        wisdomTag: 'neutral',
        outcomeText: 'Full access! But $10/month is a recurring expense to track.'
      }
    ],
    bonusQuestion: {
      id: 'bq-streaming',
      questionText: 'A $10/month subscription is what type of expense?',
      answerType: 'mcq',
      options: ['Variable', 'Periodic', 'Fixed', 'Emergency'],
      correctAnswer: 'Fixed',
      conceptTags: ['fixed_expenses', 'expense_types'],
      bonusReward: 5
    }
  },
  {
    id: 'savings-goal',
    title: '🎯 Savings Goal!',
    description: 'You\'ve been saving for a $100 skateboard. You have $85 saved. A friend offers to sell their used board for $60.',
    conceptTags: ['goals', 'saving_vs_spending', 'decisions'],
    category: 'lifestyle',
    choices: [
      {
        id: 'keep-saving',
        label: 'Keep saving for the new one',
        effects: { wellbeing: 5 },
        wisdomTag: 'wise',
        outcomeText: 'You stayed focused on your goal! Just $15 more to go.'
      },
      {
        id: 'buy-used',
        label: 'Buy the used board for $60',
        effects: { savings: -60, wellbeing: 12 },
        wisdomTag: 'wise',
        outcomeText: 'Great deal! You got a skateboard AND have $25 left in savings.'
      },
      {
        id: 'buy-both',
        label: 'Buy used now, save for new later',
        effects: { savings: -60, wellbeing: 10 },
        wisdomTag: 'neutral',
        outcomeText: 'You have a board now and can save up for an upgrade later!'
      }
    ],
    bonusQuestion: {
      id: 'bq-goal',
      questionText: 'If you need $100 and have $85, how much more do you need?',
      answerType: 'numeric',
      correctAnswer: '15',
      conceptTags: ['budgeting', 'goals'],
      bonusReward: 5
    }
  }
]

// Get a shuffled subset of story cards for a game
export function getGameStoryCards(count: number = 12): StoryCard[] {
  const shuffled = [...STORY_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Get story card by ID
export function getStoryCard(id: string): StoryCard | undefined {
  return STORY_CARDS.find(card => card.id === id)
}

