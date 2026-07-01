'use client';

import { useState, useEffect, useRef } from 'react';
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
  poster_url?: string;
  backdrop_url?: string;
  rating?: string;
  year?: number;
  genre?: string;
};

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [hasAccess, setHasAccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const price = film? film.price_usd.toFixed(2) : '0.00';
  const valid = /\S+@\S+\.\S+/.test(email);

  // =========================
  // CHECK ACCESS FROM SERVER
  // =========================
  useEffect(() => {
    if (!film) return;
    const checkAccess = async () => {
      try {
        const res = await fetch(`/api/access?filmId=${film.id}`);
        const data = await res.json();
        setHasAccess(!!data.hasAccess);
      } catch {
        setHasAccess(false);
      }
    };
    checkAccess();
  }, [film]);

  // =========================
  // EMAIL STORAGE ONLY
  // =========================
  useEffect(() => {
    setIsClient(true);
    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // =========================
  // KEY: LISTEN FOR POPUP TO TELL US PAYMENT IS DONE
  // =========================
  useEffect(() => {
    if (!isClient ||!film) return;
    const handler = (event: MessageEvent) => {
      // iKhokha success page will send this
      if (event.data?.status === 'payment_success' && event.data?.filmId === film.id) {
        setHasAccess(true); // Unlock instantly, no refresh
        setShowCheckout(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [film, isClient]);

  // =========================
  // PAYMENT HANDLER - POPUP VERSION
  // =========================
  const handleContinue = async () => {
    if (!film) return;
    setEmailError('');
    if (!valid) return setEmailError('Enter a valid email.');
    setLoading(true);

    try {
      const origin = window.location.origin;
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          filmId: film.id,
          amount: film.price_usd,
          // KEY: Return to /success so popup can close itself
          returnUrl: `${origin}/film/${film.id}/success?filmId=${film.id}`,
        }),
      });
      const data = await res.json();
      if (!res.ok ||!data.paymentUrl) throw new Error(data.error || 'Payment URL missing');
      localStorage.setItem('4g_email', email);

      // POPUP INSTEAD OF REDIRECT
      const w = 500, h = 700;
      const y = window.top!.outerHeight / 2 + window.top!.screenY - h / 2;
      const x = window.top!.outerWidth / 2 + window.top!.screenX - w / 2;
      window.open(data.paymentUrl, 'ikhokhaCheckout', `width=${w},height=${h},top=${y},left=${x},resizable=no`);
      setShowCheckout(false); // Close our modal

    } catch (err: any) {
      setEmailError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GUARD
  // =========================
  if (!film) {
    return <div className="min-h-screen flex items-center justify-center text-white">Film not found</div>;
  }

  const videoIdToPlay = hasAccess? film.bunny_video_id : film.bunny_trailer_id;

  return (
    <main className="bg-black text-white min-h-screen">
      {/* PLAYER */}
      <section ref={playerRef} className="relative h-[100svh] w-full">
        {isClient && (
          <iframe
            key={videoIdToPlay}
            src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoIdToPlay}`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
      </section>

      {/* RENT BUTTON */}
      {!hasAccess && film.available && (
        <button
          onClick={() => setShowCheckout(true)}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold z-20"
        >
          Rent ${price}
        </button>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-lg relative">
            <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4">
              <XIcon />
            </button>
            <h2 className="text-2xl font-bold">Rent {film.title}</h2>
            <p className="text-zinc-400 mt-2">7-day access • ${price}</p>
            <div className="mt-6">
              <label className="text-sm text-zinc-400">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-3 rounded bg-black border-white/20"
                placeholder="you@email.com"
              />
              {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full mt-4 bg-white text-black py-3 rounded font-bold disabled:opacity-50"
              >
                {loading? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
