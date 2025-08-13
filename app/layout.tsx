import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PesoGrow - Your Peso Growth Companion',
  description: 'Compare interest rates and earnings across Philippine digital banks. Find the best savings account for your money.',
  keywords: 'Philippines digital banks, interest rates, savings calculator, GCash, Maya Bank, Tonik, CIMB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {children}
      </body>
    </html>
  )
}