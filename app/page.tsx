'use client'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import films from '../data/films.json'

export default function Home() {
  const BUNNY_LIBRARY_ID = '684349'
  const [activeFilm, setActiveFilm] = useState(films[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [gumroadReady, setGumroadReady] = useState(false)

  const suggestedFilms = films.filter(f => f.id!== activeFilm.id)

  useEffect(() => {
    // Check if Gumroad loaded every 500ms for 5 seconds
    let attempts = 0;
    const checkGumroad = setInterval(() => {
      // @ts-ignore
      if (window.GumroadOverlay) {
        setGumroadReady(true)
        clearInterval(checkGumroad)
      }
      attempts++
      if (attempts > 10) clearInterval(checkGumroad)
    }, 500)
  }, [])

  const openGumroadOverlay = (url: string) => {
    // @ts-ignore
    if (window.GumroadOverlay) {
      // @ts-ignore
      window.GumroadOverlay.open(url);
    } else {
      console.error('Gumroad script not loaded yet')
      alert('Checkout is loading. Please try again in a second.')
    }
  }

  return (
    <>
      <Script
        src="https://gumroad.com/js/gumroad.js"
        strategy="beforeInteractive"
        onLoad={() => {
          // @ts-ignore
          if (window.GumroadOverlay) setGumroadReady(true)
        }}
      />

      <main className="bg-black min-h-screen text-white">
        {/* Hero Section */}
        <div className="relative h-screen w-full overflow-hidden">
          {/* Background - Video or Poster */}
          {isPlaying? (
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${activeFilm.video_id}?autoplay=true`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={activeFilm.poster_url}
                alt={activeFilm.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </>
          )}

          {/* Content Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-end">
              <div className="w-full max-w-7xl mx-auto px-6 pb-20 md:pb-32">
                <div className="max-w-2xl">
                  {activeFilm.tag && (
                    <div className="inline-block bg-zinc-800/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      {activeFilm.tag}
                    </div>
                  )}

                  <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                    {activeFilm.title.toUpperCase()}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-zinc-300 mb-4">
                    <span>4th Ground</span>
                    <span>·</span>
                    <span>{activeFilm.genre}</span>
                    <span className="border border-zinc-500 px-1.5 py-0.5 text-xs">{activeFilm.rating}</span>
                  </div>

                  <p className="text-lg text-zinc-200 mb-8 leading-relaxed">
                    {activeFilm.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-zinc-200 transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Trailer
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openGumroadOverlay(activeFilm.rent_link);
                      }}
                      disabled={!gumroadReady}
                      className="bg-zinc-800/80 backdrop-blur text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Rent ${(activeFilm.rent_price_cents / 100).toFixed(2)}
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openGumroadOverlay(activeFilm.buy_link);
                      }}
                      disabled={!gumroadReady}
                      className="bg-zinc-800/80 backdrop-blur text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy ${(activeFilm.buy_price_cents / 100).toFixed(2)}
                    </button>

                    <button className="w-12 h-12 rounded-full bg-zinc-800/80 backdrop-blur hover:bg-zinc-700 transition flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3">
                    5-Day Rental: You have 5 days to start watching after purchase
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Close video button */}
          {isPlaying && (
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur hover:bg-black/80 transition flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Suggested Films Slider */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">More on 4th Ground</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {suggestedFilms.map((film) => (
              <div
                key={film.id}
                onClick={() => {
                  setActiveFilm(film)
                  setIsPlaying(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex-shrink-0 w-64 cursor-pointer group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-zinc-900">
                  <img
                    src={film.poster_url}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-sm">{film.title}</h3>
                <p className="text-xs text-zinc-400">{film.genre}</p>
              </div>
            ))}
          </div>
        </div>

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
    </>
  )
}
