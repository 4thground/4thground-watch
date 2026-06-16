import { createClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

async function createCheckout(type: 'rent' | 'buy') {
  'use server'
  const supabase = createClient()
  const { data: film } = await supabase.from('films').select().eq('id', 1).single()
  
  const price = type === 'buy' ? film.buy_price_cents : film.rent_price_cents
  const name = type === 'buy' ? `${film.title} - Buy` : `${film.title} - 48h Rental`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: { name }, unit_amount: price }, quantity: 1 }],
    success_url: `https://watch.4thground.com/watch?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://watch.4thground.com`,
    metadata: { film_id: '1', type }
  })
  redirect(session.url!)
}

export default async function Home() {
  const supabase = createClient()
  const { data: film } = await supabase.from('films').select().eq('id', 1).single()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {/* 16:9 Thumbnail */}
        <div className="relative" style={{paddingTop: '56.25%'}}>
          <img 
            src={film.poster_url} 
            alt={film.title}
            className="absolute top-0 w-full h-full object-cover"
          />
          <a 
            href={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.trailer_video_id}`}
            target="_blank"
            className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded font-semibold"
          >
            Watch Sample
          </a>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-2">{film.title}</h1>
          <p className="text-gray-400 mb-6">
            Directed by {film.director} · {film.genre} · {film.year}
          </p>
          
          <p className="text-gray-300 mb-2"><span className="text-white">Cast:</span> {film.cast}</p>
          <p className="text-gray-300 mb-8">{film.description}</p>

          <div className="flex gap-4">
            <form action={createCheckout.bind(null, 'rent')}>
              <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded font-semibold">
                Rent ${film.rent_price_cents / 100} · 48h
              </button>
            </form>
            <form action={createCheckout.bind(null, 'buy')}>
              <button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded font-semibold">
                Buy ${film.buy_price_cents / 100}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
