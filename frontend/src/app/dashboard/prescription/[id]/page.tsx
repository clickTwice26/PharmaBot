'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaPills, FaUser, FaClock, FaCalendarAlt, 
  FaExclamationTriangle, FaArrowLeft, FaDownload
} from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/components/layout/AppLayout'
import { prescriptionService } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function PrescriptionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [prescription, setPrescription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadPrescription = async () => {
    try {
      const data = await prescriptionService.getPrescription(parseInt(id))
      setPrescription(data)
    } catch (error) {
      toast.error('Failed to load prescription')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadPrescription()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading prescription...</p>
        </div>
      </AppLayout>
    )
  }

  if (!prescription) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prescription Not Found</h3>
              <p className="text-gray-500 mb-4">The prescription you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/dashboard/history')}>
                <FaArrowLeft className="mr-2" />
                Back to History
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/history')}
            className="mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to History
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {prescription.filename}
              </h2>
              <p className="text-gray-600 flex items-center">
                <FaClock className="mr-2" />
                {formatDate(prescription.created_at)}
              </p>
            </div>
            <Button variant="outline">
              <FaDownload className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {prescription.structured_data ? (
          <div className="space-y-6">
            {/* Patient Information */}
            {prescription.structured_data.patient_details && (
              <div
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaUser className="mr-2 text-indigo-600" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Name</p>
                        <p className="font-semibold text-gray-900">
                          {prescription.structured_data.patient_details.patient_name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Age</p>
                        <p className="font-semibold text-gray-900">
                          {prescription.structured_data.patient_details.patient_age || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Gender</p>
                        <p className="font-semibold text-gray-900">
                          {prescription.structured_data.patient_details.patient_gender || 'N/A'}
                        </p>
                      </div>
                      {prescription.structured_data.patient_details.patient_id && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Patient ID</p>
                          <p className="font-semibold text-gray-900">
                            {prescription.structured_data.patient_details.patient_id}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Medications */}
            {prescription.structured_data.medications && prescription.structured_data.medications.length > 0 && (
              <div
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaPills className="mr-2 text-purple-600" />
                      Medications ({prescription.structured_data.medications.length})
                    </CardTitle>
                    <CardDescription>Complete medication schedule</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prescription.structured_data.medications.map((med: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900 text-lg flex items-center">
                              <FaPills className="mr-2 text-purple-500" size={18} />
                              {med.medicine_name}
                            </h5>
                            {med.generic_name && (
                              <p className="text-sm text-gray-600 mt-1">({med.generic_name})</p>
                            )}
                          </div>
                          {med.frequency_code && (
                            <Badge className={`${
                              med.frequency_code === 'TID' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              med.frequency_code === 'BID' ? 'bg-green-100 text-green-700 border-green-300' :
                              med.frequency_code === 'QD' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                              med.frequency_code === 'QID' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                              'bg-gray-100 text-gray-700 border-gray-300'
                            }`}>
                              {med.frequency_code}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Strength</p>
                            <p className="font-semibold text-gray-900 text-sm">{med.strength || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Form</p>
                            <p className="font-semibold text-gray-900 text-sm">{med.dosage_form || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Dose</p>
                            <p className="font-semibold text-gray-900 text-sm">{med.quantity_per_dose || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Frequency</p>
                            <p className="font-semibold text-gray-900 text-sm">{med.frequency || 'N/A'}</p>
                          </div>
                        </div>

                        {med.timing && med.timing.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                            <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center">
                              <FaClock className="mr-1" />
                              Timing Schedule
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {med.timing.map((time: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-white border border-blue-300 rounded-full text-sm font-mono text-blue-900 font-semibold">
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                          {med.duration_days && (
                            <div className="flex items-center text-sm bg-white p-2 rounded border border-gray-200">
                              <FaCalendarAlt className="text-gray-500 mr-2" />
                              <div>
                                <p className="text-xs text-gray-600">Duration</p>
                                <p className="font-semibold text-gray-900">{med.duration_days} days</p>
                              </div>
                            </div>
                          )}
                          {med.total_quantity && (
                            <div className="flex items-center text-sm bg-white p-2 rounded border border-gray-200">
                              <FaPills className="text-gray-500 mr-2" />
                              <div>
                                <p className="text-xs text-gray-600">Total Quantity</p>
                                <p className="font-semibold text-gray-900">{med.total_quantity}</p>
                              </div>
                            </div>
                          )}
                          {med.before_after_food && (
                            <div className="flex items-center text-sm bg-white p-2 rounded border border-gray-200">
                              <div>
                                <p className="text-xs text-gray-600">Food</p>
                                <p className="font-semibold text-gray-900">{med.before_after_food}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {med.special_instructions && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs font-semibold text-yellow-900 mb-1">Special Instructions</p>
                            <p className="text-sm text-yellow-800">{med.special_instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Additional Information */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {prescription.structured_data.diagnosis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Diagnosis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{prescription.structured_data.diagnosis}</p>
                  </CardContent>
                </Card>
              )}

              {prescription.structured_data.allergies && prescription.structured_data.allergies.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center text-red-700">
                      <FaExclamationTriangle className="mr-2" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {prescription.structured_data.allergies.map((allergy: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {prescription.structured_data.warnings && prescription.structured_data.warnings.length > 0 && (
              <div
              >
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-700">
                      <FaExclamationTriangle className="mr-2" />
                      Warnings & Precautions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {prescription.structured_data.warnings.map((warning: string, idx: number) => (
                        <li key={idx} className="text-sm text-orange-800 flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div
          >
            <Card>
              <CardHeader>
                <CardTitle>Raw Analysis</CardTitle>
                <CardDescription>Original AI analysis output</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded border overflow-x-auto">
                  {prescription.analysis}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
