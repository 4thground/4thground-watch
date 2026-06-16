import films from '../data/films.json'

export default function Home() {
  const BUNNY_LIBRARY_ID = '684349'

  return (
    <main className="bg-black min-h-screen text-white p-6">
      <h1 className="text-4xl font-bold mb-8">4th Ground</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {films.map((film) => (
          <div key={film.id} className="bg-zinc-900 rounded-lg overflow-hidden">
            <img 
              src={film.poster_url} 
              alt={film.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{film.title}</h2>
              <p className="text-zinc-400 text-sm mb-4">{film.description}</p>
              
              <div className="mb-4 aspect-video">
                <iframe 
                  src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${film.trailer_video_id}`}
                  loading="lazy"
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 px-4 py-2 rounded">
                  Rent ${(film.rent_price_cents / 100).toFixed(2)}
                </button>
                <button className="bg-zinc-700 px-4 py-2 rounded">
                  Buy ${(film.buy_price_cents / 100).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
