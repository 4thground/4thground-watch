import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: film, error } = await supabase
    .from('films')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading film...</p>
      </div>
    )
  }

  const videoUrl = `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.trailer_video_id}?autoplay=true&loop=true&muted=true&preload=true&responsive=true`

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fullscreen Background Video */}
      <div className="fixed inset-0 w-full h-full">
        <iframe
          src={videoUrl}
          className="absolute top-1/2 left-1/2 w-screen h-screen -translate-x-1/2 -translate-y-1/2 scale-[1.5] md:scale-125"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        {/* Fallback poster if video fails */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${film.poster_url})`, zIndex: -1 }}
        />
      </div>

      {/* Gradient Overlays - Apple TV style */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="fixed inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <main className="relative z-10 flex items-end min-h-screen">
        <div className="px-6 pb-16 md:px-16 md:pb-24 w-full">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 drop-shadow-2xl">
              {film.title}
            </h1>

            {/* Metadata row */}
            <div className="flex items-center gap-3 text-sm md:text-base mb-5 text-gray-200 font-medium">
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
            <div className="flex gap-3">
              <button className="bg-white text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2">
                ▶ Play
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
