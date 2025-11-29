'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Library, Search, Filter, Download, FileText, Sparkles } from 'lucide-react'
import FadeIn from '@/components/FadeIn'
import ResourceCard from '@/components/ResourceCard'

const categories = [
  'All Resources',
  'Worksheets',
  'Lesson Plans',
  'Activities',
  'Picture Books',
  'Assessments'
]

const resources = [
  {
    id: 1,
    title: 'KWL Worksheet - What I Know, Want to Know, Learned',
    description: 'A foundational worksheet to help students track their learning progress about finance.',
    category: 'Worksheets',
    downloadUrl: '/resources/kwl-worksheet.pdf',
    fileType: 'PDF'
  },
  {
    id: 2,
    title: 'Budgeting Basics Lesson Plan',
    description: 'A comprehensive lesson plan introducing students to the fundamentals of budgeting.',
    category: 'Lesson Plans',
    downloadUrl: '/resources/budgeting-lesson.pdf',
    fileType: 'PDF'
  },
  {
    id: 3,
    title: 'Savings Goal Tracker',
    description: 'Help students set and track their savings goals with this interactive worksheet.',
    category: 'Worksheets',
    downloadUrl: '/resources/savings-tracker.pdf',
    fileType: 'PDF'
  },
  {
    id: 4,
    title: 'Money Math Activities',
    description: 'Fun math activities that incorporate real-world money concepts and calculations.',
    category: 'Activities',
    downloadUrl: '/resources/money-math.pdf',
    fileType: 'PDF'
  },
  {
    id: 5,
    title: 'The Penny Saves the Day - Picture Book',
    description: 'An engaging picture book that teaches children about the value of saving money.',
    category: 'Picture Books',
    downloadUrl: '/resources/penny-saves.pdf',
    fileType: 'PDF'
  },
  {
    id: 6,
    title: 'Spending vs Saving Activity',
    description: 'Interactive activity helping students understand the difference between needs and wants.',
    category: 'Activities',
    downloadUrl: '/resources/spending-saving.pdf',
    fileType: 'PDF'
  },
  {
    id: 7,
    title: 'Financial Vocabulary Flashcards',
    description: 'Printable flashcards covering essential financial terms for young learners.',
    category: 'Worksheets',
    downloadUrl: '/resources/vocab-flashcards.pdf',
    fileType: 'PDF'
  },
  {
    id: 8,
    title: 'Pre/Post Assessment Quiz',
    description: 'Measure student progress with this before-and-after financial literacy assessment.',
    category: 'Assessments',
    downloadUrl: '/resources/assessment-quiz.pdf',
    fileType: 'PDF'
  },
  {
    id: 9,
    title: 'Investment Introduction Lesson',
    description: 'Age-appropriate lesson introducing the concept of investing and growing money.',
    category: 'Lesson Plans',
    downloadUrl: '/resources/investment-lesson.pdf',
    fileType: 'PDF'
  },
  {
    id: 10,
    title: 'Earning Money Worksheet',
    description: 'Explore different ways to earn money through jobs, chores, and entrepreneurship.',
    category: 'Worksheets',
    downloadUrl: '/resources/earning-money.pdf',
    fileType: 'PDF'
  },
  {
    id: 11,
    title: 'Banking Basics Picture Book',
    description: 'Colorful picture book explaining how banks work and why they\'re important.',
    category: 'Picture Books',
    downloadUrl: '/resources/banking-basics.pdf',
    fileType: 'PDF'
  },
  {
    id: 12,
    title: 'Classroom Economy Setup Guide',
    description: 'Complete guide to setting up a classroom economy to teach financial concepts.',
    category: 'Lesson Plans',
    downloadUrl: '/resources/classroom-economy.pdf',
    fileType: 'PDF'
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Resources')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All Resources' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container-custom relative">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                            text-forest-700 text-sm font-medium mb-6">
              <Library className="w-4 h-4" />
              <span>Resource Library</span>
            </div>
            
            <h1 className="heading-xl text-forest-900 mb-6">
              Free Resources for{' '}
              <span className="text-gradient">Educators</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Explore our comprehensive library of free worksheets, lesson plans, activities, 
              and more. All designed to make teaching financial literacy easy and engaging.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-forest-700">140+</div>
                <div className="text-sm text-gray-500">Free Resources</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-forest-700">95%</div>
                <div className="text-sm text-gray-500">Teacher Satisfaction</div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-warm-700">100%</div>
                <div className="text-sm text-gray-500">Free Forever</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Resources Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Search and Filter */}
          <FadeIn className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                             focus:outline-none focus:border-forest-400 focus:ring-2 
                             focus:ring-forest-100 transition-all"
                />
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${selectedCategory === category 
                        ? 'bg-forest-600 text-white shadow-lg shadow-forest-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource, idx) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                >
                  <ResourceCard {...resource} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No results */}
          {filteredResources.length === 0 && (
            <FadeIn className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-gray-600 mb-2">
                No resources found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-warm-600 mx-auto mb-6" />
            <h2 className="heading-lg text-forest-900 mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're always adding new resources. Let us know what you need and we'll 
              work on creating it for you.
            </p>
            <a href="mailto:projectbrightbeginnings@gmail.com" className="btn-primary">
              Request a Resource
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

