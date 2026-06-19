'use client'
import { useState } from 'react'
import Link from 'next/link'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 18.5
const zarToUsd = (zarCents: number) => ((zarCents / 100) / ZAR_TO_USD_RATE).toFixed(2)

export default function Home() {
  const [search, setSearch] = useState('')
  const featured = films[0]

  // Filter for search + split available vs coming soon
  const filteredFilms = films.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.cast?.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    f.director?.toLowerCase().includes(search.toLowerCase())
  )

  const availableFilms = filteredFilms.filter(f => f.available)
  const comingSoonFilms = filteredFilms.filter(f => !f.available)

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Search Bar - Fixed top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            4th Ground
          </Link>

          <input
            type="text"
            placeholder="Search films, cast, director..."
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
                  className="group flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start"
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
                    From ${zarToUsd(film.rent_price_cents)}
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
                  className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start"
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

        {filteredFilms.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No films found for "{search}"
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
