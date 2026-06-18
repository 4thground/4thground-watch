'use client';
import { useState } from 'react';
import filmsData from '@/data/films.json';

type Film = {
  id: string;
  title: string;
  tag: string;
  genre: string;
  rating: string;
  description: string;
  poster_url: string;
  bunny_library_id: string;
  bunny_video_id: string;
  bunny_trailer_id: string;
  rent_price_cents: number;
  buy_price_cents: number;
};

const films: Film[] = filmsData;

export default function Home() {
  const [activeFilm, setActiveFilm] = useState<Film>(films[0]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).replace('ZAR', 'R');
  };

  const handlePaystack = (priceInCents: number, type: 'Rent' | 'Buy') => {
    const handler = window.PaystackPop.setup({
      key: 'pk_test_a791af4cb2299bd3a6dd12c0469a4be5f466d8ef', // Replace with pk_live_... for production
      email: 'customer@example.com', // You should collect this from user
      amount: priceInCents,
      currency: 'ZAR',
      ref: `${activeFilm.id}-${Date.now()}`,
      metadata: {
        film_id: activeFilm.id,
        film_title: activeFilm.title,
        purchase_type: type,
      },
      callback: function(response: any) {
        alert('Payment complete! Reference: ' + response.reference);
        // Here you redirect to watch page or unlock video
        // window.location.href = `/watch/${activeFilm.id}?ref=${response.reference}`;
      },
      onClose: function() {
        alert('Transaction cancelled');
      }
    });
    handler.openIframe();
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <div
        className="relative h-[80vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${activeFilm.poster_url})` }}
      >
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#141414] via-transparent to-black/30"></div>
        <div className="relative z-10 flex h-full flex-col justify-end p-4 pb-20 md:p-16">
          <h1 className="text-4xl md:text-6xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {activeFilm.title}
          </h1>
          <p className="max-w-xl mt-4 text-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
            {activeFilm.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => handlePaystack(activeFilm.rent_price_cents, 'Rent')}
              className="bg-[#E50914] text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition"
            >
              Rent {formatPrice(activeFilm.rent_price_cents)}
            </button>
            <button
              onClick={() => handlePaystack(activeFilm.buy_price_cents, 'Buy')}
              className="bg-zinc-800/80 backdrop-blur text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-700 transition"
            >
              Buy {formatPrice(activeFilm.buy_price_cents)}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-16 -mt-16 relative z-20">
        <h2 className="text-2xl font-bold mb-4">Our Films</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {films.map((film) => (
            <div
              key={film.id}
              className="cursor-pointer group"
              onClick={() => setActiveFilm(film)}
            >
              <img
                src={film.poster_url}
                alt={film.title}
                className={`w-full h-auto rounded-md transition-transform duration-300 group-hover:scale-105 ${activeFilm.id === film.id? 'border-4 border-[#E50914]' : 'border-4 border-transparent'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
