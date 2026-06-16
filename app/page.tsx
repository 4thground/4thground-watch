'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Film = {
  id: number
  title: string
  director: string
  film_cast: string
  genre: string
  year: number
  description: string
  poster_url: string
  bunny_library_id: string
  trailer_video_id: string
}

export default function Home() {
  const [film, setFilm] = useState<Film | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getFilm() {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (error) setError(error.message)
      else setFilm(data)
      setLoading(false)
    }
    getFilm()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Film not found</h1>
          <p className="text-gray-400">{error || 'No film with id=1'}</p>
        </div>
      </div>
    )
  }

  const videoUrl = `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.trailer_video_id}?autoplay=true&responsive=true`

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Poster Image */}
      <div className="fixed inset-0 w-full h-full">
        <img
          src={film.poster_url}
          alt={film.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur px-4 py-2 rounded-md font-bold hover:bg-black/80"
          >
            ✕ Close
          </button>
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}

      {/* Gradient Overlays - Apple TV style */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="fixed inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />

      {/* Content */}
      <main className="relative z-10 flex items-end min-h-screen">
        <div className="px-6 pb-16 md:px-16 md:pb-24 w-full">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 drop-shadow-2xl">
              {film.title}
            </h1>

            {/* Metadata row */}
            <div className="flex items-center gap-3 text-sm md:text-base mb-5 text-gray-200 font-medium flex-wrap">
              <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">4K</span>
              <span>{film.genre}</span>
              <span>•</span>
              <span>{film.year}</span>
              <span>•</span>
              <span>Dir. {film.director}</span>
            </div>

            {/* Description */}
            <p className="text-base md:text-xl leading-relaxed mb-8 text-gray-100 max-w-xl drop-shadow-lg">
              {film.description}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={() => setShowPlayer(true)}
                className="bg-white text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                ▶ Play Trailer
              </button>
              <button className="bg-gray-600/60 backdrop-blur-md border border-gray-500/50 px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-600/80 transition">
                + Watchlist
              </button>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              Starring: {film.film_cast}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
