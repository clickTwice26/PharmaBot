'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaSignOutAlt, FaShieldAlt, FaBell, FaPalette, FaLanguage } from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import AppLayout from '@/components/layout/AppLayout'
import { authService } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully')
    setTimeout(() => router.push('/login'), 500)
  }

  const settingsOptions = [
    {
      icon: FaBell,
      title: 'Notifications',
      description: 'Manage notification preferences',
      badge: 'New'
    },
    {
      icon: FaShieldAlt,
      title: 'Privacy & Security',
      description: 'Control your data and security settings'
    },
    {
      icon: FaPalette,
      title: 'Appearance',
      description: 'Customize theme and display'
    },
    {
      icon: FaLanguage,
      title: 'Language',
      description: 'Change app language',
      value: 'English'
    }
  ]

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 ring-4 ring-white/30">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-white text-indigo-600 text-2xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{user?.username || 'User'}</h2>
                  <p className="text-indigo-100">PharmaBot Member</p>
                  <Badge className="mt-2 bg-white/20 text-white border-white/30">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Settings</h3>
          <Card>
            <CardContent className="p-0">
              {settingsOptions.map((option, index) => (
                <div key={option.title}>
                  <button className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <option.icon className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center">
                          {option.title}
                          {option.badge && (
                            <Badge className="ml-2 bg-indigo-100 text-indigo-700 text-xs">
                              {option.badge}
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    {option.value && (
                      <span className="text-sm text-gray-500">{option.value}</span>
                    )}
                  </button>
                  {index < settingsOptions.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
          <Card>
            <CardContent className="p-4 space-y-3">
              <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-semibold text-gray-900">Help & Support</p>
                <p className="text-sm text-gray-500">Get help or contact us</p>
              </button>
              <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-semibold text-gray-900">Terms of Service</p>
                <p className="text-sm text-gray-500">Read our terms and conditions</p>
              </button>
              <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <p className="font-semibold text-gray-900">Privacy Policy</p>
                <p className="text-sm text-gray-500">How we handle your data</p>
              </button>
              <div className="p-3">
                <p className="text-sm text-gray-500">Version 1.0.0</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            size="lg"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  )
}
