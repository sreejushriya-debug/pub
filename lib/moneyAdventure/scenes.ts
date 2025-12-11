import { Scene, GameState, getThemeItem } from './types'

// CHAPTER 1: "New Goal, New Jar"
export const CHAPTER_1_SCENES: Scene[] = [
  {
    id: 'ch1-scene1',
    chapter: 1,
    sceneNumber: 1,
    title: 'Big Goal Decision',
    conceptTags: ['big_goal', 'saving_vs_spending', 'needs_vs_wants'],
    getStory: (state) => `You're in your room, looking at pictures of your dream ${state.bigGoal.name}. It costs $${state.bigGoal.cost} - that seems like a lot!\n\nYour parent walks in with good news: "Starting this week, you'll get a $10 weekly allowance for helping with chores!"\n\nYou start thinking about how to handle this money. Your ${state.bigGoal.name} won't buy itself...`,
    choices: [
      {
        id: 'save-all',
        label: "I'll save ALL my allowance for my big goal!",
        effects: { savings: 10, saverScore: 2, plannerScore: 1, wellbeing: 2, totalSaved: 10 },
        outcomeText: "Amazing dedication! You put all $10 straight into savings. Your goal tracker jumps up. It feels good to see progress!"
      },
      {
        id: 'save-half',
        label: "I'll save half and keep half to spend.",
        effects: { savings: 5, cash: 5, saverScore: 1, plannerScore: 1, wellbeing: 3, totalSaved: 5 },
        outcomeText: "Smart balance! You save $5 and keep $5 for yourself. You're making progress AND have some spending money."
      },
      {
        id: 'spend-most',
        label: "I want to spend most of it now, save a tiny bit.",
        effects: { savings: 2, cash: 8, saverScore: -1, riskScore: 1, wellbeing: 4, totalSaved: 2 },
        outcomeText: "You keep $8 to spend and save just $2. It feels great having cash in your pocket! But your goal seems far away..."
      }
    ],
    challenge: {
      id: 'ch1-q1',
      type: 'numeric',
      questionText: "Your allowance is $10. If you save half, how much do you save?",
      correctAnswer: '5',
      conceptTags: ['saving_vs_spending', 'fractions_to_money'],
      bonusReward: 3
    }
  },
  {
    id: 'ch1-scene2',
    chapter: 1,
    sceneNumber: 2,
    title: 'Snack Stand Temptation',
    conceptTags: ['needs_vs_wants', 'impulse_spending'],
    getStory: (state) => `At school, you pass by a snack stand. Something catches your eye: a ${getThemeItem(state.theme, 'snack_item')}!\n\nIt costs $5. All your friends are getting one. It looks SO cool...\n\nYou have $${state.cash} in cash and $${state.savings} in savings.`,
    choices: [
      {
        id: 'buy-cash',
        label: 'Buy it now with my cash!',
        effects: { cash: -5, saverScore: -1, riskScore: 1, wellbeing: 3, totalSpentWants: 5 },
        requiresCash: 5,
        disabledReason: (state) => state.cash < 5 ? "Not enough cash!" : null,
        outcomeText: "You hand over $5 and get the cool item. Your friends think it's awesome! But your wallet feels lighter..."
      },
      {
        id: 'skip-save',
        label: 'Skip it and save for my big goal.',
        effects: { saverScore: 1, plannerScore: 1, wellbeing: 1 },
        outcomeText: "You walk past the stand. It's hard, but you remind yourself about your big goal. Your friends won't remember this item in a week anyway."
      },
      {
        id: 'buy-from-savings',
        label: 'Buy it using money from savings.',
        effects: { savings: -5, saverScore: -2, riskScore: 2, wellbeing: 2, totalSpentWants: 5 },
        requiresSavings: 5,
        disabledReason: (state) => state.savings < 5 ? "Not enough savings!" : null,
        outcomeText: "You dip into your savings for this want. The item is yours! But your goal tracker goes backwards a bit..."
      }
    ],
    challenge: {
      id: 'ch1-q2',
      type: 'mcq',
      questionText: (state) => `Is a ${getThemeItem(state.theme, 'snack_item')} a need or a want?`,
      options: ['Need', 'Want'],
      correctAnswer: 'Want',
      conceptTags: ['needs_vs_wants'],
      bonusReward: 3
    }
  },
  {
    id: 'ch1-scene3',
    chapter: 1,
    sceneNumber: 3,
    title: 'Movie Night Invite',
    conceptTags: ['opportunity_cost', 'saving_vs_spending'],
    getStory: (state) => `Your best friend texts you: "Movie night this weekend! Everyone's going. Tickets + snacks = $12. You coming?"\n\nYou check your money:\n• Cash: $${state.cash}\n• Savings: $${state.savings}\n\nAll your friends will be there. But that's money that could go toward your ${state.bigGoal.name}...`,
    choices: [
      {
        id: 'go-cash',
        label: 'Go to the movie, pay with cash.',
        effects: { cash: -12, wellbeing: 5, saverScore: -1, totalSpentWants: 12 },
        requiresCash: 12,
        disabledReason: (state) => state.cash < 12 ? `Only have $${state.cash} cash` : null,
        outcomeText: "Movie night was amazing! You laughed with friends and made great memories. Worth every penny... right?"
      },
      {
        id: 'go-savings',
        label: 'Go to the movie, pull from savings.',
        effects: { savings: -12, wellbeing: 3, saverScore: -3, riskScore: 2, totalSpentWants: 12 },
        requiresSavings: 12,
        disabledReason: (state) => state.savings < 12 ? `Only have $${state.savings} savings` : null,
        outcomeText: "You went to the movie using savings money. Fun time, but your goal feels further away now."
      },
      {
        id: 'skip-save',
        label: 'Skip the movie and add $5 to savings.',
        effects: { savings: 5, wellbeing: -1, saverScore: 2, plannerScore: 1, totalSaved: 5 },
        outcomeText: "You stayed home and added $5 to savings. FOMO hurts a little, but watching your savings grow feels good too."
      }
    ],
    challenge: {
      id: 'ch1-q3',
      type: 'numeric',
      questionText: (state) => `If your big goal costs $${state.bigGoal.cost} and you have saved $${state.savings} so far, how much more do you need?`,
      correctAnswer: (state) => String(state.bigGoal.cost - state.savings),
      conceptTags: ['saving_goal_math'],
      bonusReward: 5
    }
  },
  {
    id: 'ch1-scene4',
    chapter: 1,
    sceneNumber: 4,
    title: 'End of Month Reflection',
    conceptTags: ['saving_habit', 'self_reflection'],
    getStory: (state) => `It's the end of your first month with an allowance!\n\nYour parent sits down with you: "Let's see how you did with your money this month."\n\n📊 Your Money:\n• Cash: $${state.cash}\n• Savings: $${state.savings}\n• Goal: $${state.bigGoal.cost} for ${state.bigGoal.name}\n\nYou're ${Math.round((state.savings / state.bigGoal.cost) * 100)}% of the way to your goal!`,
    choices: [
      {
        id: 'proud',
        label: "I'm proud of my progress!",
        effects: { wellbeing: 3, plannerScore: 1 },
        outcomeText: "Your parent smiles. \"You're learning great money habits! Keep it up.\""
      },
      {
        id: 'could-do-better',
        label: "I think I could do better next month.",
        effects: { wellbeing: 1, plannerScore: 2 },
        outcomeText: "\"That's a great attitude,\" your parent says. \"Learning from our choices is how we grow!\""
      }
    ],
    openEndedPrompt: {
      prompt: "Do you think you are on track to reach your big goal so far? Why or why not?",
      rubric: "References their savings vs goal amount and shows reasoning about their progress"
    },
    nextScene: () => ({ chapter: 2, scene: 1 })
  }
]

