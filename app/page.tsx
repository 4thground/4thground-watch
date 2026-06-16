import { createClient } from '@supabase/supabase-js'

// Connect to Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  // Fetch the film with id = 1 from your database
  const { data: film, error } = await supabase
    .from('films')
    .select('*')
    .eq('id', 1)
    .single()

  // Show error if film not found or Supabase fails
  if (error || !film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Film not found</h1>
          <p className="text-gray-400">Check your Supabase table and RLS policies</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Trailer Video Background */}
      <div className="relative h-screen w-full">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.trailer_video_id}?autoplay=true&loop=true&muted=true&preload=true`}
          loading="eager"
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover scale-150"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        {/* Film Info */}
        <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {film.title}
            </
