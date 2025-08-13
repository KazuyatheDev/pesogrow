import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'PesoGrow - Philippine Digital Bank Interest Rate Comparison Tool',
  description: 'Compare interest rates and calculate earnings across Philippines digital banks including GCash, Maya Bank, Tonik, CIMB, SeaBank, and more. Find the best savings account and time deposit rates for your money.',
  keywords: 'Philippines digital banks, interest rates, savings calculator, GCash, Maya Bank, Tonik, CIMB, SeaBank, GoTyme, Pag-IBIG MP2, digital banking Philippines, best savings account Philippines, time deposit rates',
  authors: [{ name: 'PesoGrow Team' }],
  creator: 'PesoGrow',
  publisher: 'PesoGrow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pesogrow.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PesoGrow - Philippine Digital Bank Interest Rate Comparison',
    description: 'Compare and calculate earnings from Philippine digital banks. Find the best interest rates for your savings.',
    url: 'https://pesogrow.com',
    siteName: 'PesoGrow',
    images: [
      {
        url: '/logos/pesogrow.jpg',
        width: 1200,
        height: 630,
        alt: 'PesoGrow - Philippine Digital Bank Comparison Tool',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PesoGrow - Philippine Digital Bank Interest Rate Comparison',
    description: 'Compare and calculate earnings from Philippine digital banks. Find the best interest rates for your savings.',
    images: ['/logos/pesogrow.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
