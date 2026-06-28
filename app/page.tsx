'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import films from '@/data/films.json'


type ExternalResult = {
  type: 'external' | 'none'
  title?: string
  director?: string
  plot?: string
  poster?: string | null
  filmmakerNoFilms?: boolean
}
export default function Home() {
  const [search, setSearch] = useState('')
    const [externalResult, setExternalResult] = useState<ExternalResult | null>(null)
  const [loadingExternal, setLoadingExternal] = useState(false)
  const featured = films[0]

  // Filter for search + split available vs coming soon
  const filteredFilms = films.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.cast?.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    f.director?.toLowerCase().includes(search.toLowerCase())
  )

  const availableFilms = filteredFilms.filter(f => f.available)
  const comingSoonFilms = filteredFilms.filter(f => !f.available)
  useEffect(() => {
    const run = async () => {
      if (!search.trim() || filteredFilms.length > 0) {
        setExternalResult(null)
        return
      }
      setLoadingExternal(true)
      setExternalResult(null)
      try {
        const res = await fetch(`/api/external-search?q=${encodeURIComponent(search)}`)
        const data = await res.json()
        setExternalResult(data)
      } catch {
        setExternalResult({ type: 'none' })
      } finally {
        setLoadingExternal(false)
      }
    }
    const t = setTimeout(run, 500)
    return () => clearTimeout(t)
  }, [search, filteredFilms.length])
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Search Bar - Fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
            <span className="text-xs font-semibold tracking-widest text-zinc-400 border-zinc-700 px-2 py-0.5 rounded">
              OnDIGITAL
            </span>
          </Link>
    


          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full w-full max-w-md text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-screen w-full">
        <img
          src={featured.poster_url}
          className="absolute inset-0 w-full h-full object-cover"
          alt={featured.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-8 left-5 right-5 md:bottom-24 md:left-12 md:right-auto max-w-3xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold mb-3 md:mb-4 tracking-tight">
            {featured.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 md:gap-x-4 gap-y-2 text-xs md:text-sm text-zinc-300 mb-3 md:mb-4">
            {featured.rating && (
              <span className="px-2 py-0.5 border border-zinc-500 rounded text-xs">
                {featured.rating}
              </span>
            )}

            {featured.year && <span>{featured.year}</span>}

            {featured.genre && <span>•</span>}
            {featured.genre && <span>{featured.genre}</span>}

            {featured.language && <span>•</span>}
            {featured.language && <span>{featured.language}</span>}

            <span>•</span>
            <span>HD</span>
          </div>

          {/* Cast & Director */}
          {featured.director && (
            <p className="text-zinc-300 mb-1 text-sm md:text-base">
              <span className="text-zinc-500">Director:</span> {featured.director}
            </p>
          )}

          {featured.cast && featured.cast.length > 0 && (
            <p className="text-zinc-300 mb-3 md:mb-4 text-sm md:text-base">
              <span className="text-zinc-500">Starring:</span> {featured.cast.join(', ')}
            </p>
          )}

          <p className="text-sm sm:text-base md:text-lg text-zinc-200 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            {featured.description}
          </p>

          <Link
            href={`/film/${featured.id}`}
            className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-base md:text-lg inline-block"
          >
            Watch Now
          </Link>
        </div>
      </div>

      {/* Swipe Rows */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
        {/* Available Films Row */}
        {availableFilms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Featured on 4th Ground</h2>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {availableFilms.map((film: any) => (
                <Link
                  key={film.id}
                  href={`/film/${film.id}`}
                  className="group flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2"
                >
                  <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                    <img
                      src={film.backdrop_url || film.poster_url}
                      alt={film.title}
                      className="aspect-video object-cover"
                    />
                  </div>

                  <p className="font-semibold mt-3 text-base truncate">
                    {film.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    {film.year && <span>{film.year}</span>}
                    {film.genre && <span>• {film.genre}</span>}
                  </div>

                  <p className="text-sm text-zinc-400 mt-1">
                    From ${(film.rent_price_cents / 100).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Row */}
        {comingSoonFilms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {comingSoonFilms.map((film: any) => (
                <div
                  key={film.id}
                  className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2"
                >
                  <div className="rounded-lg overflow-hidden relative">
                    <img
                      src={film.backdrop_url || film.poster_url}
                      alt={film.title}
                      className="aspect-video object-cover blur-sm brightness-50"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold mt-3 text-base truncate text-zinc-400">
                    {film.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
                    {film.year && <span>{film.year}</span>}
                    {film.genre && <span>• {film.genre}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                {filteredFilms.length === 0 && search.trim() && (
          <div className="max-w-5xl mx-auto py-20">
            {loadingExternal? (
              <div className="text-center py-20 text-zinc-500">Searching external sources...</div>
            ) : externalResult?.type === 'external'? (
              <div className="space-y-6">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-neutral-800">
                  <img src={externalResult.poster || '/no-poster.jpg'} alt={externalResult.title || search} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center p-6">
                    <div>
                      <p className="font-bold text-2xl md:text-3xl text-white mb-2">
                        **This film is not yet available on 4th Ground**
                      </p>
                      {externalResult.filmmakerNoFilms && (
                        <p className="text-zinc-300 font-semibold">**Films for this filmmaker are not available**</p>
                      )}
                    </div>
                  </div>
                </div>
                {!externalResult.filmmakerNoFilms && (
                  <div className="text-left space-y-1 px-2">
                    <h3 className="text-xl font-bold">{externalResult.title}</h3>
                    {externalResult.director && (<p className="text-zinc-400"><span className="text-zinc-500">Director:</span> {externalResult.director}</p>)}
                    {externalResult.plot && (<p className="text-sm text-zinc-400 mt-2">{externalResult.plot}</p>)}
                  </div>
                )}
                <div className="text-center pt-4">
                  <button onClick={() => setSearch('')} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-base md:text-lg inline-block">
                    Explore more films on DIGITAL
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-zinc-500">No films found for "{search}"</div>
                <button onClick={() => setSearch('')} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-base md:text-lg inline-block">
                  Explore more films on DIGITAL
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-8 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 4th Ground. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/support" className="hover:text-white transition">
              Support
            </Link>

            <Link href="/terms" className="hover:text-white transition">
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
