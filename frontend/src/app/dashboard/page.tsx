'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaCamera, FaHistory, FaPills, FaChartLine, 
  FaClock, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/components/layout/AppLayout'
import { authService, prescriptionService } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    activeMedications: 0,
    upcomingDoses: 2
  })

  useEffect(() => {
    const token = authService.getToken()
    if (!token) {
      router.push('/login')
    } else {
      loadUserData()
    }
  }, [router])

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
      
      const history = await prescriptionService.getHistory()
      setStats(prev => ({
        ...prev,
        totalPrescriptions: history.length
      }))
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const quickActions = [
    {
      icon: FaCamera,
      label: 'Scan Prescription',
      description: 'Upload new prescription',
      color: 'from-indigo-500 to-purple-500',
      path: '/dashboard/scan'
    },
    {
      icon: FaHistory,
      label: 'View History',
      description: 'Past prescriptions',
      color: 'from-blue-500 to-cyan-500',
      path: '/dashboard/history'
    }
  ]

  const upcomingMedications = [
    { name: 'Amoxicillin', time: '2:00 PM', status: 'pending' },
    { name: 'Vitamin D', time: '6:00 PM', status: 'pending' }
  ]

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}
          </h2>
          <p className="text-gray-600">
            Manage your prescriptions with automated analysis
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {stats.totalPrescriptions}
              </div>
              <div className="text-xs text-gray-600">Total Scanned</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.upcomingDoses}
              </div>
              <div className="text-xs text-gray-600">Active Meds</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.label}
                className="cursor-pointer hover:shadow-lg transition-all bg-white border-gray-200"
                onClick={() => router.push(action.path)}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <action.icon className="text-white text-2xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{action.label}</h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div>
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaExclamationTriangle className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Automated Analysis</h4>
                  <p className="text-sm text-gray-700">
                    Upload prescription images for instant analysis and structured medication data extraction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
