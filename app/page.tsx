'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pull random movie + random photo
    const fetchRandom = async () => {
      try {
        // 1. Random movie from TMDB
        const randomPage = Math.floor(Math.random() * 500) + 1
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=demo&sort_by=popularity.desc&page=${randomPage}`
        )
        const movieData = await movieRes.json()
        const randomMovie = movieData.results[Math.floor(Math.random() * movieData.results.length)]

        // 2. Random Unsplash photo as fallback poster
        const photoUrl = `https://source.unsplash.com/random/1920x1080/?movie,cinema&${Date.now()}`

        setMovie({
          title: randomMovie.title,
          description: randomMovie.overview,
          poster: `https://image.tmdb.org/t/p/w1280${randomMovie.backdrop_path}` || photoUrl,
          year: randomMovie.release_date?.split('-')[0],
          rating: randomMovie.vote_average
        })
      } catch (e) {
        // Fallback if API fails
        setMovie({
          title: 'Test Film',
          description: 'Random test data loaded',
          poster: `https://source.unsplash.com/random/1920x1080/?film&${Date.now()}`,
          year: '2024',
          rating: 8.5
        })
      }
      setLoading(false)
    }

    fetchRandom()
  }, [])

  if (loading) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading random film...</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <div 
        className="h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{movie.title}</h1>
          <div className="flex gap-4 text-lg mb-4 text-gray-300">
            <span>{movie.year}</span>
            <span>★ {movie.rating}</span>
          </div>
          <p className="text-lg mb-8 text-gray-200 line-clamp-3">{movie.description}</p>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black px-8 py-3 rounded-md text-xl font-bold hover:bg-gray-300"
          >
            ▶ Load Another Random
          </button>
        </div>
      </div>
    </div>
  )
}
