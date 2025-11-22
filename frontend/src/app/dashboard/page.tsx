'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPills, FaUpload, FaImage, FaRobot, FaSignOutAlt, 
  FaCheckCircle, FaTimesCircle, FaSpinner, FaBars, FaTimes,
  FaHistory, FaUser
} from 'react-icons/fa'
import { authService, prescriptionService } from '@/lib/api'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileChange(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first')
      return
    }

    setLoading(true)

    try {
      const response = await prescriptionService.analyzePrescription(selectedFile)
      setResult(response)
      toast.success('Prescription analyzed successfully!')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to analyze prescription')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully')
    setTimeout(() => router.push('/login'), 500)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster position="top-center" />
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FaPills className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  PharmaBot
                </h1>
                <p className="text-xs text-gray-500">AI Prescription Scanner</p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button variant="ghost" size="sm">
                  <FaHistory className="mr-2" />
                  History
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 space-y-2"
              >
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <FaHistory className="mr-2" />
                  History
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Analyze Your Prescription
          </h2>
          <p className="text-gray-600">Upload a prescription image to get instant AI-powered analysis</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaUpload className="mr-2 text-indigo-600" />
                Upload Prescription
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
                className={`
                  relative border-3 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
                  ${isDragging 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : preview 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                  }
                `}
                whileHover={{ scale: preview ? 1 : 1.02 }}
                whileTap={{ scale: preview ? 1 : 0.98 }}
              >
                {preview ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt="Prescription preview"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReset()
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <FaImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {isDragging ? 'Drop image here' : 'Click or drag image here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                )}
              </motion.div>

              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaCheckCircle className="text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    isLoading={loading}
                    className="w-full"
                    size="lg"
                  >
                    <FaRobot className="mr-2" />
                    Analyze with AI
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaRobot className="mr-2 text-purple-600" />
                AI Analysis Results
              </h3>

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
                    <p className="text-lg font-semibold text-gray-700">Analyzing prescription...</p>
                    <p className="text-sm text-gray-500">This may take a few seconds</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-2">Analysis Complete</h4>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-white p-4 rounded border">
                            {result.analysis}
                          </pre>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                      Analyze Another Prescription
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaRobot className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">No analysis yet</p>
                      <p className="text-sm text-gray-500">Upload a prescription to get started</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card hover className="text-center">
            <FaRobot className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">AI-Powered</h4>
            <p className="text-sm text-gray-600">Advanced Gemini AI for accurate analysis</p>
          </Card>
          <Card hover className="text-center">
            <FaCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Instant Results</h4>
            <p className="text-sm text-gray-600">Get analysis in seconds</p>
          </Card>
          <Card hover className="text-center">
            <FaUser className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Secure & Private</h4>
            <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
