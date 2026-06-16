import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function Watch({ searchParams }: any) {
  const supabase = createClient()
  const { data: rental } = await supabase
    .from('rentals')
    .select('*, films(*)')
    .eq('stripe_session_id', searchParams.session_id)
    .single()

  if (!rental || (rental.type === 'rent' && new Date(rental.expires_at) < new Date())) {
    return notFound()
  }

  const film = rental.films
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-2">{film.title}</h1>
      <p className="text-gray-400 mb-6">
        {rental.type === 'buy' ? 'You own this film' : `Expires: ${new Date(rental.expires_at).toLocaleString()}`}
      </p>
      <div style={{position: 'relative', paddingTop: '56.25%'}}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_video_id}?autoplay=true`}
          className="absolute top-0 w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </main>
  )
}
