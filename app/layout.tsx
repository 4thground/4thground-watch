import './globals.css'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://watch.4thground.com'),
  title: {
    default: '4th Ground Movies | 4th Ground Streaming Platform',
    template: '%s | 4th Ground TV'
  },
  description: 'Watch 4th Ground movies on the official 4th Ground streaming platform. 4th Ground TV and 4th Ground digital films available to rent online. Stream 4th Ground platform originals anywhere.',
  keywords: [
    '4th ground',
    '4th ground movies', 
    '4th ground tv',
    '4th ground platform',
    '4th ground digital',
    '4th ground streaming',
    'watch 4th ground',
    '4th ground films'
  ],
  openGraph: {
    title: '4th Ground Movies | Official Streaming Platform',
    description: 'Stream 4th Ground digital films and originals. The official 4th Ground TV platform.',
    url: 'https://watch.4thground.com',
    siteName: '4th Ground Watch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '4th Ground Movies | 4th Ground Streaming',
    description: 'Official 4th Ground platform for digital films and streaming.',
  },
  alternates: {
    canonical: 'https://watch.4thground.com',
  },
  verification: {
    google: 'riH_cF7hPVnttd-A4GTAobZt9mDa9ODeHp_Rb9d79nM',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />

        {children}

      </body>
    </html>
  )
}