// CHAPTER 2: "Budget Builder"
export const CHAPTER_2_SCENES: Scene[] = [
  {
    id: 'ch2-scene1',
    chapter: 2,
    sceneNumber: 1,
    title: 'Chore Chart + Paycheck',
    conceptTags: ['income', 'budget_categories'],
    getStory: (state) => `Great news! You took on extra chores and a small job helping your neighbor.\n\nYou just got paid $30 for the week! 💰\n\nNow you need to decide how to split this money into three categories:\n• Needs (helping family, school supplies)\n• Wants (fun stuff)\n• Savings (for your ${state.bigGoal.name})`,
    choices: [
      {
        id: 'heavy-savings',
        label: 'Needs $5 / Wants $5 / Savings $20',
        effects: { cash: 10, savings: 20, saverScore: 2, plannerScore: 2, totalEarned: 30, totalSaved: 20, totalSpentNeeds: 5 },
        outcomeText: "Wow, $20 to savings! You're serious about that goal. Your savings jumps up nicely!"
      },
      {
        id: 'balanced',
        label: 'Needs $5 / Wants $15 / Savings $10',
        effects: { cash: 20, savings: 10, plannerScore: 1, riskScore: 1, totalEarned: 30, totalSaved: 10, totalSpentNeeds: 5 },
        outcomeText: "A balanced split! You have money for fun AND you're still saving. Not bad!"
      },
      {
        id: 'heavy-wants',
        label: 'Needs $5 / Wants $20 / Savings $5',
        effects: { cash: 25, savings: 5, saverScore: -1, riskScore: 2, totalEarned: 30, totalSaved: 5, totalSpentNeeds: 5 },
        outcomeText: "Lots of money for wants! You'll have fun this week. But your goal isn't growing much..."
      }
    ],
    challenge: {
      id: 'ch2-q1',
      type: 'mcq',
      questionText: "In a good budget, which category should usually get the LEAST money?",
      options: ['Needs', 'Wants', 'Savings'],
      correctAnswer: 'Wants',
      conceptTags: ['budget_categories'],
      bonusReward: 5
    }
  },
  {
    id: 'ch2-scene2',
    chapter: 2,
    sceneNumber: 2,
    title: 'Impulse at the Mall',
    conceptTags: ['budget_vs_impulse', 'wants_vs_goal'],
    getStory: (state) => `You're at the mall and see it: ${getThemeItem(state.theme, 'want_item')} - ON SALE!\n\n🏷️ Regular price: $60\n🏷️ Sale price: $40\n\nBut you only budgeted $10 for wants this week...\n\nYou have $${state.cash} cash and $${state.savings} in savings.`,
    choices: [
      {
        id: 'stick-budget',
        label: 'Stick to my budget and skip it.',
        effects: { plannerScore: 2, saverScore: 1, wellbeing: 1 },
        outcomeText: "You walk away. It's hard! But you remind yourself: \"Sales happen all the time. My goal matters more.\""
      },
      {
        id: 'raid-savings',
        label: 'Move $30 from savings to buy it.',
        effects: { savings: -30, cash: -10, saverScore: -3, riskScore: 2, wellbeing: 4, totalSpentWants: 40 },
        requiresSavings: 30,
        disabledReason: (state) => state.savings < 30 || state.cash < 10 ? "Not enough money!" : null,
        outcomeText: "You got it! But your savings took a big hit. Your goal tracker drops significantly..."
      },
      {
        id: 'borrow',
        label: 'Ask parents to cover the difference (owe them).',
        effects: { cash: -10, debt: 30, riskScore: 3, saverScore: -2, wellbeing: 3, totalSpentWants: 40 },
        requiresCash: 10,
        disabledReason: (state) => state.cash < 10 ? "Not enough cash!" : null,
        outcomeText: "Your parents help out, but now you owe them $30. That's debt you'll need to pay back..."
      }
    ],
    challenge: {
      id: 'ch2-q2',
      type: 'open_ended',
      questionText: "Your budget set $10 for wants and $20 for savings. Why is it risky to move money from savings to wants for one item?",
      correctAnswer: 'any',
      conceptTags: ['budget_vs_impulse', 'saving_vs_spending'],
      rubric: "Mentions slowing down goal progress, less emergency cushion, or breaking budget discipline"
    }
  },
  {
    id: 'ch2-scene3',
    chapter: 2,
    sceneNumber: 3,
    title: 'Simple Budget Check',
    conceptTags: ['budget_balancing', 'leftover_money'],
    getStory: () => `Time to review your monthly budget!\n\n📋 Monthly Budget:\n• Income: $100\n• Needs: $40\n• Wants: $30\n• Savings: $20\n• Leftover: ???\n\nWait... there's money left over! What should you do with it?`,
    choices: [
      {
        id: 'leftover-savings',
        label: 'Add leftover $10 to savings!',
        effects: { savings: 10, saverScore: 2, plannerScore: 1, totalSaved: 10 },
        outcomeText: "Smart choice! That extra $10 goes straight to your goal. Every dollar counts!"
      },
      {
        id: 'leftover-wants',
        label: 'Add leftover $10 to wants!',
        effects: { cash: 10, saverScore: -1, riskScore: 1 },
        outcomeText: "More spending money! You'll have extra fun this month. Just don't make it a habit..."
      },
      {
        id: 'leftover-split',
        label: 'Split it: $5 savings, $5 wants.',
        effects: { savings: 5, cash: 5, saverScore: 1, plannerScore: 1, totalSaved: 5 },
        outcomeText: "A balanced approach! Half to your goal, half for fun. That's compromise."
      }
    ],
    challenge: {
      id: 'ch2-q3',
      type: 'numeric',
      questionText: "If your income is $100 and you spend $40 on needs, $30 on wants, and $20 on savings, how much is left over?",
      correctAnswer: '10',
      conceptTags: ['budget_balancing', 'leftover_money'],
      bonusReward: 5
    }
  },
  {
    id: 'ch2-scene4',
    chapter: 2,
    sceneNumber: 4,
    title: 'Halfway Check',
    conceptTags: ['goal_progress', 'planning_ahead'],
    getStory: (state) => {
      const progress = Math.round((state.savings / state.bigGoal.cost) * 100)
      const onTrack = progress >= 40
      const flavorText = state.saverScore >= 4 
        ? "You're doing an amazing job staying on track! Your discipline is paying off."
        : state.riskScore >= 4
          ? "You've had some fun, but your savings is behind schedule. Time to focus!"
          : "You're making progress, but there's room to improve."
      
      return `We're halfway through your money journey!\n\n📊 Goal Progress:\n• ${state.bigGoal.name}: $${state.bigGoal.cost}\n• Your Savings: $${state.savings}\n• Progress: ${progress}%\n\n${onTrack ? "✅ " : "⚠️ "}${flavorText}`
    },
    choices: [
      {
        id: 'recommit',
        label: "I'm going to save more in the next chapter!",
        effects: { plannerScore: 2, wellbeing: 2 },
        outcomeText: "That's the spirit! Setting intentions helps you stay focused."
      },
      {
        id: 'keep-going',
        label: "I'll keep doing what I'm doing.",
        effects: { plannerScore: 1 },
        outcomeText: "Steady as she goes! Consistency is key."
      }
    ],
    openEndedPrompt: {
      prompt: "What is one change you could make in the next chapter to get closer to your goal?",
      rubric: "Mentions a specific, actionable change like 'save more allowance', 'skip unnecessary wants', or 'earn extra money'"
    },
    nextScene: () => ({ chapter: 3, scene: 1 })
  }
]

