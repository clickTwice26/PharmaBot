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

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div>
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 ring-4 ring-white/30">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-white text-indigo-600 text-2xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1 text-white">{user?.username || 'User'}</h2>
                  <p className="text-indigo-100 text-sm">PharmaBot Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Account</h3>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Username</p>
                  <p className="font-semibold text-gray-900">{user?.username || 'Loading...'}</p>
                </div>
                <Separator className="bg-gray-200" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">November 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Version</p>
                <p className="font-semibold text-gray-900">1.0.0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            size="lg"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
