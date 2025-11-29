'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, 
  MessageSquare, Clock, Heart, Loader2
} from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

const DONATE_LINK = 'https://hcb.hackclub.com/donations/start/project-bright-beginnings-5ac9c1ad-9a9f-4135-bce7-597e9da85f30'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkglegpj'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    content: 'projectbrightbeginnings@gmail.com',
    href: 'mailto:projectbrightbeginnings@gmail.com',
    description: 'We\'ll respond within 24-48 hours'
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '945-216-0206',
    href: 'tel:945-216-0206',
    description: 'Monday - Friday, 9am - 5pm CT'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '5707 Moriss Road, Flower Mound, TX 75028',
    href: 'https://maps.google.com/?q=5707+Moriss+Road+Flower+Mound+TX+75028',
    description: 'By appointment only'
  }
]

const faqs = [
  {
    question: 'Are all your resources really free?',
    answer: 'Yes! All of our resources, including our Financial Foundations course, worksheets, and lesson plans, are completely free to access and download.'
  },
  {
    question: 'What age groups are your programs designed for?',
    answer: 'Our programs are primarily designed for elementary and middle school students (ages 5-14), though many of our resources can be adapted for different age groups.'
  },
  {
    question: 'How can I bring your program to my school?',
    answer: 'We\'d love to partner with you! Please fill out the contact form or email us directly, and we\'ll work with you to implement our financial literacy curriculum in your school.'
  },
  {
    question: 'How can I donate to support your mission?',
    answer: 'We accept donations through Hack Club Bank. Click the "Donate" button on our website to make a secure contribution. Every dollar helps us reach more students!'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          inquiryType: formData.type,
          source: 'Contact Us Page',
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            type: 'general'
          })
        }, 3000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
              <MessageSquare className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            
            <h1 className="heading-xl text-white mb-6">
              We'd Love to Hear From You
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions about our programs? Want to partner with us? 
              Or just want to say hello? We're here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.a
                key={info.title}
                href={info.href}
                target={info.icon === MapPin ? '_blank' : undefined}
                rel={info.icon === MapPin ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="card text-center block group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 
                                flex items-center justify-center mx-auto mb-4 shadow-lg shadow-forest-200
                                group-hover:scale-110 transition-transform">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-forest-600 font-medium mb-1">
                  {info.content}
                </p>
                <p className="text-gray-500 text-sm">
                  {info.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-md text-gray-900 mb-6">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                                 focus:outline-none focus:border-forest-400 focus:ring-2 
                                 focus:ring-forest-100 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                                 focus:outline-none focus:border-forest-400 focus:ring-2 
                                 focus:ring-forest-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                               focus:outline-none focus:border-forest-400 focus:ring-2 
                               focus:ring-forest-100 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="school">Bring Program to My School</option>
                    <option value="webinar">Request a Webinar</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="media">Media/Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                               focus:outline-none focus:border-forest-400 focus:ring-2 
                               focus:ring-forest-100 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                               focus:outline-none focus:border-forest-400 focus:ring-2 
                               focus:ring-forest-100 transition-all resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.name || !formData.email || !formData.message || isLoading}
                  className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="heading-md text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <h3 className="font-bold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-forest-50 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Response Time
                    </h3>
                    <p className="text-gray-600 text-sm">
                      We typically respond to all inquiries within 24-48 hours during 
                      business days. For urgent matters, please call us directly.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Heart className="w-12 h-12 text-accent-500 mx-auto mb-6" />
            <h2 className="heading-lg text-gray-900 mb-6">
              Want to Support Our Mission?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your donation helps us provide free financial literacy education to 
              students who need it most.
            </p>
            <a 
              href={DONATE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              <Heart className="w-4 h-4" />
              Make a Donation
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
