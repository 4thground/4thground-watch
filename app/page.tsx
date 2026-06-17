'use client'
import { useState } from 'react'
import films from '../data/films.json'

export default function Home() {
  const BUNNY_LIBRARY_ID = '684349'
  const [activeFilm, setActiveFilm] = useState(films[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const suggestedFilms = films.filter(f => f.id!== activeFilm.id)

  const handleGumroadClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()

    // 1. Strip?wanted=true and force embed mode
    const cleanUrl = url.replace('?wanted=true', '').replace('?want=true', '')
    const embedUrl = cleanUrl + (cleanUrl.includes('?')? '&' : '?') + 'embed=true'

    // 2. Remove any existing overlays
    const existing = document.getElementById('gumroad-manual-overlay')
    if (existing) document.body.removeChild(existing)

    // 3. Create backdrop
    const backdrop = document.createElement('div')
    backdrop.id = 'gumroad-manual-overlay'
    backdrop.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px'

    // 4. Create iframe with Gumroad embed
    const iframe = document.createElement('iframe')
    iframe.src = embedUrl
    iframe.style.cssText = 'width:100%;max-width:500px;height:90vh;max-height:750px;border:0;border-radius:12px;background:white'
    iframe.allow = 'payment'
    iframe.setAttribute('scrolling', 'yes')

    // 5. Close on backdrop click
    backdrop.onclick = (evt) => {
      if (evt.target === backdrop) {
        document.body.removeChild(backdrop)
        document.body.style.overflow = 'auto'
      }
    }

    // 6. Close button
    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '×'
    closeBtn.style.cssText = 'position:absolute;top:16px;right:16px;width:40px;height:40px;border-radius:50%;background:white;border:0;font-size:28px;line-height:1;cursor:pointer;z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,0.3)'
    closeBtn.onclick = () => {
      document.body.removeChild(backdrop)
      document.body.style.overflow = 'auto'
    }

    // 7. Prevent body scroll
    document.body.style.overflow = 'hidden'

    backdrop.appendChild(iframe)
    backdrop.appendChild(closeBtn)
    document.body.appendChild(backdrop)
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <div className="relative h-screen w-full overflow-hidden">
        {isPlaying? (
          <>
            <iframe
              key={activeFilm.video_id}
              src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${activeFilm.video_id}?autoplay=true&preload=true`}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={false}
              loading="eager"
            />
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur hover:bg-black/80 transition flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <img
              src={activeFilm.poster_url}
              alt={activeFilm.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

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
                      onClick={(e) => {
                        e.preventDefault()
                        setIsPlaying(true)
                      }}
                      className="bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-zinc-200 transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Trailer
                    </button>

                    <a
                      href={activeFilm.rent_link}
                      onClick={(e) => handleGumroadClick(e, activeFilm.rent_link)}
                      className="bg-zinc-800/80 backdrop-blur text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-700 transition"
                    >
                      Rent ${(activeFilm.rent_price_cents / 100).toFixed(2)}
                    </a>

                    <a
                      href={activeFilm.buy_link}
                      onClick={(e) => handleGumroadClick(e, activeFilm.buy_link)}
                      className="bg-zinc-800/80 backdrop-blur text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-700 transition"
                    >
                      Buy ${(activeFilm.buy_price_cents / 100).toFixed(2)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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
       .scrollbar-hide::-webkit-scrollbar { display: none; }
       .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  )
}
