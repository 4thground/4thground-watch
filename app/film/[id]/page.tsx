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
          returnUrl: `${window.location.origin}/film/${film.id}?status=success&film=${film.id}`
        }),
      });

      const data = await res.json();

      if (!data.paymentUrl) throw new Error('No payment URL');

      setCheckoutUrl(data.paymentUrl);
    } catch (err) {
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
        type === 'buy'
          ? Infinity
          : paidAt + 7 * 24 * 60 * 60 * 1000;

      const progress = Number(
        localStorage.getItem(`4g_progress_${film.id}`) || 0
      );

      if (expires > Date.now()) {
        setAccess({ type, expires, progress });
      } else {
        localStorage.removeItem(key);
      }
    }

    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);
  }, [film]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const filmId = params.get('film');

    if (status === 'success' && filmId === film?.id) {
      const key = `4g_access_${film.id}`;

      localStorage.setItem(
        key,
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
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreen);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    if (!film) return;

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
        Film not found.
      </div>
    );
  }

  const otherFilms = (films as any[]).filter((f) => f.id !== film.id);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* TOP NAV */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-8" />
          <span className="text-xs text-zinc-400">On DIGITAL</span>
        </Link>
      </div>

      {/* HERO */}
      <div ref={playerRef} className="relative w-full h-screen bg-black">

        <iframe
          src={
            access
              ? `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_video_id}`
              : `https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_trailer_id}`
          }
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />

        {/* overlay icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
            ▶
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {showTrailerEnd && !access && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">Continue Watching</h2>
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold">{film.title}</h1>

        <p className="text-zinc-400 mt-4">{film.description}</p>

        {!access && film.available && (
          <button
            onClick={() => setShowCheckout(true)}
            className="mt-6 bg-white text-black px-6 py-3 rounded-full"
          >
            Rent ${film.price_usd}
          </button>
        )}

        {access && (
          <button
            onClick={() =>
              playerRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mt-6 bg-white text-black px-6 py-3 rounded-full"
          >
            Play
          </button>
        )}
      </div>

      {/* CHECKOUT */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">Rent {film.title}</h2>

            {checkoutStep === 'email' && (
              <input
                className="w-full p-3 rounded bg-zinc-800"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  localStorage.setItem('4g_email', e.target.value);
                }}
              />
            )}

            {checkoutStep === 'payment' && checkoutUrl && (
              <iframe
                src={checkoutUrl}
                className="w-full h-[400px] mt-4"
              />
            )}

            {emailError && (
              <p className="text-red-400 text-sm mt-2">{emailError}</p>
            )}

            <button
              onClick={handleContinue}
              disabled={loading}
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

    </div>
  );
}