// CHAPTER 3: "Uh-Oh & Side Hustles"  
export const CHAPTER_3_SCENES: Scene[] = [
  {
    id: 'ch3-scene1',
    chapter: 3,
    sceneNumber: 1,
    title: 'The Emergency',
    conceptTags: ['emergency_expense', 'importance_of_savings'],
    getStory: (state) => {
      const emergencyText: Record<string, string> = {
        'bike': "Your bike's tire went flat AND the chain broke! 🚲💥",
        'tablet': "Your tablet's screen protector cracked and needs replacing! 💻💔",
        'camp': "The summer camp requires an early deposit payment! 🏕️📋",
        'business': "Some of your business supplies got damaged! 💼😱"
      }
      return `Oh no! ${emergencyText[state.bigGoal.id] || "Something expensive broke!"}\n\n💸 Emergency cost: $50\n\nYou have:\n• Cash: $${state.cash}\n• Savings: $${state.savings}\n\nThis is exactly why people say to have savings for emergencies!`
    },
    choices: [
      {
        id: 'use-savings',
        label: 'Use savings to cover it.',
        effects: { savings: -50, saverScore: 1, totalSpentNeeds: 50 },
        requiresSavings: 50,
        disabledReason: (state) => state.savings < 50 ? `Only have $${state.savings} in savings` : null,
        outcomeText: "You dip into savings. It hurts to see that number go down, but this is exactly what savings are for - emergencies!"
      },
      {
        id: 'split',
        label: 'Split: some savings, some cash.',
        effects: { savings: -30, cash: -20, plannerScore: 1, totalSpentNeeds: 50 },
        disabledReason: (state) => (state.savings < 30 || state.cash < 20) ? "Not enough money to split!" : null,
        outcomeText: "You use $30 from savings and $20 cash. Smart to spread it out!"
      },
      {
        id: 'borrow',
        label: 'Borrow $50 and keep savings safe.',
        effects: { debt: 50, riskScore: 3, saverScore: -1, totalBorrowed: 50 },
        outcomeText: "You borrow the money. Your savings stays intact, but now you have $50 of debt to pay back... with interest!"
      }
    ],
    challenge: {
      id: 'ch3-q1',
      type: 'open_ended',
      questionText: "Why do people say it's important to have an emergency fund?",
      correctAnswer: 'any',
      conceptTags: ['emergency_expense', 'importance_of_savings'],
      rubric: "Mentions avoiding debt, handling unexpected costs, or not derailing goals"
    }
  },
  {
    id: 'ch3-scene2',
    chapter: 3,
    sceneNumber: 2,
    title: 'Mini Business Idea',
    conceptTags: ['business_income', 'profit_loss'],
    getStory: (state) => `You have an idea! What if you started a mini business to earn extra money?\n\n💡 Business idea: ${getThemeItem(state.theme, 'business')}\n\n📊 The plan:\n• Supplies cost: $30\n• Expected sales: $70\n• Potential profit: ???\n\nYou have $${state.cash} in cash. Starting a business is exciting, but it takes work!`,
    choices: [
      {
        id: 'start-business',
        label: 'Yes! Start the mini business ($30 supplies).',
        effects: { cash: -30, plannerScore: 1, riskScore: 1 },
        requiresCash: 30,
        disabledReason: (state) => state.cash < 30 ? `Need $30 cash to start!` : null,
        outcomeText: (state) => {
          return "You're in business! You buy supplies for $30 and get to work. After lots of effort... you sell $70 worth! Let's calculate your profit..."
        }
      },
      {
        id: 'skip-business',
        label: 'No, stick with chores and allowance.',
        effects: {},
        outcomeText: "You decide to keep things simple. Chores and allowance are reliable income without the extra stress."
      }
    ],
    challenge: {
      id: 'ch3-q2',
      type: 'numeric',
      questionText: "You spent $30 on supplies and earned $70 in sales. What is your profit?",
      correctAnswer: '40',
      conceptTags: ['profit_loss', 'revenue', 'expenses'],
      bonusReward: 10
    }
  },
  {
    id: 'ch3-scene3',
    chapter: 3,
    sceneNumber: 3,
    title: 'Business Burnout?',
    conceptTags: ['tradeoffs', 'time_value'],
    getStory: (state) => state.hasBusiness 
      ? `Your business is going well, but you're TIRED. 😩\n\nSchool + chores + business = a LOT of work.\n\nYou need to decide what to do...`
      : `You've been working hard with your chores and allowance.\n\nYou could take on MORE work for extra money, or keep a healthy balance.\n\nWhat feels right?`,
    choices: [
      {
        id: 'keep-small',
        label: (state) => state.hasBusiness ? 'Keep business but do fewer orders (less money, less stress).' : 'Keep current workload - balance is good!',
        effects: { wellbeing: 3, plannerScore: 1, cash: 20 },
        outcomeText: "You find a healthy balance. Less money than going all-out, but you're happier and less stressed!"
      },
      {
        id: 'go-all-in',
        label: (state) => state.hasBusiness ? 'Go all in on the business for maximum money!' : 'Take on extra work for more money!',
        effects: { wellbeing: -5, riskScore: 2, saverScore: 1, cash: 50 },
        outcomeText: "You work HARD and earn a lot! But you're exhausted and stressed. Money isn't everything..."
      },
      {
        id: 'shutdown',
        label: (state) => state.hasBusiness ? 'Shut down the business and rest.' : 'Actually, I want to do LESS work.',
        effects: { wellbeing: 8, plannerScore: -1 },
        outcomeText: "You take a break. Your wellbeing improves a lot! But you won't have that extra income..."
      }
    ],
    challenge: {
      id: 'ch3-q3',
      type: 'open_ended',
      questionText: "Is there such a thing as 'too much work'? How can it affect your money AND your wellbeing?",
      correctAnswer: 'any',
      conceptTags: ['tradeoffs', 'time_value', 'wellbeing'],
      rubric: "Mentions burnout, stress affecting performance, or balance between money and happiness"
    }
  },
  {
    id: 'ch3-scene4',
    chapter: 3,
    sceneNumber: 4,
    title: 'Debt Check',
    conceptTags: ['debt', 'interest_basic'],
    getStory: (state) => state.debt > 0
      ? `Time to face your debt! 😬\n\n💳 You currently owe: $${state.debt}\n\n⚠️ Warning: If you don't pay it off, interest will make it grow to $${state.debt + 5} next month!\n\nYou have $${state.cash} cash and $${state.savings} savings.`
      : `You check in on your finances and feel relieved.\n\n✅ Debt: $0!\n\nSome of your friends borrowed money and are stressed about paying it back. But not you - you're debt-free!\n\nThat's something to be proud of.`,
    choices: state => state.debt > 0 ? [
      {
        id: 'pay-all',
        label: `Pay off all $${state.debt} now!`,
        effects: { debt: -state.debt, cash: -Math.min(state.cash, state.debt), savings: -Math.max(0, state.debt - state.cash), riskScore: -2, plannerScore: 2 },
        disabledReason: (s) => (s.cash + s.savings) < s.debt ? "Not enough money to pay it all!" : null,
        outcomeText: "Debt GONE! It took some of your money, but you're free from that weight. No interest to worry about!"
      },
      {
        id: 'pay-some',
        label: 'Pay half now, deal with rest later.',
        effects: { debt: -Math.floor(state.debt / 2), cash: -Math.floor(state.debt / 2), riskScore: 1, plannerScore: -1 },
        disabledReason: (s) => s.cash < Math.floor(s.debt / 2) ? "Not enough cash!" : null,
        outcomeText: "You pay off half. Better than nothing! But the remaining debt will still grow with interest..."
      },
      {
        id: 'ignore',
        label: 'Ignore it for now...',
        effects: { debt: 5, riskScore: 2, plannerScore: -2 },
        outcomeText: "You put it off. But debt doesn't disappear - it GROWS. You now owe $5 more in interest!"
      }
    ] : [
      {
        id: 'stay-debt-free',
        label: "I'll keep avoiding debt!",
        effects: { plannerScore: 1, wellbeing: 2 },
        outcomeText: "Great mindset! Staying debt-free gives you freedom and peace of mind."
      }
    ],
    challenge: {
      id: 'ch3-q4',
      type: 'mcq',
      questionText: "What is 'interest' when it comes to borrowing money?",
      options: [
        'Extra money you have to pay back on top of what you borrowed.',
        'The money you start with.',
        'Free money from the bank.'
      ],
      correctAnswer: 'Extra money you have to pay back on top of what you borrowed.',
      conceptTags: ['interest', 'debt'],
      bonusReward: 5
    },
    nextScene: () => ({ chapter: 4, scene: 1 })
  }
]

