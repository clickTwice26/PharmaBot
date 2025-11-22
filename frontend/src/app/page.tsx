'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">PharmaBot</h1>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </main>
  )
}
