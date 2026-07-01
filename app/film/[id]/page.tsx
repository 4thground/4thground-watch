'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type Film = {
  id: string;
  title: string;
  description: string;
  price_usd: number;
  available: boolean;
  bunny_library_id: string;
  bunny_video_id: string;
  bunny_trailer_id: string;
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);

  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window!== 'undefined') {
      const savedEmail = localStorage.getItem('4g_email');
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  if (!film) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black px-6 py-4">
        <Link href="/">4th Ground</Link>
      </div>

      <div className="relative w-full h-screen bg-black pt-16">
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_trailer_id}`}
          className="w-full h-full"
          allowFullScreen
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-4">{film.title}</h1>
        <p className="text-zinc-300 max-w-2xl">{film.description}</p>

        {film.available && (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-6 bg-white text-black px-8 py-4 rounded-full"
          >
            Rent ${film.price_usd}
          </button>
        )}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-zinc-900 p-8 rounded-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Rent {film.title}</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                localStorage.setItem('4g_email', e.target.value);
              }}
              className="w-full bg-zinc-800 p-3 rounded mb-4"
              placeholder="Email"
            />
            <button onClick={() => setShowCheckout(false)} className="w-full bg-white text-black py-3 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 p-6 text-zinc-500 text-sm text-center">
        © 2026 4th Ground
      </footer>
    </div>
  );
}
