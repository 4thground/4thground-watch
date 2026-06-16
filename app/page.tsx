import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: film } = await supabase
    .from('films')
    .select('*')
    .eq('id', 1)
    .single()

  if (!film) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found</div>
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        <iframe
          src={`https://www.youtube.com/embed/${film.trailer_youtube_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${film.trailer_youtube_id}`}
          className="w-full h-full object-cover"
          allow="autoplay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{film.title}</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">{film.description}</p>
          <div className="flex gap-4">
            <button className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200">
              ▶ Play
            </button>
            <button className="bg-gray-500/70 px-8 py-3 rounded font-bold hover:bg-gray-500/50">
              More Info
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
