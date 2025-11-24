'use client'

import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHome, FaCamera, FaHistory, FaUser, FaPills
} from 'react-icons/fa'

interface AppLayoutProps {
  children: ReactNode
  showBottomNav?: boolean
  showTopBar?: boolean
}

export default function AppLayout({ 
  children, 
  showBottomNav = true,
  showTopBar = true 
}: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: FaHome, label: 'Home', path: '/dashboard' },
    { icon: FaCamera, label: 'Scan', path: '/dashboard/scan' },
    { icon: FaHistory, label: 'History', path: '/dashboard/history' },
    { icon: FaUser, label: 'Profile', path: '/dashboard/profile' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Top App Bar */}
      {showTopBar && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FaPills className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">PharmaBot</h1>
                <p className="text-xs text-zinc-400">AI Prescription Analysis</p>
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800"
        >
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="flex-1 flex flex-col items-center justify-center py-2 relative group"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative flex flex-col items-center transition-colors ${
                      active ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/50"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon 
                      className={`text-2xl mb-1 transition-all ${
                        active ? 'scale-110' : 'scale-100'
                      }`} 
                    />
                    <span className={`text-xs transition-all ${
                      active ? 'font-semibold' : 'font-normal'
                    }`}>
                      {item.label}
                    </span>
                  </motion.div>
                </button>
              )
            })}
          </div>
        </motion.nav>
      )}
    </div>
  )
}
