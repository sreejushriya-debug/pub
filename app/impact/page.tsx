'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe, BookOpen, Heart, ArrowRight, Mail, Award, Calendar, Video, School } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedCounter from '@/components/AnimatedCounter'
import FloatingParticles from '@/components/FloatingParticles'
import ImageCarousel from '@/components/ImageCarousel'

// Workshop images
const workshopImages = [
  '/impact/workshop1.png',
  '/impact/workshop2.png',
  '/impact/workshop3.png',
  '/impact/workshop4.png',
  '/impact/workshop5.png',
  '/impact/workshop6.png',
  '/impact/workshop7.png',
  '/impact/workshop8.png',
]

// Surya event images
const suryaImages = [
  '/impact/surya1.png',
  '/impact/surya2.png',
  '/impact/surya3.png',
  '/impact/surya4.png',
  '/impact/surya5.png',
  '/impact/surya6.png',
]

const DONATE_LINK = 'https://hcb.hackclub.com/donations/start/project-bright-beginnings-5ac9c1ad-9a9f-4135-bce7-597e9da85f30'

// Countdown component
function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-4 min-w-[80px]">
            <div className="text-3xl md:text-4xl font-bold text-forest-600">
              {value.toString().padStart(2, '0')}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 capitalize">{unit}</p>
        </div>
      ))}
    </div>
  )
}

