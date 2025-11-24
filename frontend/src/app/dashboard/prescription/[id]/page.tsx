'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FaPills, FaUser, FaClock, FaCalendarAlt, 
  FaExclamationTriangle, FaArrowLeft, FaDownload, FaFileAlt
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
        {/* Header with Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/history')}
          className="mb-2 hover:bg-gray-100"
        >
          <FaArrowLeft className="mr-2" />
          Back to History
        </Button>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                  <FaPills className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{prescription.filename}</h1>
                  <p className="text-indigo-100 text-sm flex items-center mt-1">
                    <FaClock className="mr-2" size={14} />
                    Scanned on {formatDate(prescription.created_at)}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <FaDownload className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {prescription.structured_data ? (
          <div className="space-y-6">
            {/* Patient Information */}
            {prescription.structured_data.patient_details && (
              <Card className="border-t-4 border-t-indigo-600">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="flex items-center text-gray-900">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <FaUser className="text-white" size={18} />
                    </div>
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient Name</p>
                      <p className="text-lg font-bold text-gray-900">
                        {prescription.structured_data.patient_details.patient_name || 'Not Specified'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</p>
                      <p className="text-lg font-bold text-gray-900">
                        {prescription.structured_data.patient_details.patient_age || 'Not Specified'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</p>
                      <p className="text-lg font-bold text-gray-900">
                        {prescription.structured_data.patient_details.patient_gender || 'Not Specified'}
                      </p>
                    </div>
                    {prescription.structured_data.patient_details.patient_id && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient ID</p>
                        <p className="text-lg font-bold text-gray-900">
                          {prescription.structured_data.patient_details.patient_id}
                        </p>
                      </div>
                    )}
                  </div>
                  {prescription.structured_data.doctor_name && (
                    <>
                      <Separator className="my-6" />
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prescribing Doctor</p>
                        <p className="text-lg font-bold text-gray-900">{prescription.structured_data.doctor_name}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Medications */}
            {prescription.structured_data.medications && prescription.structured_data.medications.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <FaPills className="text-white" size={18} />
                    </div>
                    Prescribed Medications
                    <Badge className="ml-3 bg-purple-100 text-purple-700 border-purple-300">
                      {prescription.structured_data.medications.length} {prescription.structured_data.medications.length === 1 ? 'Medication' : 'Medications'}
                    </Badge>
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {prescription.structured_data.medications.map((med: any, index: number) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
                      <CardContent className="p-6">
                        <div className="space-y-5">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaPills className="text-white" size={20} />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{med.medicine_name}</h4>
                                {med.generic_name && (
                                  <p className="text-sm text-gray-600 mt-1">Generic: {med.generic_name}</p>
                                )}
                              </div>
                            </div>
                            {med.frequency_code && (
                              <Badge className={`text-sm px-3 py-1.5 font-semibold ${
                                med.frequency_code === 'TID' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                med.frequency_code === 'BID' ? 'bg-green-100 text-green-800 border-green-300' :
                                med.frequency_code === 'QD' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                med.frequency_code === 'QID' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }`}>
                                {med.frequency_code}
                              </Badge>
                            )}
                          </div>

                          <Separator />

                          {/* Medication Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Strength</p>
                              <p className="font-bold text-gray-900">{med.strength || 'Not Specified'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Form</p>
                              <p className="font-bold text-gray-900">{med.dosage_form || 'Not Specified'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Dose</p>
                              <p className="font-bold text-gray-900">{med.quantity_per_dose || 'Not Specified'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Frequency</p>
                              <p className="font-bold text-gray-900">{med.frequency || 'Not Specified'}</p>
                            </div>
                          </div>

                          {/* Timing Schedule */}
                          {med.timing && med.timing.length > 0 && (
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                              <p className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                                <FaClock className="mr-2" size={16} />
                                Daily Schedule
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {med.timing.map((time: string, idx: number) => (
                                  <div key={idx} className="bg-white border-2 border-blue-300 rounded-lg px-4 py-3 shadow-sm">
                                    <p className="text-lg font-bold text-blue-800 font-mono">{time}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {med.duration_days && (
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <FaCalendarAlt className="text-green-600" size={16} />
                                  <div>
                                    <p className="text-xs font-semibold text-green-700">Duration</p>
                                    <p className="font-bold text-green-900">{med.duration_days} days</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {med.total_quantity && (
                              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <FaPills className="text-indigo-600" size={16} />
                                  <div>
                                    <p className="text-xs font-semibold text-indigo-700">Total Quantity</p>
                                    <p className="font-bold text-indigo-900">{med.total_quantity}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {med.before_after_food && (
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
                                <div>
                                  <p className="text-xs font-semibold text-amber-700">Food Instructions</p>
                                  <p className="font-bold text-amber-900">{med.before_after_food}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Special Instructions */}
                          {med.special_instructions && (
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-4">
                              <p className="text-sm font-bold text-yellow-900 mb-2 flex items-center">
                                <FaExclamationTriangle className="mr-2" size={14} />
                                Special Instructions
                              </p>
                              <p className="text-sm text-yellow-800">{med.special_instructions}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescription.structured_data.diagnosis && (
                <Card className="border-t-4 border-t-cyan-600">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <CardTitle className="text-base flex items-center">
                      <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <FaFileAlt className="text-white" />
                      </div>
                      Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-900 leading-relaxed">{prescription.structured_data.diagnosis}</p>
                  </CardContent>
                </Card>
              )}

              {prescription.structured_data.allergies && prescription.structured_data.allergies.length > 0 && (
                <Card className="border-t-4 border-t-red-600">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                    <CardTitle className="text-base flex items-center">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                        <FaExclamationTriangle className="text-white" />
                      </div>
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {prescription.structured_data.allergies.map((allergy: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800 border border-red-300 px-3 py-1">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {prescription.structured_data.warnings && prescription.structured_data.warnings.length > 0 && (
              <Card className="border-t-4 border-t-orange-600">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <FaExclamationTriangle className="text-white" />
                    </div>
                    Warnings & Precautions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {prescription.structured_data.warnings.map((warning: string, idx: number) => (
                      <li key={idx} className="text-gray-900 flex items-start bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <span className="text-orange-600 font-bold mr-3 mt-0.5">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
