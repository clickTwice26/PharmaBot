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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top App Bar */}
      {showTopBar && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FaPills className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">PharmaBot</h1>
                <p className="text-xs text-gray-600">Prescription Analysis</p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="flex-1 flex flex-col items-center justify-center py-2 relative group"
                >
                  <div
                    className={`relative flex flex-col items-center transition-colors ${
                      active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {active && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" />
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
                  </div>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
