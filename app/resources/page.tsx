'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Library, Download, BookOpen, FileText, Play, ChevronDown, ChevronUp,
  ExternalLink, Search, Video, ArrowRight, GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import FloatingParticles from '@/components/FloatingParticles'

// Video URLs
const VIDEO_URLS = {
  walkthrough: 'https://www.youtube.com/embed/i1qZ7nmBEOo',
  '1.1': 'https://www.youtube.com/embed/h2g8iOKdtnc',
  '1.3': 'https://www.youtube.com/embed/8pEPhilfwLU',
  '2.1': 'https://www.youtube.com/embed/hSc_nJ4DF50',
  '3.1': 'https://www.youtube.com/embed/PxH38Ma6vBQ',
  '3.4': 'https://www.youtube.com/embed/UGCDt28mSWM',
  '3.5': 'https://www.youtube.com/embed/TAjNGLzHsh8',
  '4.1': 'https://www.youtube.com/embed/_msOo6m5Vl4',
  '5.1': 'https://www.youtube.com/embed/I_0yZqnvmyQ',
}

// Quiz URLs
const QUIZ_URLS = {
  module1: 'https://wayground.com/admin/quiz/680dd81992bc16fe102c51d1/financial-literacy-quiz',
}

// Worksheet URLs (all in public/resources/)
const WORKSHEET_URLS = {
  // Workbooks & Picture Books
  workbook: '/resources/finance_workbook.pdf',
  sofia: '/resources/sofia_smart_savings.pdf',
  brian: '/resources/panaderia_de_brian.pdf',
  // Module 1
  'm1-kwl': '/resources/module1kwl.pdf',
  '1.1': '/resources/1_1.pdf',
  '1.2': '/resources/1_2.pdf',
  '1.3': '/resources/1_3.pdf',
  // Module 2
  'm2-kwl': '/resources/unit2_kwl.pdf',
  '2.1': '/resources/2_1.pdf',
  '2.2': '/resources/2_2.pdf',
  '2.3': '/resources/2_3.pdf',
  '2.4': '/resources/2_4.pdf',
  // Module 3
  'm3-kwl': '/resources/unit3_kwl.pdf',
  '3.1': '/resources/3_1.pdf',
  '3.2': '/resources/3_2.pdf',
  '3.3': '/resources/3_3.pdf',
  '3.4': '/resources/3_4.pdf',
  '3.5': '/resources/3_5.pdf',
  // Module 4
  'm4-kwl': '/resources/unit4kwl.pdf',
  '4.1': '/resources/4_1.pdf',
  '4.2': '/resources/4_2.pdf',
  '4.3': '/resources/4_3.pdf',
  '4.4': '/resources/4_4.pdf',
  '4.5': '/resources/4_5.pdf',
  '4.6': '/resources/4_6.pdf',
  // Module 5
  'm5-kwl': '/resources/unit5kwl.pdf',
  '5.1': '/resources/5_1.pdf',
  '5.2': '/resources/5_2.pdf',
  // Module 6
  '6.1': '/resources/6_1.pdf',
}

