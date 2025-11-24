'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaHistory, FaPills, FaClock, FaCalendarAlt, FaEye } from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/components/layout/AppLayout'
import { prescriptionService } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function HistoryPage() {
  const router = useRouter()
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const history = await prescriptionService.getHistory()
      setPrescriptions(history)
    } catch (error) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <FaHistory className="mr-3 text-blue-600" />
            Prescription History
          </h2>
          <p className="text-gray-600">
            View all your analyzed prescriptions
          </p>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">Loading history...</p>
              </CardContent>
            </Card>
          ) : prescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FaHistory className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions Yet</h3>
                <p className="text-gray-500 mb-4">Start by scanning your first prescription</p>
                <Button onClick={() => router.push('/dashboard/scan')}>
                  Scan Prescription
                </Button>
              </CardContent>
            </Card>
          ) : (
            prescriptions.map((prescription, index) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <FaPills className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{prescription.filename}</h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <FaClock className="mr-1" />
                              {formatDate(prescription.created_at)}
                            </p>
                          </div>
                        </div>

                        {prescription.structured_data && prescription.structured_data.medications && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">
                              Medications ({prescription.structured_data.medications.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {prescription.structured_data.medications.slice(0, 3).map((med: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                                  {med.medicine_name}
                                </Badge>
                              ))}
                              {prescription.structured_data.medications.length > 3 && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                  +{prescription.structured_data.medications.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/prescription/${prescription.id}`)}
                      >
                        <FaEye className="mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </AppLayout>
  )
}
