import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PharmaBot - Prescription Scanner',
  description: 'AI-powered prescription scanning and analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
