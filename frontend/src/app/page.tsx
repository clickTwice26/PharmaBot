'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaPills, FaRobot, FaShieldAlt, FaBolt, FaMobileAlt, FaChartLine } from 'react-icons/fa'
import { authService } from '@/lib/api'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  const features = [
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced Gemini AI reads and interprets prescriptions instantly with high accuracy.'
    },
    {
      icon: <FaPills className="w-8 h-8" />,
      title: 'Medication Tracking',
      description: 'Keep all your prescriptions organized and easily accessible in one secure place.'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your medical data is encrypted and protected with industry-standard security.'
    },
    {
      icon: <FaBolt className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get your prescription analyzed in seconds, not minutes.'
    },
    {
      icon: <FaMobileAlt className="w-8 h-8" />,
      title: 'Mobile Friendly',
      description: 'Access your prescriptions anywhere, anytime on any device.'
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: 'Health Insights',
      description: 'Track your medication history and get valuable health insights.'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <FaPills className="w-8 h-8 text-indigo-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PharmaBot
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-4"
        >
          <Button variant="ghost" onClick={() => router.push('/login')}>
            Login
          </Button>
          <Button onClick={() => router.push('/register')}>
            Get Started
          </Button>
        </motion.div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Prescription,
              </span>
              <br />
              <span className="text-gray-900">Decoded Instantly</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Upload your prescription and let our AI-powered assistant analyze it in seconds.
            Safe, secure, and incredibly accurate.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" onClick={() => router.push('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose PharmaBot?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Card hover gradient className="h-full">
                  <div className="text-indigo-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-20 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who trust PharmaBot with their prescriptions.
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push('/register')}>
            Create Free Account
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t border-gray-200 mt-20">
        <p>&copy; 2025 PharmaBot. All rights reserved.</p>
      </footer>
    </div>
  )
}
