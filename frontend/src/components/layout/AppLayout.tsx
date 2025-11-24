'use client'

import { ReactNode, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHome, FaCamera, FaHistory, FaUser, FaPills,
  FaBell, FaSearch
} from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

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
  const [notificationCount] = useState(3)

  const navItems = [
    { icon: FaHome, label: 'Home', path: '/dashboard' },
    { icon: FaCamera, label: 'Scan', path: '/dashboard/scan' },
    { icon: FaHistory, label: 'History', path: '/dashboard/history' },
    { icon: FaUser, label: 'Profile', path: '/dashboard/profile' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Top App Bar */}
      {showTopBar && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaPills className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">PharmaBot</h1>
                <p className="text-xs text-gray-500">Your Health Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaSearch className="text-gray-600 text-lg" />
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaBell className="text-gray-600 text-lg" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {notificationCount}
                  </Badge>
                )}
              </button>
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-indigo-100">
                <AvatarImage src="/avatar-placeholder.png" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                  PB
                </AvatarFallback>
              </Avatar>
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
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
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
                    className={`relative flex flex-col items-center ${
                      active ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <item.icon 
                      className={`text-2xl mb-1 transition-all ${
                        active ? 'scale-110' : 'scale-100'
                      }`} 
                    />
                    <span className={`text-xs font-medium ${
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
