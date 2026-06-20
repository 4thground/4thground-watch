import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: '4thground Watch',
  description: 'Watch 4th Ground films',
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
