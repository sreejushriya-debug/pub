'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Heart, Sparkles, ArrowUpRight, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  navigation: [
    { name: 'About', href: '/about' },
    { name: 'Resources', href: '/resources' },
    { name: 'Our Impact', href: '/impact' },
    { name: 'Contact', href: '/contact' },
  ],
  programs: [
    { name: 'Financial Foundations', href: '/course' },
    { name: 'Finance BootCamp', href: '/bootcamp' },
    { name: 'Resource Library', href: '/resources' },
  ],
  social: [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ],
}

const contactInfo = [
  { icon: Mail, text: 'projectbrightbeginnings@gmail.com', href: 'mailto:projectbrightbeginnings@gmail.com' },
  { icon: Phone, text: '945-216-0206', href: 'tel:945-216-0206' },
  { icon: MapPin, text: '5707 Moriss Road, Flower Mound, TX 75028', href: '#' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-forest-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-forest-800/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-warm-800/20 blur-3xl" />
      </div>

      <div className="relative container-custom">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-forest-800/50">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="heading-md text-white mb-4">
                Stay Connected
              </h3>
              <p className="text-forest-200 mb-8">
                Subscribe to our newsletter for the latest resources, tips, and updates on financial literacy education.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-full bg-forest-800/50 border border-forest-700 
                             text-white placeholder-forest-400 focus:outline-none focus:border-sage-400
                             transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-warm-700 to-warm-600 rounded-full 
                             font-semibold text-white shadow-lg shadow-warm-800/30 hover:shadow-xl
                             transition-shadow whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-500 
                              flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white">Project</span>
                <span className="font-display text-lg font-bold text-warm-400 ml-1">Bright Beginnings</span>
              </div>
            </Link>
            <p className="text-forest-200 text-sm leading-relaxed mb-6">
              Our mission is to provide foundational tools that educate students on the importance of 
              financial education and make financial literacy accessible to all.
            </p>
            <div className="flex gap-3">
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-forest-800 hover:bg-forest-700 
                             flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-white mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-forest-200 hover:text-white transition-colors 
                               inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 
                                             group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-forest-200 hover:text-white transition-colors 
                               inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 
                                             group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <a 
                    href={item.href}
                    className="flex items-start gap-3 text-forest-200 hover:text-white transition-colors group"
                  >
                    <item.icon className="w-5 h-5 mt-0.5 text-sage-400 group-hover:text-sage-300 transition-colors" />
                    <span className="text-sm">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-forest-800/50 flex flex-col md:flex-row items-center 
                        justify-between gap-4 text-sm text-forest-300">
          <p>© {currentYear} Project Bright Beginnings. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> for financial literacy
          </p>
        </div>
      </div>
    </footer>
  )
}

