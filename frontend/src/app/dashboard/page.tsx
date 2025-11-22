'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, prescriptionService } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError('')
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await prescriptionService.analyzePrescription(selectedFile)
      setResult(response)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze prescription')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">PharmaBot</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Prescription</h2>
            
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select prescription image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {preview && (
              <div className="mb-6">
                <img
                  src={preview}
                  alt="Prescription preview"
                  className="max-w-md mx-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Prescription'}
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {result.analysis}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
