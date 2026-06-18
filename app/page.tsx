import Link from 'next/link'
import films from '@/data/films.json'

export default function Home() {
  const featured = films[0]

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${featured.poster_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <h1 className="text-5xl font-bold mb-4">{featured.title}</h1>
          <Link
            href={`/film/${featured.id}`}
            className="bg-[#2FEB74] text-black font-bold px-8 py-3 rounded-lg"
          >
            Watch Now
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">All Films</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {films.map((film: any) => (
            <Link key={film.id} href={`/film/${film.id}`} className="group">
              <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <img src={film.poster_url} alt={film.title} className="aspect-[2/3] object-cover group-hover:opacity-80" />
                <div className="p-3">
                  <p className="font-semibold truncate">{film.title}</p>
                  <p className="text-sm text-[#2FEB74]">From ${film.rent_price_cents/100}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
