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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Film not found</h1>
          <p className="text-gray-400">{error?.message || 'No film with id=1'}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative h-screen w-full">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.trailer_video_id}?autoplay=true&loop=true&muted=true&preload=true`}
          loading="eager"
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover scale-150"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {film.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm md:text-base mb-4 text-gray-300">
              <span>{film.year}</span>
              <span>•</span>
              <span>{film.genre}</span>
              <span>•</span>
              <span>Dir. {film.director}</span>
            </div>

            <p className="text-base md:text-lg max-w-2xl mb-8 text-gray-200 leading-relaxed">
              {film.description}
            </p>

            <div className="flex gap-3">
              <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2">
                ▶ Play
              </button>
              <button className="bg-gray-500/50 backdrop-blur px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-500/70 transition">
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