// All searchable resources
const allResources = [
  // Module 1
  { id: 'm1-kwl', name: 'Module 1 KWL', type: 'worksheet', module: 1 },
  { id: 'm1-1.1', name: 'Video 1.1: Important Financial Terms', type: 'video', module: 1 },
  { id: 'm1-w1.1', name: 'Worksheet 1.1: Matching Terms', type: 'worksheet', module: 1 },
  { id: 'm1-w1.2', name: 'Worksheet 1.2: Fill in the Blanks', type: 'worksheet', module: 1 },
  { id: 'm1-1.3', name: 'Video 1.3: Making Change', type: 'video', module: 1 },
  { id: 'm1-w1.3', name: 'Worksheet 1.3: Identifying Coins + Making Change', type: 'worksheet', module: 1 },
  { id: 'm1-quiz', name: 'Module 1 Quiz', type: 'quiz', module: 1 },
  // Module 2
  { id: 'm2-kwl', name: 'Module 2 KWL', type: 'worksheet', module: 2 },
  { id: 'm2-2.1', name: 'Video 2.1: Healthy Saving and Spending Habits', type: 'video', module: 2 },
  { id: 'm2-w2.1', name: 'Worksheet 2.1: Matching Terms', type: 'worksheet', module: 2 },
  { id: 'm2-w2.2', name: 'Worksheet 2.2: Spending Simulation', type: 'worksheet', module: 2 },
  { id: 'm2-w2.3', name: 'Worksheet 2.3: Creating a Budget', type: 'worksheet', module: 2 },
  { id: 'm2-w2.4', name: 'Worksheet 2.4: Budgeting Simulation', type: 'worksheet', module: 2 },
  // Module 3
  { id: 'm3-kwl', name: 'Module 3 KWL', type: 'worksheet', module: 3 },
  { id: 'm3-3.1', name: 'Video 3.1: Credit and Debit', type: 'video', module: 3 },
  { id: 'm3-w3.1', name: 'Worksheet 3.1: Word Scramble', type: 'worksheet', module: 3 },
  { id: 'm3-w3.2', name: 'Worksheet 3.2: Word Search', type: 'worksheet', module: 3 },
  { id: 'm3-w3.3', name: 'Worksheet 3.3: Credit Pros and Cons', type: 'worksheet', module: 3 },
  { id: 'm3-3.4', name: 'Video 3.4: Investing', type: 'video', module: 3 },
  { id: 'm3-w3.4', name: 'Worksheet 3.4: Identifying Stock Trends', type: 'worksheet', module: 3 },
  { id: 'm3-3.5', name: 'Video 3.5: Deposits', type: 'video', module: 3 },
  { id: 'm3-w3.5', name: 'Worksheet 3.5: Writing a Check', type: 'worksheet', module: 3 },
  // Module 4
  { id: 'm4-kwl', name: 'Module 4 KWL', type: 'worksheet', module: 4 },
  { id: 'm4-4.1', name: 'Video 4.1: Creating Your Own Business', type: 'video', module: 4 },
  { id: 'm4-w4.1', name: 'Worksheet 4.1: Juice Stand', type: 'worksheet', module: 4 },
  { id: 'm4-w4.2', name: 'Worksheet 4.2: Business Scenarios', type: 'worksheet', module: 4 },
  { id: 'm4-w4.3', name: 'Worksheet 4.3: Scarcity + Costs', type: 'worksheet', module: 4 },
  { id: 'm4-w4.4', name: 'Worksheet 4.4: Business Word Search', type: 'worksheet', module: 4 },
  { id: 'm4-w4.5', name: 'Worksheet 4.5: Revenue, Expenses, and Profit Word Problems', type: 'worksheet', module: 4 },
  { id: 'm4-w4.6', name: 'Worksheet 4.6: Types of Expenses', type: 'worksheet', module: 4 },
  // Module 5
  { id: 'm5-kwl', name: 'Module 5 KWL', type: 'worksheet', module: 5 },
  { id: 'm5-5.1', name: 'Video 5.1: Taxes', type: 'video', module: 5 },
  { id: 'm5-w5.2', name: 'Worksheet 5.2: What are Taxes?', type: 'worksheet', module: 5 },
  { id: 'm5-w5.3', name: 'Worksheet 5.3: Calculating Taxes', type: 'worksheet', module: 5 },
  // Module 6
  { id: 'm6-w6.1', name: 'Worksheet 6.1: Review Packet', type: 'worksheet', module: 6 },
  // Extras
  { id: 'workbook', name: 'Finance Workbook', type: 'worksheet', module: 0 },
  { id: 'sofia', name: 'Sofia\'s Smart Savings Picture Book', type: 'worksheet', module: 0 },
  { id: 'brian', name: 'Panadería de Brian Picture Book', type: 'worksheet', module: 0 },
]

