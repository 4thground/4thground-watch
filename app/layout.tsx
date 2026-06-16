import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="border-b border-gray-900 py-5">
          <div className="max-w-4xl mx-auto px-6">
            <a href="/" className="text-2xl font-bold">4TH GROUND</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
