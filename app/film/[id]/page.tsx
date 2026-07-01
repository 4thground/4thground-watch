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

type Step = 'email' | 'payment';

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);

  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);

    const key = `4g_access_${params.id}`;
    const savedAccess = localStorage.getItem(key);
    if (savedAccess) setAccess(true);
  }, [params.id]);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found
      </div>
    );
  }

  const videoSrc = access
    ? `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_video_id}`
    : `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_trailer_id}`;

  const handleContinue = async () => {
    if (!email.includes('@')) return;

    setLoading(true);
    setStep('payment');

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          filmId: film.id,
          amount: film.price_usd,
          returnUrl: `${window.location.origin}/payment/success?film=${film.id}`
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        setCheckoutUrl(data.paymentUrl);
      }
    } catch (err) {
      console.error(err);
      setStep('email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAV */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur px-6 py-4 flex justify-between">
        <Link href="/" className="font-bold">4th Ground</Link>
      </div>

      {/* PLAYER */}
      <div className="relative w-full h-screen pt-16">
        <iframe
          src={videoSrc}
          className="w-full h-full"
          allowFullScreen
        />
      </div>

      {/* INFO */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-5xl font-bold">{film.title}</h1>
        <p className="text-zinc-300 mt-4 max-w-2xl">{film.description}</p>

        {!access && film.available && (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-6 bg-white text-black px-8 py-4 rounded-full font-semibold"
          >
            Rent ${film.price_usd}
          </button>
        )}

        {access && (
          <p className="mt-6 text-green-400">
            You have access to this film
          </p>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">

          <div className="bg-zinc-900 w-full max-w-md p-8 rounded-2xl">

            <h2 className="text-2xl font-bold mb-4">
              Rent {film.title}
            </h2>

            {step === 'email' && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    localStorage.setItem('4g_email', e.target.value);
                  }}
                  placeholder="Email"
                  className="w-full p-3 bg-zinc-800 rounded mb-4"
                />

                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="w-full bg-white text-black py-3 rounded font-semibold"
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </>
            )}

            {step === 'payment' && checkoutUrl && (
              <iframe
                src={checkoutUrl}
                className="w-full h-[500px] rounded"
              />
            )}

            <button
              onClick={() => setShowCheckout(false)}
              className="w-full mt-4 text-zinc-400"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 p-6 text-center text-zinc-500 text-sm">
        © 2026 4th Ground
      </footer>

    </div>
  );
}
