'use client'

import { useState, useRef } from 'react'
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

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setSelectedFile(file)
    setResult(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    toast.success('Image loaded successfully!')
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <FaCamera className="mr-3 text-indigo-400" />
            Scan Prescription
          </h2>
          <p className="text-zinc-400">
            Upload a prescription image for AI analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaUpload className="mr-2 text-indigo-600" />
                  Upload Image
                </CardTitle>
                <CardDescription>Drag & drop or click to select</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-950/30'
                      : 'border-zinc-700 hover:border-indigo-600 hover:bg-zinc-800/50'
                  }`}
                >
                  <FaCamera className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                  <p className="text-sm font-semibold text-zinc-300 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>

                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 relative"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg shadow-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReset()
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                )}

                {selectedFile && !result && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-2" />
                        Analyze Prescription
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaRobot className="mr-2 text-purple-600" />
                  Analysis Results
                </CardTitle>
                <CardDescription>AI-powered prescription analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64 space-y-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <FaSpinner className="w-16 h-16 text-indigo-600" />
                      </motion.div>
                      <p className="text-lg font-semibold text-white">Analyzing prescription...</p>
                      <p className="text-sm text-zinc-400">This may take a few seconds</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-3 p-4 bg-green-950/30 border border-green-900/50 rounded-lg mb-4">
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-semibold text-green-400">Analysis Complete</h4>
                          <p className="text-sm text-green-300/70 mt-1">Successfully analyzed prescription</p>
                        </div>
                      </div>

                      {result.structured_data ? (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                          {/* Patient Information */}
                          {result.structured_data.patient_details && (
                            <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/30 p-4 rounded-lg border border-indigo-900/50">
                              <h4 className="text-sm font-bold mb-3 flex items-center text-white">
                                <FaUser className="mr-2 text-indigo-400" />
                                Patient Information
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-zinc-400 mb-1">Name</p>
                                  <p className="font-semibold text-white">{result.structured_data.patient_details.patient_name || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-zinc-400 mb-1">Age</p>
                                  <p className="font-semibold text-white">{result.structured_data.patient_details.patient_age || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {result.structured_data.medications && result.structured_data.medications.length > 0 && (
                            <div className="space-y-3">
                              {result.structured_data.medications.map((med: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h5 className="font-bold text-white flex items-center">
                                        <FaPills className="mr-2 text-purple-400" size={16} />
                                        {med.medicine_name}
                                      </h5>
                                      {med.generic_name && (
                                        <p className="text-xs text-zinc-400 mt-1">({med.generic_name})</p>
                                      )}
                                    </div>
                                    {med.frequency_code && (
                                      <Badge className={
                                        med.frequency_code === 'TID' ? 'bg-blue-100 text-blue-700' :
                                        med.frequency_code === 'BID' ? 'bg-green-100 text-green-700' :
                                        'bg-purple-100 text-purple-700'
                                      }>
                                        {med.frequency_code}
                                      </Badge>
                                    )}
                                  </div>

                                  {med.timing && med.timing.length > 0 && (
                                    <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg">
                                      <p className="text-xs font-semibold text-blue-300 mb-2 flex items-center">
                                        <FaClock className="mr-1" />
                                        Timing
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {med.timing.map((time: string, idx: number) => (
                                          <span key={idx} className="px-2 py-1 bg-blue-900/30 border border-blue-800 rounded text-xs font-mono text-blue-300">
                                            {time}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                          <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans overflow-x-auto">
                            {result.analysis}
                          </pre>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={handleReset} className="flex-1">
                          Scan Another
                        </Button>
                        <Button onClick={() => router.push('/dashboard/history')} className="flex-1">
                          View History
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-64 text-center"
                    >
                      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <FaRobot className="w-10 h-10 text-zinc-500" />
                      </div>
                      <p className="text-lg font-semibold text-white mb-1">No analysis yet</p>
                      <p className="text-sm text-zinc-400">Upload a prescription to get started</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
