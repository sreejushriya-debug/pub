'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Heart } from 'lucide-react'

const DONATE_LINK = 'https://hcb.hackclub.com/donations/start/project-bright-beginnings-5ac9c1ad-9a9f-4135-bce7-597e9da85f30'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Resources', href: '/resources' },
  { name: 'Our Impact', href: '/impact' },
  { 
    name: 'Programs', 
    href: '#',
    submenu: [
      { name: 'Financial Foundations Course', href: '/course' },
      { name: 'Virtual Finance BootCamp', href: '/bootcamp' },
    ]
  },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  
  // Check if we're on the home page
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine if navbar should have white text (only on home page when not scrolled)
  const useWhiteText = isHomePage && !isScrolled

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-forest-900/5' 
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2"
              >
                <span className={`text-xl md:text-2xl font-bold transition-colors ${useWhiteText ? 'text-white' : 'text-forest-700'}`}>
                  bright beginnings
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveSubmenu(link.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  {link.submenu ? (
                    <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium 
                                       transition-colors rounded-full
                                       ${useWhiteText 
                                         ? 'text-white/90 hover:text-white hover:bg-white/10' 
                                         : 'text-gray-700 hover:text-forest-700 hover:bg-forest-50'}`}>
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                        ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 py-2 text-sm font-medium transition-colors rounded-full
                                 ${useWhiteText 
                                   ? 'text-white/90 hover:text-white hover:bg-white/10' 
                                   : 'text-gray-700 hover:text-forest-700 hover:bg-forest-50'}`}
                    >
                      {link.name}
                    </Link>
                  )}
                  
                  {/* Submenu */}
                  <AnimatePresence>
                    {link.submenu && activeSubmenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl 
                                   shadow-forest-900/10 border border-gray-100 overflow-hidden"
                      >
                        {link.submenu.map((sublink, idx) => (
                          <Link
                            key={sublink.name}
                            href={sublink.href}
                            className={`block px-5 py-3 text-sm font-medium text-gray-700 
                                        hover:bg-forest-50 hover:text-forest-700 transition-colors
                                        ${idx !== link.submenu!.length - 1 ? 'border-b border-gray-50' : ''}`}
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href={DONATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-donate gap-2 text-sm py-3 px-6"
              >
                <Heart className="w-4 h-4" />
                Donate
              </a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${useWhiteText ? 'text-white' : 'text-gray-700'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-forest-900/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 pb-6 px-6">
                <nav className="flex-1 space-y-1">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {link.submenu ? (
                        <div>
                          <button
                            onClick={() => setActiveSubmenu(activeSubmenu === link.name ? null : link.name)}
                            className="w-full flex items-center justify-between px-4 py-3 text-base font-medium 
                                       text-gray-700 hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-colors"
                          >
                            {link.name}
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 
                              ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {activeSubmenu === link.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4"
                              >
                                {link.submenu.map((sublink) => (
                                  <Link
                                    key={sublink.name}
                                    href={sublink.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2.5 text-sm font-medium text-gray-600 
                                               hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                                  >
                                    {sublink.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-gray-700 
                                     hover:text-forest-700 hover:bg-forest-50 rounded-xl transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
                <div className="pt-6 border-t border-gray-100">
                  <a 
                    href={DONATE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-donate w-full justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Donate Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
