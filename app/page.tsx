'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function WatchPage() {
  const [film, setFilm] = useState<any>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    const getFilm = async () => {
      const { data } = await supabase.from('films').select('*').eq('id', 1).single()
      setFilm(data)
    }
    getFilm()
  }, [])

  if (!film) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white">
      {showPlayer ? (
        <div className="fixed inset-0 bg-black z-50">
          <button onClick={() => setShowPlayer(false)} className="absolute top-4 right-4 z-50 text-2xl bg-black/50 rounded-full w-10 h-10">✕</button>
          <iframe
            src={`https://iframe.mediadelivery.net/embed/684349/${film.trailer_video_id}?autoplay=true`}
            loading="lazy"
            className="w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div 
          className="h-screen w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${film.poster_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{film.title}</h1>
            <p className="text-lg mb-8 text-gray-200">{film.description}</p>
            
            <button 
              onClick={() => setShowPlayer(true)}
              className="bg-white text-black px-8 py-3 rounded-md text-xl font-bold hover:bg-gray-300"
            >
              ▶ Play Trailer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
