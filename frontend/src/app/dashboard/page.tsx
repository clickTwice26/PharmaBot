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
    },
    {
      icon: FaPills,
      label: 'Medications',
      description: 'Active medicines',
      color: 'from-green-500 to-emerald-500',
      path: '/dashboard/medications'
    },
    {
      icon: FaChartLine,
      label: 'Analytics',
      description: 'Health insights',
      color: 'from-orange-500 to-red-500',
      path: '/dashboard/analytics'
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}! 👋
          </h2>
          <p className="text-gray-600">
            Here's your health overview for today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {stats.totalPrescriptions}
              </div>
              <div className="text-xs text-gray-600">Prescriptions</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.activeMedications}
              </div>
              <div className="text-xs text-gray-600">Active Meds</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {stats.upcomingDoses}
              </div>
              <div className="text-xs text-gray-600">Upcoming</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => router.push(action.path)}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                      <action.icon className="text-white text-xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{action.label}</h4>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Medications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FaClock className="mr-2 text-orange-500" />
                Upcoming Medications
              </CardTitle>
              <CardDescription>Don't miss your doses today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMedications.length > 0 ? (
                upcomingMedications.map((med, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FaPills className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{med.name}</p>
                          <p className="text-sm text-gray-500">{med.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        Pending
                      </Badge>
                    </div>
                    {index < upcomingMedications.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FaCheckCircle className="mx-auto text-4xl text-green-500 mb-2" />
                  <p>All caught up! No upcoming doses.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaExclamationTriangle className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Health Tip</h4>
                  <p className="text-sm text-gray-700">
                    Remember to take your medications with water and follow the prescribed timing for best results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