const modules = [
  {
    id: 1,
    title: 'Financial Basics',
    learningTarget: 'I can define basic finance terms and apply them to scenarios and make change.',
    overview: [
      'Video 1.1: Important Financial Terms',
      'Worksheet 1.1: Matching Terms',
      'Worksheet 1.2: Fill in the Blanks',
      'Video 1.3: Making Change',
      'Worksheet 1.3: Identifying Coins + Making Change'
    ]
  },
  {
    id: 2,
    title: 'Saving and Spending',
    learningTarget: 'I can identify and make healthy saving and spending decisions as well as utilize a budget to achieve my financial goals.',
    overview: [
      'Video 2.1: Healthy Saving and Spending Habits',
      'Worksheet 2.1: Matching Terms',
      'Worksheet 2.2: Spending Simulation',
      'Worksheet 2.3: Creating a Budget',
      'Worksheet 2.4: Budgeting Simulation'
    ]
  },
  {
    id: 3,
    title: 'All Things Banking',
    learningTarget: 'I can identify the correct stock trends and I understand investments, credit versus debt, as well as deposits.',
    overview: [
      'Video 3.1: Credit and Debit',
      'Worksheet 3.1: Word Scramble',
      'Worksheet 3.2: Word Search',
      'Worksheet 3.3: Credit Pros and Cons',
      'Video 3.4: Investing',
      'Worksheet 3.4: Identifying Stock Trends',
      'Video 3.5: Deposits',
      'Worksheet 3.5: Writing a Check'
    ]
  },
  {
    id: 4,
    title: 'Business',
    learningTarget: 'I can define terms like revenue, expenses, and profit and I understand how to start a business.',
    overview: [
      'Video 4.1: Creating Your Own Business',
      'Worksheet 4.1: Juice Stand',
      'Worksheet 4.2: Business Scenarios',
      'Worksheet 4.3: Scarcity + Costs',
      'Worksheet 4.4: Business Word Search',
      'Worksheet 4.5: Profit, Expenses, and Revenue Word Problems',
      'Worksheet 4.6: Types of Expenses'
    ]
  },
  {
    id: 5,
    title: 'Taxes',
    learningTarget: 'I can calculate taxes and discounts.',
    overview: [
      'Video 5.1: Taxes',
      'Worksheet 5.2: What are Taxes?',
      'Worksheet 5.3: Calculating Taxes'
    ]
  },
  {
    id: 6,
    title: 'Summary',
    learningTarget: 'I can confidently apply the skills learned in previous modules.',
    overview: [
      'Worksheet 6.1: Review Packet'
    ]
  },
]

