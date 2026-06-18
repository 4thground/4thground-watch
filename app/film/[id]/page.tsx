'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Store your films as JSON in repo: /data/films.json
import films from '@/data/films.json'

export default function FilmPage({ params }: { params: {id: string} }) {
  const film = films.find(f => f.id === params.id)
  const [email, setEmail] = useState('')
  const [access, setAccess] = useState<{type: string, expires: number, progress: number} | null>(null)
  const [showTrailerEnd, setShowTrailerEnd] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)

  // Load email + check access from localStorage + verify with Paystack
  useEffect(() => {
    const savedEmail = localStorage.getItem('4g_email')
    if (savedEmail) setEmail(savedEmail)
    
    const checkAccess = async () => {
      const key = `4g_access_${film.id}_${savedEmail}`
      const saved = localStorage.getItem(key)
      if (!saved) return
      
      const { reference, type } = JSON.parse(saved)
      
      // Verify with Paystack that payment is real + get expiry
      const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}` }
      })
      const data = await res.json()
      
      if (data.status && data.data.status === 'success') {
        const paidAt = new Date(data.data.paid_at).getTime()
        const expires = type === 'buy' ? Infinity : paidAt + 48 * 60 * 60 * 1000 // 48hr
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0)
        
        if (expires > Date.now()) {
          setAccess({ type, expires, progress })
        } else {
          localStorage.removeItem(key) // expired
        }
      }
    }
    
    if (savedEmail) checkAccess()
  }, [film.id, email])

  // Fullscreen detection for hiding "Watch More"
  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreen)
    return () => document.removeEventListener('fullscreenchange', handleFullscreen)
  }, [])

  // Save watch progress + detect trailer end
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://iframe.mediadelivery.net') return
      const { event, currentTime } = e.data
      
      if (event === 'timeupdate' && access) {
        localStorage.setItem(`4g_progress_${film.id}_${email}`, Math.floor(currentTime).toString())
      }
      
      if (event === 'ended' && !access) {
        setShowTrailerEnd(true)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [access, film.id, email])

  const payWithPaystack = (type: 'rent' | 'buy') => {
    if (!email) return alert('Enter email first')
    localStorage.setItem('4g_email', email)
    
    const amount = type === 'buy' ? film.buy_price_cents : film.rent_price_cents
    
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'ZAR',
      metadata: { film_id: film.id, type },
      callback: function(response: any) {
        // Save reference to localStorage immediately
        const key = `4g_access_${film.id}_${email}`
        localStorage.setItem(key, JSON.stringify({ reference: response.reference, type }))
        alert('Payment successful! Loading film...')
        setTimeout(() => window.location.reload(), 1000) // refresh to verify + unlock
      },
    })
    handler.openIframe()
  }

  const renderButton = () => {
    if (access) {
      const resumeText = access.progress > 30 
        ? `Continue Watching from ${Math.floor(access.progress / 60)}m` 
        : 'Play'
      return (
        <button 
          onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#2FEB74] text-black font-bold px-8 py-3 rounded-lg"
        >
          {resumeText}
        </button>
      )
    }
    
    return (
      <div className="flex gap-3 justify-center">
        <button onClick={() => payWithPaystack('rent')} className="bg-[#2FEB74] text-black font-bold px-6 py-3 rounded-lg">
          Rent R{film.rent_price_cents/100}
        </button>
        <button onClick={() => payWithPaystack('buy')} className="bg-zinc-800 text-white font-bold px-6 py-3 rounded-lg border border-zinc-700">
          Buy R{film.buy_price_cents/100}
        </button>
      </div>
    )
  }

  const videoId = access ? film.bunny_video_id : film.bunny_trailer_id
  const startTime = access?.progress || 0
  const otherFilms = films.filter(f => f.id !== film.id).slice(0, 4)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script src="https://js.paystack.co/v1/inline.js"></script>
      
      {/* Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
        <iframe 
          ref={playerRef}
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoId}?autoplay=true&t=${startTime}`}
          className="w-full h-full" 
          allow="autoplay; fullscreen" 
          allowFullScreen
        />
        
        {/* Trailer End Overlay */}
        {showTrailerEnd && !access && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h3 className="text-3xl font-bold mb-2">That was just the trailer</h3>
              <p className="text-zinc-300 mb-6">Watch the full film now. Rent for 48hrs or own it forever.</p>
              {renderButton()}
            </div>
          </div>
        )}
      </div>

      {/* Title + Email + Buttons */}
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{film.title}</h1>
        <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">{film.description}</p>
        
        <input 
          type="email" 
          placeholder="Enter email to rent, buy, or resume" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="bg-zinc-800 p-3 rounded w-full max-w-sm mb-4" 
        />
        
        {renderButton()}
        
        {access && access.expires !== Infinity && (
          <p className="text-xs text-zinc-500 mt-3">
            Rental expires: {new Date(access.expires).toLocaleString()}
          </p>
        )}
      </div>

      {/* Watch More - hidden in fullscreen */}
      {!isFullscreen && otherFilms.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Watch More from 4th Ground</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherFilms.map((f: any) => (
              <Link key={f.id} href={`/film/${f.id}`} className="group">
                <div className="bg-zinc-900 rounded-lg overflow-hidden">
                  <img src={f.poster_url} className="aspect-[2/3] object-cover group-hover:opacity-80" />
                  <div className="p-3">
                    <p className="font-semibold truncate">{f.title}</p>
                    <p className="text-sm text-[#2FEB74]">From R{f.rent_price_cents/100}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
