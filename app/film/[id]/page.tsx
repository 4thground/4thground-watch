'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 18.5

export default function FilmPage({ params }: { params: {id: string} }) {
  const film = films.find(f => f.id === params.id)

  if (!film) return <div className="text-center p-8 text-white">Film not found</div>

  const [email, setEmail] = useState('')
  const [access, setAccess] = useState<{type: string, expires: number, progress: number} | null>(null)
  const [showTrailerEnd, setShowTrailerEnd] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)

  const zarToUsd = (zarCents: number) => {
    const usd = (zarCents / 100) / ZAR_TO_USD_RATE
    return usd.toFixed(2)
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('4g_email')
    if (savedEmail) {
      setEmail(savedEmail)
      const key = `4g_access_${film.id}_${savedEmail}`
      const saved = localStorage.getItem(key)
      if (saved) {
        const { type, paidAt } = JSON.parse(saved)
        const expires = type === 'buy'? Infinity : paidAt + 48 * 60 * 60 * 1000
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0)
        if (expires > Date.now()) {
          setAccess({ type, expires, progress })
        } else {
          localStorage.removeItem(key)
        }
      }
    }
  }, [film.id])

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreen)
    return () => document.removeEventListener('fullscreenchange', handleFullscreen)
  }, [])

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin!== 'https://iframe.mediadelivery.net') return
      const { event, currentTime } = e.data
      if (event === 'timeupdate' && access && email) {
        localStorage.setItem(`4g_progress_${film.id}_${email}`, Math.floor(currentTime).toString())
      }
      if (event === 'ended' &&!access) {
        setShowTrailerEnd(true)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [access, film.id, email])

  const payWithPaystack = (type: 'rent' | 'buy') => {
    if (!email) return alert('Enter email first')
    localStorage.setItem('4g_email', email)
    const amount = type === 'buy'? film.buy_price_cents : film.rent_price_cents

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'ZAR',
      metadata: { film_id: film.id, type },
      callback: function(response: any) {
        const key = `4g_access_${film.id}_${email}`
        localStorage.setItem(key, JSON.stringify({
          reference: response.reference,
          type,
          paidAt: Date.now()
        }))
        setTimeout(() => window.location.reload(), 500)
      },
      onClose: function() {}
    })
    handler.openIframe()
  }

  const videoId = access? film.bunny_video_id : film.bunny_trailer_id
  const startTime = access?.progress || 0
  const otherFilms = films.filter(f => f.id!== film.id).slice(0, 6)

  return (
    <div className="bg-black text-white min-h-screen">
      <script src="https://js.paystack.co/v1/inline.js"></script>

      {/* Hero Player - Full Bleed */}
      <div className="relative w-full h-screen bg-black">
        <iframe
          ref={playerRef}
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoId}?autoplay=true&start=${startTime}&preload=true`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {/* Trailer End Overlay */}
        {showTrailerEnd &&!access && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Continue Watching</h3>
              <p className="text-zinc-300 text-lg mb-8">Rent for 48 hours or buy to own forever.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => payWithPaystack('rent')} className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition">
                  Rent ${zarToUsd(film.rent_price_cents)}
                </button>
                <button onClick={() => payWithPaystack('buy')} className="bg-white/10 backdrop-blur text-white font-semibold px-8 py-3 rounded-full border border-white/20 hover:bg-white/20 transition">
                  Buy ${zarToUsd(film.buy_price_cents)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Apple TV style */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{film.title}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
            <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">HD</span>
            <span>Drama</span>
            <span>•</span>
            <span>2026</span>
          </div>
          <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed">{film.description}</p>
        </div>

        {/* Email + CTA */}
        {!access && (
          <div className="mb-12">
            <input
              type="email"
              placeholder="Enter email to continue"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full max-w-md mb-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => payWithPaystack('rent')} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">
                Rent ${zarToUsd(film.rent_price_cents)}
              </button>
              <button onClick={() => payWithPaystack('buy')} className="bg-white/10 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition text-lg">
                Buy ${zarToUsd(film.buy_price_cents)}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3">Charged in ZAR. Approx USD shown.</p>
          </div>
        )}

        {access && (
          <div className="mb-12">
            <button
              onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg"
            >
              {access.progress > 30? `Resume from ${Math.floor(access.progress / 60)}m` : 'Play'}
            </button>
            {access.expires!== Infinity && (
              <p className="text-xs text-zinc-500 mt-3">
                Rental expires {new Date(access.expires).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* More Like This */}
      {!isFullscreen && otherFilms.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16">
          <h3 className="text-2xl font-bold mb-6">More from 4th Ground</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherFilms.map((f: any) => (
              <Link key={f.id} href={`/film/${f.id}`} className="group">
                <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                  <img src={f.poster_url} alt={f.title} className="aspect-[2/3] object-cover" />
                </div>
                <p className="font-semibold mt-2 text-sm truncate">{f.title}</p>
                <p className="text-xs text-zinc-500">From ${zarToUsd(f.rent_price_cents)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
