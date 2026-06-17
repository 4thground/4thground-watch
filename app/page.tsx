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
    e.stopPropagation()

    // 1. Force embed mode + strip redirect flags
    const cleanUrl = url.replace(/[?&]wanted=true/g, '').replace(/[?&]want=true/g, '')
    const embedUrl = cleanUrl + (cleanUrl.includes('?')? '&' : '?') + 'embed=true'

    // 2. Kill any existing overlays
    document.getElementById('gumroad-overlay')?.remove()

    // 3. Create backdrop
    const backdrop = document.createElement('div')
    backdrop.id = 'gumroad-overlay'
    backdrop.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.9);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px'

    // 4. Create iframe
    const iframe = document.createElement('iframe')
    iframe.src = embedUrl
    iframe.style.cssText = 'width:100%;max-width:500px;height:90vh;max-height:700px;border:0;border-radius:12px;background:#fff'
    iframe.allow = 'payment'
    iframe.setAttribute('scrolling', 'yes')

    // 5. Close handlers
    const closeOverlay = () => {
      backdrop.remove()
      document.body.style.overflow = 'auto'
    }
    backdrop.onclick = (evt) => { if (evt.target === backdrop) closeOverlay() }

    // 6. Close button
    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '×'
    closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:50%;background:#fff;border:0;font-size:32px;line-height:1;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4)'
    closeBtn.onclick = closeOverlay

    // 7. Lock body scroll
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
              src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${activeFilm.video_id}?autoplay=true&preload=true&controls=true`}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={false}
              loading="eager"
            />
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/70 backdrop-blur hover:bg-black/90 transition flex items-center justify-center"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-end">
              <div className="w-full max-w-7xl mx-auto px-4 pb-16 md:pb-24">
                <div className="max-w-2xl">
                  {activeFilm.tag && (
                    <div className="inline-block bg-zinc-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      {activeFilm.tag}
                    </div>
                  )}

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 tracking-tight">
                    {activeFilm.title.toUpperCase()}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                    <span>4th Ground</span>
                    <span>·</span>
                    <span>{activeFilm.genre}</span>
                    <span className="border border-zinc-500 px-1.5 py-0.5 text-xs">{activeFilm.rating}</span>
                  </div>

                  <p className="text-base md:text-lg text-zinc-200 mb-6 leading-relaxed">
                    {activeFilm.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setIsPlaying(true)
                      }}
                      className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-zinc-200 transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 0 004 4.11V15.89a1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Trailer
                    </button>

                    <a
                      href={activeFilm.rent_link}
                      onClick={(e) => handleGumroadClick(e, activeFilm.rent_link)}
                      className="bg-zinc-800/90 backdrop-blur text-white font-semibold px-6 py-3 rounded-md hover:bg-zinc-700 transition"
                    >
                      Rent ${(activeFilm.rent_price_cents / 100).toFixed(2)}
                    </a>

                    <a
                      href={activeFilm.buy_link}
                      onClick={(e) => handleGumroadClick(e, activeFilm.buy_link)}
                      className="bg-zinc-800/90 backdrop-blur text-white font-semibold px-6 py-3 rounded-md hover:bg-zinc-700 transition"
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

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold mb-5">More on 4th Ground</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {suggestedFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => {
                setActiveFilm(film)
                setIsPlaying(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex-shrink-0 w-56 md:w-64 cursor-pointer group"
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