// CHAPTER 4: "The Big Decision"
export const CHAPTER_4_SCENES: Scene[] = [
  {
    id: 'ch4-scene1',
    chapter: 4,
    sceneNumber: 1,
    title: 'Goal Checkpoint',
    conceptTags: ['goal_progress', 'decision_making'],
    getStory: (state) => {
      const totalMoney = state.cash + state.savings
      const goalCost = state.bigGoal.cost
      const hasEnoughWithCushion = totalMoney >= goalCost + 20
      const hasExactly = totalMoney >= goalCost && totalMoney < goalCost + 20
      const notEnough = totalMoney < goalCost
      
      let statusText = ''
      if (hasEnoughWithCushion) {
        statusText = "🎉 AMAZING! You can buy your goal AND have money left over!"
      } else if (hasExactly) {
        statusText = "😊 You can buy your goal, but you'll have almost nothing left."
      } else {
        statusText = `😔 You're $${goalCost - totalMoney} short of your goal.`
      }
      
      return `The moment of truth! Let's see if you reached your ${state.bigGoal.name} goal.\n\n📊 Final Numbers:\n• Goal Cost: $${goalCost}\n• Your Cash: $${state.cash}\n• Your Savings: $${state.savings}\n• Your Debt: $${state.debt}\n• Total Available: $${totalMoney}\n\n${statusText}`
    },
    choices: (state) => {
      const totalMoney = state.cash + state.savings
      const goalCost = state.bigGoal.cost
      const gap = goalCost - totalMoney
      
      if (totalMoney >= goalCost + 20) {
        // Path A: Enough with cushion
        return [
          {
            id: 'buy-keep-cushion',
            label: `Buy the ${state.bigGoal.name} and keep some savings!`,
            effects: { savings: -goalCost, wellbeing: 10, saverScore: 2 },
            outcomeText: `You did it! You buy your ${state.bigGoal.name} AND still have money saved. This is the best outcome!`
          },
          {
            id: 'wait-more',
            label: 'Wait a little longer to save even MORE.',
            effects: { saverScore: 1, plannerScore: 1 },
            outcomeText: "You decide to wait. Patience and discipline! Your future self will have even more options."
          }
        ]
      } else if (totalMoney >= goalCost) {
        // Path B: Exactly enough
        return [
          {
            id: 'buy-no-cushion',
            label: `Buy it even though I'll have no cushion.`,
            effects: { cash: -state.cash, savings: -(goalCost - state.cash), wellbeing: 8, saverScore: 1, riskScore: 1 },
            outcomeText: `You get your ${state.bigGoal.name}! But your accounts are nearly empty. One emergency could be trouble...`
          },
          {
            id: 'wait-safer',
            label: 'Wait and save a bit more to feel safer.',
            effects: { saverScore: 2, plannerScore: 1 },
            outcomeText: "You decide to wait for a safety cushion. Smart thinking about the future!"
          }
        ]
      } else {
        // Path C: Not enough
        return [
          {
            id: 'borrow-rest',
            label: `Borrow $${gap} to buy it anyway.`,
            effects: { debt: gap, cash: -state.cash, savings: -state.savings, wellbeing: 5, riskScore: 3, totalBorrowed: gap },
            outcomeText: `You borrow $${gap} and get your ${state.bigGoal.name}! But now you have debt to pay back with interest...`
          },
          {
            id: 'new-plan',
            label: "Don't buy it yet. Make a new plan.",
            effects: { saverScore: 2, plannerScore: 2 },
            outcomeText: "You accept that you're not quite there yet. But you learned SO much! Next time, you'll make it."
          }
        ]
      }
    }
  },
  {
    id: 'ch4-scene2',
    chapter: 4,
    sceneNumber: 2,
    title: 'Where Did Your Money Go?',
    conceptTags: ['reflection', 'category_review'],
    getStory: (state) => `Let's look at your complete money journey!\n\n💰 Money Map:\n• Total Earned: ~$${state.totalEarned + 100}\n• Spent on Needs: ~$${state.totalSpentNeeds + 50}\n• Spent on Wants: ~$${state.totalSpentWants}\n• Put into Savings: ~$${state.totalSaved}\n• Borrowed: $${state.totalBorrowed}\n• Current Debt: $${state.debt}\n\nEvery choice told a story about what you value!`,
    choices: [
      {
        id: 'reflect-proud',
        label: "I'm proud of my journey!",
        effects: { wellbeing: 3 },
        outcomeText: "You should be! Money skills take time to learn, and you've come so far."
      },
      {
        id: 'reflect-learn',
        label: "I learned a lot about myself.",
        effects: { plannerScore: 1 },
        outcomeText: "Self-awareness is the first step to growth. You know your strengths and weaknesses now!"
      }
    ],
    openEndedPrompt: {
      prompt: "If you could replay one decision from Money Adventure, which one would you change and why?",
      rubric: "References a specific decision and gives reasoning about why they'd change it"
    }
  },
  {
    id: 'ch4-scene3',
    chapter: 4,
    sceneNumber: 3,
    title: 'Your Ending',
    conceptTags: ['ending', 'summary'],
    getStory: () => `Your Money Adventure has come to an end!\n\nLet's see what kind of money manager you became...`,
    choices: [
      {
        id: 'see-ending',
        label: 'Show me my ending!',
        effects: {},
        outcomeText: ""
      }
    ],
    nextScene: () => 'end'
  }
]

// Get all scenes
export function getAllScenes(): Scene[] {
  return [...CHAPTER_1_SCENES, ...CHAPTER_2_SCENES, ...CHAPTER_3_SCENES, ...CHAPTER_4_SCENES]
}

// Get scene by chapter and scene number
export function getScene(chapter: number, sceneNum: number): Scene | undefined {
  const allScenes = getAllScenes()
  return allScenes.find(s => s.chapter === chapter && s.sceneNumber === sceneNum)
}

// Get chapter title
export function getChapterTitle(chapter: number): string {
  const titles: Record<number, string> = {
    1: 'New Goal, New Jar',
    2: 'Budget Builder',
    3: 'Uh-Oh & Side Hustles',
    4: 'The Big Decision'
  }
  return titles[chapter] || 'Unknown Chapter'
}


