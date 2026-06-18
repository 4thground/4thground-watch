import Link from 'next/link'
import films from '@/data/films.json'

const ZAR_TO_USD_RATE = 18.5
const zarToUsd = (zarCents: number) => ((zarCents / 100) / ZAR_TO_USD_RATE).toFixed(2)

export default function Home() {
  const featured = films[0]

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero */}
      <div className="relative h-screen w-full">
        <img
          src={featured.poster_url}
          className="absolute inset-0 w-full h-full object-cover"
          alt={featured.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-20 left-6 md:left-12 max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">{featured.title}</h1>
          <p className="text-lg text-zinc-300 mb-8 max-w-xl">{featured.description}</p>
          <Link
            href={`/film/${featured.id}`}
            className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg inline-block"
          >
            Watch Now
          </Link>
        </div>
      </div>

      {/* Row */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-2xl font-bold mb-6">Featured on 4th Ground</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {films.map((film: any) => (
            <Link key={film.id} href={`/film/${film.id}`} className="group">
              <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <img src={film.poster_url} alt={film.title} className="aspect-[2/3] object-cover" />
              </div>
              <p className="font-semibold mt-2 text-sm truncate">{film.title}</p>
              <p className="text-xs text-zinc-500">From ${zarToUsd(film.rent_price_cents)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
