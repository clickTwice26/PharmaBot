'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCamera, FaUpload, FaImage, FaTimes, FaRobot,
  FaCheckCircle, FaSpinner, FaPills, FaUser,
  FaClock, FaCalendarAlt, FaExclamationTriangle
} from 'react-icons/fa'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AppLayout from '@/components/layout/AppLayout'
import { prescriptionService } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'

export default function ScanPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setSelectedFile(file)
    setResult(null)
    setScanning(true)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
      // Simulate scanning effect
      setTimeout(() => {
        setScanning(false)
        toast.success('Image loaded successfully!')
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setLoading(true)
    try {
      const response = await prescriptionService.analyzePrescription(selectedFile)
      setResult(response)
      toast.success('Analysis complete!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <AppLayout>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <FaCamera className="mr-3 text-indigo-600" />
            Scan Prescription
          </h2>
          <p className="text-gray-600">
            Upload a prescription image for analysis
          </p>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto">
            {/* Upload Section */}
            <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {!preview ? (
              <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all">
                <CardContent className="p-0">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`p-12 text-center cursor-pointer transition-all ${
                      isDragging ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                      <FaCamera className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Prescription
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click to browse or drag and drop your file here
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">PNG</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">JPG</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full">JPEG</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Image Preview */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                    
                    {/* Scanning Effect Overlay */}
                    {scanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-40">
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div
                            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-75"
                            style={{ boxShadow: '0 0 20px 4px rgba(99, 102, 241, 0.8)' }}
                            animate={{
                              top: ['0%', '100%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: 0,
                              ease: 'linear',
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 px-6 py-3 rounded-full">
                            <p className="text-sm font-semibold text-indigo-600">Scanning...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Corner Frame Effect */}
                    {!scanning && (
                      <>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500"></div>
                      </>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReset()
                      }}
                      className="absolute top-3 right-3 p-2.5 bg-white hover:bg-red-50 text-red-600 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>

                    {/* File Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{selectedFile?.name}</p>
                      <p className="text-white/80 text-xs">
                        {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {selectedFile && !result && !scanning && (
              <div className="space-y-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Analyze Prescription
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center h-96 space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-indigo-200 rounded-full"></div>
                      <div className="absolute inset-0 w-24 h-24 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-gray-900">Processing Image</p>
                      <p className="text-sm text-gray-600">Extracting prescription details...</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        ) : (
          // Results View - Full Width
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaCheckCircle className="text-white" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-green-900 text-xl">Analysis Complete</h4>
                    <p className="text-sm text-green-700">Your prescription has been successfully processed</p>
                  </div>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  <FaCamera className="mr-2" />
                  New Scan
                </Button>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
            </div>

            {result.structured_data ? (
              <>
                {/* Patient Information Card */}
                {result.structured_data.patient_details && (
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                      <CardTitle className="flex items-center text-gray-900">
                        <FaUser className="mr-3 text-indigo-600" size={20} />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Patient Name</p>
                          <p className="text-lg font-bold text-gray-900">{result.structured_data.patient_details.patient_name || 'Not Specified'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Age</p>
                          <p className="text-lg font-bold text-gray-900">{result.structured_data.patient_details.patient_age || 'Not Specified'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Gender</p>
                          <p className="text-lg font-bold text-gray-900">{result.structured_data.patient_details.patient_gender || 'Not Specified'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">Doctor</p>
                          <p className="text-lg font-bold text-gray-900">{result.structured_data.doctor_name || 'Not Specified'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Medications Section */}
                {result.structured_data.medications && result.structured_data.medications.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <FaPills className="mr-3 text-purple-600" size={24} />
                        Prescribed Medications ({result.structured_data.medications.length})
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {result.structured_data.medications.map((med: any, index: number) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                      <FaPills className="text-white" size={18} />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-bold text-gray-900">{med.medicine_name}</h4>
                                      {med.generic_name && (
                                        <p className="text-sm text-gray-600">({med.generic_name})</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {med.frequency_code && (
                                  <Badge className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 border-indigo-200">
                                    {med.frequency_code}
                                  </Badge>
                                )}
                              </div>

                              <Separator />

                              {/* Dosage Information */}
                              <div className="grid grid-cols-2 gap-4">
                                {med.dosage && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Dosage</p>
                                    <p className="text-sm font-semibold text-gray-900">{med.dosage}</p>
                                  </div>
                                )}
                                {med.duration && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Duration</p>
                                    <p className="text-sm font-semibold text-gray-900">{med.duration}</p>
                                  </div>
                                )}
                                {med.frequency && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Frequency</p>
                                    <p className="text-sm font-semibold text-gray-900">{med.frequency}</p>
                                  </div>
                                )}
                                {med.route && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Route</p>
                                    <p className="text-sm font-semibold text-gray-900">{med.route}</p>
                                  </div>
                                )}
                              </div>

                              {/* Timing Schedule */}
                              {med.timing && med.timing.length > 0 && (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                  <p className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                                    <FaClock className="mr-2" />
                                    Daily Schedule
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {med.timing.map((time: string, idx: number) => (
                                      <div key={idx} className="bg-white border-2 border-blue-300 rounded-lg px-4 py-2">
                                        <p className="text-lg font-bold text-blue-700 font-mono">{time}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Instructions */}
                              {med.instructions && (
                                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center">
                                    <FaExclamationTriangle className="mr-1" size={12} />
                                    Instructions
                                  </p>
                                  <p className="text-sm text-amber-800">{med.instructions}</p>
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
                  {result.structured_data.diagnosis && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Diagnosis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{result.structured_data.diagnosis}</p>
                      </CardContent>
                    </Card>
                  )}
                  {result.structured_data.allergies && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-base text-red-900 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          Allergies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-red-700 font-semibold">{result.structured_data.allergies}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => router.push('/dashboard/history')}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    size="lg"
                  >
                    <FaCheckCircle className="mr-2" />
                    Save to History
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <FaCamera className="mr-2" />
                    Scan Another
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Raw Analysis</h4>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {result.analysis}
                    </pre>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <FaCamera className="mr-2" />
                      Scan Another
                    </Button>
                    <Button onClick={() => router.push('/dashboard/history')} className="flex-1">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
