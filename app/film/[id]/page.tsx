'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = {
  type: string;
  expires: number;
  progress: number;
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);

  const playerRef = useRef<HTMLDivElement | null>(null);

  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'email' | 'payment'>('email');

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const valid = /\S+@\S+\.\S+/.test(email);

  const handleContinue = async () => {
    setEmailError('');

    if (!valid) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setCheckoutStep('payment');

    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          filmId: film.id,
          amount: film.price_usd,
          returnUrl: `${window.location.origin}/film/${film.id}?status=success&film=${film.id}`,
        }),
      });

      const data = await res.json();

      if (!data.paymentUrl) throw new Error('No payment URL');

      setCheckoutUrl(data.paymentUrl);
    } catch {
      setEmailError('Payment failed. Try again.');
      setCheckoutStep('email');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!film) return;

    const key = `4g_access_${film.id}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      const { type, paidAt } = JSON.parse(saved);

      const expires =
        type === 'buy' ? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;

      const progress = Number(
        localStorage.getItem(`4g_progress_${film.id}`) || 0
      );

      if (expires > Date.now()) {
        setAccess({ type, expires, progress });
      }
    }
  }, [film]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const filmId = params.get('film');

    if (status === 'success' && filmId === film?.id) {
      localStorage.setItem(
        `4g_access_${film.id}`,
        JSON.stringify({ type: 'rent', paidAt: Date.now() })
      );

      setAccess({
        type: 'rent',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        progress: 0,
      });

      setShowCheckout(false);
      window.history.replaceState({}, '', `/film/${film.id}`);
    }
  }, [film]);

  useEffect(() => {
    const handleFullscreen = () =>
      setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener('fullscreenchange', handleFullscreen);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://iframe.mediadelivery.net') return;

      const { event, currentTime } = e.data;

      if (event === 'timeupdate' && access) {
        localStorage.setItem(
          `4g_progress_${film.id}`,
          Math.floor(currentTime).toString()
        );
      }

      if (event === 'ended' && !access) {
        setShowTrailerEnd(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [access, film]);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found
      </div>
    );
  }

  const otherFilms = (films as any[]).filter((f) => f.id !== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAV */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-b from-black via-black/80">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-8" />
        </Link>
      </div>

      {/* HERO */}
      <div ref={playerRef} className="relative w-full h-screen bg-black">
        <iframe
          className="w-full h-full"
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${
            access ? film.bunny_video_id : film.bunny_trailer_id
          }`}
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        {showTrailerEnd && !access && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl mb-4">Continue Watching</h2>
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-white text-black px-6 py-3 rounded-full"
              >
                Rent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 -mt-40 relative z-10">
        <h1 className="text-6xl font-bold mb-4">{film.title}</h1>

        <p className="text-zinc-300 max-w-xl">{film.description}</p>

        {!access && (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-6 bg-white text-black px-8 py-4 rounded-full"
          >
            Rent ${film.price_usd}
          </button>
        )}
      </div>

      {/* CHECKOUT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl w-[90%] max-w-md">
            {checkoutStep === 'email' && (
              <>
                <input
                  className="w-full p-3 rounded bg-zinc-800"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-400 mt-2">{emailError}</p>
                )}
              </>
            )}

            {checkoutStep === 'payment' && checkoutUrl && (
              <iframe className="w-full h-[500px]" src={checkoutUrl} />
            )}

            <button
              onClick={handleContinue}
              className="w-full mt-4 bg-white text-black py-3 rounded"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>

            <button
              onClick={() => setShowCheckout(false)}
              className="w-full mt-2 text-zinc-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20 p-10 text-zinc-500 text-sm">
        © 2026 4th Ground
      </footer>
    </div>
  );
}
