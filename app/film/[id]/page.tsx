'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 16.5

type Film = {
  id: string
  title: string
  tag?: string
  genre?: string
  rating?: string
  description?: string
  poster_url: string
  backdrop_url?: string
  bunny_library_id: string
  bunny_video_id: string
  bunny_trailer_id: string
  rent_price_cents: number
  buy_price_cents: number
  available: boolean
  year?: number
  language?: string
  director?: string
  cast?: string[]
}

export default function FilmPage() {
  const params = useParams<{ id: string }>()
  const allFilms = films as Film[]

  const [email, setEmail] = useState('')
  const [access, setAccess] = useState<{
    type: string
    expires: number
    progress: number
  } | null>(null)
  const [showTrailerEnd, setShowTrailerEnd] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const playerRef = useRef<HTMLIFrameElement>(null)

  const film = allFilms.find(f => f.id === params.id)
  const otherFilms = film ? allFilms.filter(f => f.id !== film.id) : []

  const zarToUsd = (zarCents: number) => {
    const usd = (zarCents / 100) / ZAR_TO_USD_RATE
    return usd.toFixed(2)
  }

  useEffect(() => {
    if (!film) return

    const savedEmail = localStorage.getItem('4g_email')

    if (savedEmail) {
      setEmail(savedEmail)

      const key = `4g_access_${film.id}_${savedEmail}`
      const saved = localStorage.getItem(key)

      if (saved) {
        const { type, paidAt } = JSON.parse(saved)
        const expires = type === 'buy' ? Infinity : paidAt + 48 * 60 * 60 * 1000
        const progress = Number(
          localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0
        )

        if (expires > Date.now()) {
          setAccess({ type, expires, progress })
        } else {
          localStorage.removeItem(key)
        }
      }
    }
  }, [film])

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreen)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen)
    }
  }, [])

  useEffect(() => {
    if (!film) return

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://iframe.mediadelivery.net') return

      const { event, currentTime } = e.data

      if (event === 'timeupdate' && access && email) {
        localStorage.setItem(
          `4g_progress_${film.id}_${email}`,
          Math.floor(currentTime).toString()
        )
      }

      if (event === 'ended' && !access) {
        setShowTrailerEnd(true)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [access, film, email])

  const payWithPaystack = (type: 'rent' | 'buy') => {
    if (!film) return
    if (!email) return alert('Enter email first')

    localStorage.setItem('4g_email', email)

    const amount = type === 'buy'
      ? film.buy_price_cents
      : film.rent_price_cents

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'ZAR',
      metadata: {
        film_id: film.id,
        type,
      },
      callback: function (response: any) {
        const key = `4g_access_${film.id}_${email}`

        localStorage.setItem(
          key,
          JSON.stringify({
            reference: response.reference,
            type,
            paidAt: Date.now(),
          })
        )

        setTimeout(() => window.location.reload(), 500)
      },
      onClose: function () {},
    })

    handler.openIframe()
  }

  if (!film) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Film not found</h1>
          <Link
            href="/"
            className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200 transition"
          >
            Back Home
          </Link>
        </div>
      </main>
    )
  }

  const videoId = access ? film.bunny_video_id : film.bunny_trailer_id
  const startTime = access?.progress || 0

  return (
    <main className="min-h-screen bg-black text-white">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
        </Link>
      </div>

      {/* Hero Player */}
      <section className="relative h-screen w-full bg-black">
        <iframe
          ref={playerRef}
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoId}?autoplay=true&start=${startTime}&preload=true`}
          className="h-full w-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {showTrailerEnd && !access && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="max-w-lg text-center">
              <h3 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Continue Watching
              </h3>

              <p className="mb-8 text-lg text-zinc-300">
                Rent for 48 hours or buy to own forever.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => payWithPaystack('rent')}
                  className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-zinc-200"
                >
                  Rent ${zarToUsd(film.rent_price_cents)}
                </button>

                <button
                  onClick={() => payWithPaystack('buy')}
                  className="rounded-full border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Buy ${zarToUsd(film.buy_price_cents)}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="relative z-10 mx-auto -mt-40 max-w-6xl px-6 md:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
            {film.title}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
            {film.rating && (
              <span className="rounded border border-zinc-500 px-2 py-0.5 text-xs">
                {film.rating}
              </span>
            )}

            {film.year && <span>{film.year}</span>}

            {film.genre && <span>•</span>}
            {film.genre && <span>{film.genre}</span>}

            {film.language && <span>•</span>}
            {film.language && <span>{film.language}</span>}

            <span>•</span>
            <span>HD</span>
          </div>

          {film.director && (
            <p className="mb-1 text-zinc-300">
              <span className="text-zinc-500">Director:</span> {film.director}
            </p>
          )}

          {film.cast && film.cast.filter(Boolean).length > 0 && (
            <p className="mb-4 text-zinc-300">
              <span className="text-zinc-500">Starring:</span>{' '}
              {film.cast.filter(Boolean).join(', ')}
            </p>
          )}

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-200">
            {film.description}
          </p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <input
              type="email"
              placeholder="Enter email to continue"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-4 w-full max-w-md rounded-xl border border-white/20 bg-white/10 p-4 text-white placeholder:text-zinc-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => payWithPaystack('rent')}
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200"
              >
                Rent ${zarToUsd(film.rent_price_cents)}
              </button>

              <button
                onClick={() => payWithPaystack('buy')}
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Buy ${zarToUsd(film.buy_price_cents)}
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Charged in ZAR. Approx USD shown.
            </p>
          </div>
        )}

        {!film.available && (
          <div className="mb-12">
            <button
              disabled
              className="cursor-not-allowed rounded-full bg-white/10 px-8 py-4 text-lg font-semibold text-zinc-500"
            >
              Coming Soon
            </button>
          </div>
        )}

        {access && (
          <div className="mb-12">
            <button
              onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200"
            >
              {access.progress > 30
                ? `Resume from ${Math.floor(access.progress / 60)}m`
                : 'Play'}
            </button>

            {access.expires !== Infinity && (
              <p className="mt-3 text-xs text-zinc-500">
                Rental expires {new Date(access.expires).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </section>

      {/* More Like This */}
      {!isFullscreen && otherFilms.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <h3 className="mb-4 text-2xl font-bold">More from 4th Ground</h3>

          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {otherFilms.map(f =>
              f.available ? (
                <Link
                  key={f.id}
                  href={`/film/${f.id}`}
                  className="group w-72 flex-shrink-0 snap-start sm:w-80 md:w-96"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <p className="mt-3 truncate text-base font-semibold">
                    {f.title}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    From ${zarToUsd(f.rent_price_cents)}
                  </p>
                </Link>
              ) : (
                <div
                  key={f.id}
                  className="w-72 flex-shrink-0 snap-start sm:w-80 md:w-96"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover brightness-50 blur-sm"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 truncate text-base font-semibold text-zinc-400">
                    {f.title}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-sm text-zinc-500 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p>© 2026 4th Ground. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/support" className="transition hover:text-white">
              Support
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  )
}