export default function ImpactPage() {
  const nextShipmentDate = new Date('2026-02-19T00:00:00')

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
              <TrendingUp className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            
            <h1 className="heading-xl text-white mb-6">
              Making a Real Difference
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Since 2022, we have improved financial literacy education across the world for 
              <strong> thousands of students</strong> and the educators that support them through 
              <strong> research-based initiatives.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <Globe className="w-14 h-14 text-forest-600 mx-auto mb-4" />
              <h2 className="heading-lg text-gray-900 mb-4">
                Global <span className="text-forest-600">Reach</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/impact/bookdistribution.png"
                  alt="Students with financial literacy workbooks"
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </motion.div>

              {/* Content */}
              <div className="bg-gradient-to-br from-forest-50 to-sage-50 rounded-3xl p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Our resources have been reviewed by the Departments of Education of all <strong>50 states</strong> and 
                  are approved by <strong>Jump$tart Clearinghouse</strong> to fit the <strong>National Standards of Personal Finance</strong>.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Through partnership with local and global nonprofits, we facilitated the distribution of 
                  <strong className="text-forest-600"> 925 copies of our workbook</strong> to Title-1 schools in America 
                  and English-medium schools in <strong>India, Tanzania, Uganda, and Botswana</strong>.
                </p>

                {/* Countdown */}
                <div className="bg-white rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Our next shipment is in:</h3>
                  <div className="my-4">
                    <Countdown targetDate={nextShipmentDate} />
                  </div>
                  <a 
                    href={DONATE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Donate Now!
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="py-20 bg-gradient-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Video className="w-14 h-14 text-accent-500 mb-4" />
                <h2 className="heading-lg text-gray-900 mb-4">
                  <span className="text-accent-500">Webinars</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To date, we conducted a total of <strong className="text-forest-700">7 webinars</strong>, 
                  with <strong className="text-forest-700">250+ total participants</strong>. Through these webinars, 
                  hosted on Zoom, we utilized a variety of digital games like Blooket as well as the breakout 
                  room feature to test the students' understanding of the content in a fun and engaging way.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="card text-center bg-white">
                    <div className="text-4xl font-bold text-forest-600 mb-2">7</div>
                    <p className="text-gray-600 text-sm">Webinars Hosted</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="card text-center bg-white">
                    <div className="text-4xl font-bold text-accent-500 mb-2">250+</div>
                    <p className="text-gray-600 text-sm">Total Participants</p>
                  </motion.div>
                </div>
                <div className="bg-accent-50 rounded-xl p-6 border border-accent-100">
                  <p className="text-gray-700">
                    <strong>Want a webinar for your classroom?</strong>
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Please reach out to{' '}
                    <a href="mailto:projectbrightbeginnings@gmail.com" className="text-accent-600 font-semibold hover:underline">
                      projectbrightbeginnings@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              {/* Webinar Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[350px] rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/impact/webinar.png"
                  alt="Virtual webinar session"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Workshop Carousel */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <ImageCarousel 
                  images={workshopImages} 
                  interval={3500}
                  className="h-[350px] shadow-2xl"
                />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="card text-center bg-forest-50">
                    <div className="text-4xl font-bold text-forest-600 mb-2">300+</div>
                    <p className="text-gray-600 text-sm">Students Reached</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="card text-center bg-forest-50">
                    <div className="text-4xl font-bold text-forest-600 mb-2">10</div>
                    <p className="text-gray-600 text-sm">Elementary Schools</p>
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="order-1 lg:order-2">
                <School className="w-14 h-14 text-forest-600 mb-4" />
                <h2 className="heading-lg text-gray-900 mb-4">
                  <span className="text-forest-600">Workshops</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To evaluate the effectiveness of our curriculum, we hosted in-person workshops for elementary 
                  school students across the DFW metroplex in <strong>3rd through 5th grade</strong>. Our team visited 
                  ESD programs and worked with over <strong className="text-forest-700">300 students across 10 elementary schools</strong>. 
                  During these workshops, we taught the students using both our curriculum and novel, incentivized 
                  games designed to reinforce key financial concepts in an engaging and memorable way.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fundraising Section */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-800 relative overflow-hidden">
        <FloatingParticles count={15} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-white mb-4">Fundraising</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
            >
              <Calendar className="w-12 h-12 text-accent-300 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Events</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                To fund the production and distribution of our financial-literacy resources, our team organized 
                the <strong className="text-accent-300">Surya Cultural Showcase</strong>, a community event celebrating Indian culture.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                We contacted <strong>93 local dance and music schools</strong>, ultimately selecting 19 performances 
                for a five-hour program. We secured $700 in sponsorships and partnered with a local jewelry vendor 
                who paid a $90 booth fee.
              </p>
              <p className="text-white/80 leading-relaxed">
                Revenue came from ticket sales, food sales, vendor fees, and donations, all of which were matched 
                2:1 by a gracious corporate donor, bringing our{' '}
                <strong className="text-accent-300">total fundraising to $6,159</strong>.
              </p>
            </motion.div>

            {/* Grants */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
            >
              <Award className="w-12 h-12 text-accent-300 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Grants & Awards</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Additional sources of funding come from being awarded local grants and winning prestigious awards:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                  <span>MyImpact National Award</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                  <span>MyImpact Texas Award</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                  <span><strong>1st Place</strong> - International Career Development Conference for Financial Literacy Project Management</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Surya Event Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-bold text-white text-center mb-6">Surya Cultural Showcase Highlights</h3>
            <ImageCarousel 
              images={suryaImages} 
              interval={4000}
              className="h-[400px] shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-gray-900 mb-2">
              By the Numbers
            </h2>
            <div className="w-16 h-1 bg-accent-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { value: 925, label: 'Workbooks Distributed', suffix: '+' },
              { value: 300, label: 'Students in Workshops', suffix: '+' },
              { value: 250, label: 'Webinar Participants', suffix: '+' },
              { value: 6159, label: 'Raised at Events', prefix: '$' },
              { value: 11300, label: 'Resource Downloads', suffix: '+' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card-hover h-full text-center bg-gray-50 group"
                >
                  <div className="text-4xl md:text-5xl font-bold text-forest-600 mb-2 card-number transition-colors">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  </div>
                  <p className="text-gray-600 text-sm card-text transition-colors">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="heading-lg text-gray-900 mb-6">
              Help Us Grow Our Impact
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your support enables us to reach more students and provide free financial 
              literacy education to children around the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={DONATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </a>
              <Link href="/contact" className="btn-secondary">
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