function ResourceSearch({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (q: string) => void }) {
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return []
    return allResources.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for worksheets, videos, or quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white
                     focus:outline-none focus:border-forest-400 focus:ring-2 
                     focus:ring-forest-100 transition-all text-lg"
        />
      </div>
      
      <AnimatePresence>
        {filteredResources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl 
                       border border-gray-100 max-h-80 overflow-y-auto z-50"
          >
            {filteredResources.map((resource) => {
              // Get the appropriate URL based on resource type and ID
              const getResourceUrl = () => {
                if (resource.type === 'video') {
                  const videoId = resource.id.replace(/^m\d+-/, '').replace(/^w/, '')
                  return VIDEO_URLS[videoId as keyof typeof VIDEO_URLS]
                }
                if (resource.type === 'quiz') {
                  return QUIZ_URLS.module1
                }
                // Worksheet
                const wsId = resource.id.replace(/^m\d+-/, '').replace(/^w/, '').replace('kwl', `-kwl`)
                if (resource.id === 'workbook') return WORKSHEET_URLS.workbook
                if (resource.id === 'sofia') return WORKSHEET_URLS.sofia
                if (resource.id === 'brian') return WORKSHEET_URLS.brian
                return WORKSHEET_URLS[wsId as keyof typeof WORKSHEET_URLS] || `/resources/${wsId.replace('.', '_')}.pdf`
              }
              const url = getResourceUrl()
              
              return (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                      ${resource.type === 'video' ? 'bg-accent-100 text-accent-600' : 
                        resource.type === 'quiz' ? 'bg-purple-100 text-purple-600' : 
                        'bg-forest-100 text-forest-600'}`}>
                      {resource.type === 'video' ? <Play className="w-5 h-5" /> : 
                       resource.type === 'quiz' ? <ExternalLink className="w-5 h-5" /> : 
                       <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{resource.name}</p>
                      <p className="text-sm text-gray-500">
                        {resource.module === 0 ? 'Extra Resource' : `Module ${resource.module}`} • {resource.type}
                      </p>
                    </div>
                  </div>
                  {url && (
                    <a 
                      href={url}
                      target={resource.type === 'quiz' ? '_blank' : undefined}
                      rel={resource.type === 'quiz' ? 'noopener noreferrer' : undefined}
                      download={resource.type === 'worksheet'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${resource.type === 'video' ? 'bg-accent-100 text-accent-700 hover:bg-accent-200' : 
                          resource.type === 'quiz' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 
                          'bg-forest-100 text-forest-700 hover:bg-forest-200'}`}
                    >
                      {resource.type === 'worksheet' ? 'Download' : resource.type === 'video' ? 'Watch' : 'Open'}
                    </a>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ModuleSection({ module }: { module: typeof modules[0] }) {
  return (
    <div id={`module-${module.id}`} className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-forest-600 to-forest-500 p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {module.id}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Module {module.id}: {module.title}</h3>
            <p className="text-white/80 mt-1">Learning Target</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-xl p-4">
          <p className="text-white">{module.learningTarget}</p>
        </div>
      </div>

      {/* KWL Section */}
      <div className="p-6 md:p-8 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-forest-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900">Module {module.id} KWL</h4>
            <a href={WORKSHEET_URLS[`m${module.id}-kwl` as keyof typeof WORKSHEET_URLS]} download 
               className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-forest-50 text-forest-700 
                          rounded-lg hover:bg-forest-100 transition-colors text-sm font-medium">
              <Download className="w-4 h-4" /> Download Worksheet
            </a>
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">How do I use it?</p>
              <p className="text-sm text-gray-600">
                Students fill out the "Know" and "Want to Know" portions of the chart before starting 
                the module, and then complete the "Learned" portion after finishing the module.
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-4 mb-2">What's the reasoning behind it?</p>
              <p className="text-sm text-gray-600">
                KWLs help students visualize the learning process and organize the information they're learning. 
                In addition, these charts help students develop effective notetaking methods at a young age. 
                KWLs also allow teachers to identify student needs and give them the opportunity to deliver 
                lessons specifically catered to learning gaps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Content based on ID */}
      {module.id === 1 && <Module1Content />}
      {module.id === 2 && <Module2Content />}
      {module.id === 3 && <Module3Content />}
      {module.id === 4 && <Module4Content />}
      {module.id === 5 && <Module5Content />}
      {module.id === 6 && <Module6Content />}
    </div>
  )
}

function VideoSection({ id, title, activities }: { id: string; title: string; activities?: string[] }) {
  return (
    <div className="p-6 md:p-8 border-b border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
          <Play className="w-6 h-6 text-accent-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-900">Video {id}: {title}</h4>
      </div>
      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
        <iframe 
          src={VIDEO_URLS[id as keyof typeof VIDEO_URLS] || VIDEO_URLS['1.1']}
          className="w-full h-full"
          allowFullScreen
          title={title}
        />
      </div>
      {activities && activities.length > 0 && (
        <div className="bg-accent-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-accent-800 mb-2">Class Activities:</p>
          <ul className="space-y-2">
            {activities.map((activity, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 flex-shrink-0" />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function WorksheetSection({ id, title, howToUse }: { id: string; title: string; howToUse: string }) {
  const worksheetId = id.replace('Worksheet ', '')
  return (
    <div className="p-6 md:p-8 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-forest-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900">{id} {title}</h4>
          <a href={WORKSHEET_URLS[worksheetId as keyof typeof WORKSHEET_URLS] || `/resources/${worksheetId.replace('.', '_')}.pdf`} download 
             className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-forest-50 text-forest-700 
                        rounded-lg hover:bg-forest-100 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Download Worksheet
          </a>
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">How do I use it?</p>
            <p className="text-sm text-gray-600">{howToUse}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Module Content Components
function Module1Content() {
  return (
    <>
      <VideoSection 
        id="1.1" 
        title="Important Financial Terms"
        activities={[
          'Have students predict definitions from Worksheet 1.1 before watching, then revisit and revise them in a different color after the video.',
          'In pairs, ask students to come up with real-life examples for 3–5 key vocabulary words and share with the class.',
          'Let students illustrate one vocabulary word on an index card and add it to a class "Money Word Wall."'
        ]}
      />
      <WorksheetSection 
        id="1.1" 
        title="Matching Terms"
        howToUse="Have students write the letter of the definition in the blank space next to the matching term."
      />
      <WorksheetSection 
        id="1.2" 
        title="Fill in the Blank"
        howToUse="Have students write the correct vocabulary word that matches the sentence in the blank space."
      />
      <div className="p-6 md:p-8 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Module 1 Quiz</h4>
        </div>
        <a href={QUIZ_URLS.module1} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 
                      rounded-xl hover:bg-purple-200 transition-colors font-medium">
          <ExternalLink className="w-5 h-5" /> Take Quiz on Wayground
        </a>
      </div>
      <VideoSection 
        id="1.3" 
        title="Making Change"
        activities={[
          'Give students a pile of mixed coins and have them sort, name, and count each type as a warm-up.',
          'After the video, call out an amount under $1.00 and have students build it with real or paper coins on their desks.',
          'Set up a simple "mini store" where one student is the cashier and one is the customer, and have them practice paying and making change.',
          'Ask students to write one sentence in their math journal explaining a strategy they use to figure out change quickly.'
        ]}
      />
      <WorksheetSection 
        id="1.3" 
        title="Identifying Coins + Making Change"
        howToUse="Have students write the name of the coin next to the image. Then have them add up the values of the coins shown. Fake coins/tokens are helpful, but not necessary for this worksheet."
      />
    </>
  )
}

function Module2Content() {
  return (
    <>
      <VideoSection 
        id="2.1" 
        title="Healthy Saving and Spending Habits"
        activities={[
          'Have students list three things they want, estimate the cost of each, and star the one they\'d most realistically save for first.',
          'Create a quick T-chart of "needs" and "wants" and ask students to sort example items or pictures into each side.',
          'Ask students to set a one-week savings goal (real or pretend) and write one sentence about how they will try to reach it.',
          'Have partners share one "healthy" spending or saving choice they plan to make this week.'
        ]}
      />
      <WorksheetSection 
        id="2.1" 
        title="Matching Terms"
        howToUse="Have students write the letter of the definition in the blank space next to the matching term."
      />
      <WorksheetSection 
        id="2.2" 
        title="Spending Simulations"
        howToUse="Have students read the scenario, evaluate if the character has enough savings to spend on the item they want, and respond to the given question. Guide students through a class discussion of listing items they want to save for and the prices in order to make a 'class budget'."
      />
      <WorksheetSection 
        id="2.3" 
        title="Creating a Budget"
        howToUse="Have students list out items they want. Then help them use the internet to find approximate prices. Encourage students to discuss ways to make money to save up for the items they've listed."
      />
      <WorksheetSection 
        id="2.4" 
        title="Budget Simulations"
        howToUse="Have students choose a lifestyle plan. Then guide them through an appropriate budget that accounts for both their incomes and expenses. Encourage students to explain why they were unable to choose certain items due to budget restrictions."
      />
    </>
  )
}

function Module3Content() {
  return (
    <>
      <VideoSection 
        id="3.1" 
        title="Credit and Debit"
        activities={[
          'Before watching, write "credit" and "debit" on the board and ask students what they already think each word means.',
          'After the video, have students complete a simple T-chart of credit vs. debit with at least one benefit and one drawback for each.',
          'Read short purchase scenarios and have students hold up cards to show whether they\'d use credit, debit, or cash.',
          'In pairs, ask students to come up with one "rule of thumb" for when to use credit and share it with the class.'
        ]}
      />
      <WorksheetSection 
        id="3.1" 
        title="Word Scramble"
        howToUse="Have students unscramble the words and write the correct spelling in the blank space."
      />
      <WorksheetSection 
        id="3.2" 
        title="Word Search"
        howToUse="Have students find the words from the bank in the word search."
      />
      <WorksheetSection 
        id="3.3" 
        title="Credit Pros and Cons"
        howToUse="Have students define the words given based on Video 3.1. Encourage an in-class discussion about the benefits and negatives of using credit to pay for purchases and ask students to list down the main points in their chart."
      />
      <VideoSection 
        id="3.4" 
        title="Investing"
        activities={[
          'List a few investing options (savings account, bonds, stocks, starting a business) and ask students to sort them into "lower risk" and "higher risk."',
          'Have students draw a simple graph or picture showing how $100 might change over time in a piggy bank versus in an investment.',
          'Ask students to choose one type of investment and write one reason it could be helpful and one risk to remember.',
          'Invite a few students to give a one- or two-sentence "pitch" explaining the investment they chose and who it might be good for.'
        ]}
      />
      <WorksheetSection 
        id="3.4" 
        title="Identifying Stock Trends"
        howToUse="Have students analyze the graph shown in the worksheet and identify the trend. For students newer to this concept, draw sample graphs on the board and lead a discussion about understanding trends on graphs."
      />
      <VideoSection 
        id="3.5" 
        title="Deposits"
        activities={[
          'After modeling a sample check or deposit on the board, have students label those same parts on a blank check in their notebooks.',
          'Give a short list of deposits and withdrawals and ask students to update a running balance on a simple account register.',
          'Have students role-play a customer and bank teller making a deposit using play money and a pretend deposit slip or check.',
          'Ask students to draw or write about one time someone in their family might make a deposit and why it\'s important.'
        ]}
      />
      <WorksheetSection 
        id="3.5" 
        title="Writing a Check"
        howToUse="Draw a model of a check. Have students follow along with their diagrams as you explain the 'anatomy'. Then have them follow the directions to write their own checks."
      />
    </>
  )
}

function Module4Content() {
  return (
    <>
      <VideoSection 
        id="4.1" 
        title="Creating Your Own Business"
        activities={[
          'Lead a quick brainstorm of kid-friendly business ideas and have each student choose one they\'re excited about.',
          'On the board, model how to list revenue and expenses for a simple business like a lemonade or juice stand.',
          'Ask students to use their chosen idea to fill in a basic plan (what they sell, what it costs to make, and what they might charge).',
          'Invite a few students to share a short "business pitch" explaining what they sell and how they plan to make a profit.'
        ]}
      />
      <WorksheetSection 
        id="4.1" 
        title="Juice Stand"
        howToUse="Have students decorate their Juice Stand, then make important decisions about their product as well as the type of equipment they use. Make sure the math adds up when grading."
      />
      <WorksheetSection 
        id="4.2" 
        title="Business Scenarios"
        howToUse="Brainstorm business ideas with students, have them pick their favorite one, and elaborate on it with this worksheet. Encourage 3-4 sentence answers."
      />
      <WorksheetSection 
        id="4.3" 
        title="Scarcity + Costs"
        howToUse="Define the terms scarce and available to students and explain what it does to the cost of the product. Have students read the given scenarios and figure out how the availability of a material affects various other factors."
      />
      <WorksheetSection 
        id="4.4" 
        title="Business Word Search"
        howToUse="Have students find the words from the bank in the word search."
      />
      <WorksheetSection 
        id="4.5" 
        title="Revenue, Expenses, and Profit Word Problems"
        howToUse='Have students read the given scenarios and use the "revenue-expenses=profit" equation in order to find the profit.'
      />
      <WorksheetSection 
        id="4.6" 
        title="Types of Expenses"
        howToUse="Ask students through an in-class discussion to list characteristics of the four types of expenses. Then have students decide which type the provided scenarios are."
      />
    </>
  )
}

function Module5Content() {
  return (
    <>
      <VideoSection 
        id="5.1" 
        title="Taxes"
        activities={[
          'Before the video, ask students to name things in the community that might be paid for with tax money and list ideas on the board.',
          'After watching, have students complete the multiple-choice questions in Worksheet 5.2 and compare answers with a partner.',
          'Give a few short shopping examples from Worksheet 5.3 and have students calculate the tax and total, using a calculator if needed.',
          'Have students create a small poster titled "Taxes Help Pay For…" with pictures of at least three services they think are important.'
        ]}
      />
      <WorksheetSection 
        id="5.2" 
        title="What are Taxes?"
        howToUse="Have students circle the best answer choice."
      />
      <WorksheetSection 
        id="5.3" 
        title="Calculating Taxes"
        howToUse="Have students do the math by hand or use a calculator to figure out the tax of each item."
      />
    </>
  )
}

function Module6Content() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-forest-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900">6.1 Review Packet</h4>
          <a href="/resources/review-packet.pdf" download 
             className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-forest-50 text-forest-700 
                        rounded-lg hover:bg-forest-100 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Download Worksheet
          </a>
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">How do I use it?</p>
            <p className="text-sm text-gray-600">
              Have students follow the instructions and complete the activities of each module accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <FloatingParticles count={20} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm
                            text-white text-sm font-medium mb-6 border border-white/30">
              <Library className="w-4 h-4" />
              <span>Resource Library</span>
            </div>
            
            <h1 className="heading-xl text-white mb-6">
              Resource Library
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              We've curated everything you'll need to seamlessly integrate financial literacy into your curriculum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Welcome & Video Walkthrough */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-md text-gray-900 mb-4">Welcome</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Financial literacy is one of the hardest subjects to teach - and it's because of the lack of 
                resources available to educators. Content is hard to find and often pricey. We at Project 
                Bright Beginnings strive to fix this.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Here we give you the best online videos, worksheets, and quizzes, organized in an incredibly 
                user-friendly curriculum, complete with modules and learning targets.
              </p>

              {/* Video Walkthrough */}
              <div className="bg-gradient-to-br from-forest-50 to-sage-50 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-8 h-8 text-forest-600" />
                  <h3 className="text-xl font-bold text-gray-900">Website Walkthrough</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  New to our Resource Library? Watch this quick video to learn how to navigate and make the most of our resources.
                </p>
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                  <iframe 
                    src={VIDEO_URLS.walkthrough}
                    className="w-full h-full"
                    allowFullScreen
                    title="Website Walkthrough"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workbook & Picture Books */}
      <section className="py-16 bg-gradient-section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 
                              flex items-center justify-center mb-5 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Finance Workbook</h3>
              <p className="text-gray-600 mb-6">
                Our finance workbook is a comprehensive resource designed for elementary school students. 
                Filled with age-appropriate activities, colorful illustrations, and interactive exercises.
              </p>
              <a href={WORKSHEET_URLS.workbook} download className="btn-primary gap-2">
                <Download className="w-4 h-4" />
                Download Workbook
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 
                              flex items-center justify-center mb-5 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Picture Books</h3>
              <p className="text-gray-600 mb-6">
                Educational picture books that introduce financial topics in engaging stories for younger audiences.
              </p>
              <div className="flex flex-col gap-3">
                <a href={WORKSHEET_URLS.sofia} download className="btn-secondary gap-2 text-sm py-3">
                  <Download className="w-4 h-4" />
                  Download Sofia's Smart Savings
                </a>
                <a href={WORKSHEET_URLS.brian} download className="btn-secondary gap-2 text-sm py-3">
                  <Download className="w-4 h-4" />
                  Descarga Panadería de Brian
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resource Search */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center mb-8"
          >
            <h2 className="heading-md text-gray-900 mb-4">
              Search <span className="text-forest-600">Resources</span>
            </h2>
            <p className="text-gray-600">
              Looking for a specific worksheet, video, or quiz? Search our entire library.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <ResourceSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Curriculum at a Glance */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-gray-900 mb-4">
              Curriculum at a <span className="text-forest-600">Glance</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are our units, all in one place! Click on each module to see a quick overview.
            </p>
          </motion.div>

          {/* Module Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all
                  ${expandedModule === module.id 
                    ? 'bg-forest-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Module {module.id}: {module.title}
              </motion.button>
            ))}
          </div>

          {/* Expanded Module Overview */}
          <AnimatePresence>
            {expandedModule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="bg-forest-50 rounded-2xl p-6 border border-forest-100">
                  <h4 className="font-bold text-forest-800 mb-2">
                    Module {expandedModule}: {modules.find(m => m.id === expandedModule)?.title}
                  </h4>
                  <p className="text-sm text-forest-700 mb-4">
                    <strong>Learning Target:</strong> {modules.find(m => m.id === expandedModule)?.learningTarget}
                  </p>
                  <p className="text-sm font-semibold text-forest-800 mb-2">Overview:</p>
                  <ul className="text-sm text-forest-700 space-y-1">
                    {modules.find(m => m.id === expandedModule)?.overview.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href={`#module-${expandedModule}`} className="inline-flex items-center gap-2 mt-4 text-accent-600 font-semibold text-sm hover:underline">
                    Jump to full module <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Full Curriculum - All Modules Expanded */}
      <section className="py-16 bg-gradient-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-gray-900 mb-4">
              Full <span className="text-accent-500">Curriculum</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all modules with complete resources, videos, worksheets, and teaching guides.
            </p>
          </motion.div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <ModuleSection module={module} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Love Us */}
      <section className="py-16 bg-gradient-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Teachers love us!</h3>
              <blockquote className="text-lg text-gray-600 italic mb-6">
                "Not only is the website aesthetically pleasing and easy to navigate, but the plethora of 
                resources available also makes this such a valuable tool for teachers, especially first 
                year educators who aren't sure where to start finding resources."
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">Nikki Minich</p>
                <p className="text-sm text-gray-500">9th grade teacher, Marcus High School</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Financial Foundations CTA */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-800 relative overflow-hidden">
        <FloatingParticles count={15} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <GraduationCap className="w-14 h-14 text-accent-300 mb-4" />
                <h2 className="heading-lg text-white mb-4">
                  Want an interactive course for students?
                </h2>
                <p className="text-white/80 leading-relaxed mb-6">
                  Introducing <strong className="text-accent-300">Financial Foundations</strong> - the FREE online course 
                  for elementary and middle schoolers that will teach your kids valuable money management skills!
                </p>
                <p className="text-white/80 leading-relaxed mb-8">
                  This interactive course is jam-packed with engaging resources like videos, quizzes, and worksheets 
                  to keep your children engaged and excited to learn about finances.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/course" className="btn-primary bg-white text-forest-700 hover:bg-gray-100 gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/course" className="btn-outline-white">
                    Sign up now!
                  </Link>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Course Highlights:</h3>
                <ul className="space-y-3">
                  {[
                    'Self-paced learning',
                    'Interactive videos & quizzes',
                    'Fun worksheets & activities',
                    'Covers budgeting to investing',
                    '100% Free - Forever!'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/90">
                      <span className="w-6 h-6 rounded-full bg-accent-400 flex items-center justify-center text-white text-sm">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
