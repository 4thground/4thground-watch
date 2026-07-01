'use client';

import { useState, useEffect, useRef } from 'react';
import films from '@/data/films.json';
import { Play, X, Lock, Check } from 'lucide-react';

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

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);

  const [hasAccess, setHasAccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const valid = /\S+@\S+\.\S+/.test(email);
  const price = film? film.price_usd.toFixed(2) : '0.00';
  const price_zar = film? Math.round(film.price_usd * 18) : 0; // R18 rate

  // ========================= ACCESS CHECK
  useEffect(() => {
    if (!film) return;
    fetch(`/api/access?filmId=${film.id}`)
     .then(r => r.json())
     .then(d => setHasAccess(!!d.hasAccess))
     .catch(() => setHasAccess(false));
  }, [film]);

  // ========================= EMAIL + LISTENER
  useEffect(() => {
    setIsClient(true);
    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);

    const handler = (event: MessageEvent) => {
      if (event.data?.status === 'payment_success' && event.data?.filmId === film?.id) {
        setHasAccess(true);
        setShowCheckout(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [film]);

  // ========================= PAYMENT POPUP
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
          amount: film.price_usd, // iKhokha expects ZAR, so change this if needed
          returnUrl: `${origin}/film/${film.id}/success?filmId=${film.id}`,
        }),
      });
      const data = await res.json();
      if (!res.ok ||!data.paymentUrl) throw new Error(data.error || 'Payment URL missing');
      localStorage.setItem('4g_email', email);

      const w = 500, h = 700;
      const y = window.top!.outerHeight / 2 + window.top!.screenY - h / 2;
      const x = window.top!.outerWidth / 2 + window.top!.screenX - w / 2;
      window.open(data.paymentUrl, 'ikhokhaCheckout', `width=${w},height=${h},top=${y},left=${x},resizable=no`);
      setShowCheckout(false);

    } catch (err: any) {
      setEmailError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!film) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Film not found</div>;

  const videoIdToPlay = hasAccess? film.bunny_video_id : film.bunny_trailer_id;

  return (
    <main className="bg-black text-white min-h-screen font-sans antialiased overflow-hidden">
      {/* 1. PLAYER: Full Screen */}
      <section className="relative h-[100svh] w-full">
        {isClient && (
          <iframe
            key={videoIdToPlay}
            src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoIdToPlay}?autoplay=true&muted=true&loop=true&responsive=true`}
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}

        {/* Apple TV Gradient: Black at bottom to read text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* 2. CONTENT OVERLAY: Apple TV style */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-16 max-w-4xl">
          <div className="flex items-center gap-3 text-sm text-white/60 font-medium mb-3">
            {film.year && <span>{film.year}</span>}
            {film.genre && <><span>•</span><span>{film.genre}</span></>}
            {film.rating && <><span>•</span><span>★ {film.rating}</span></>}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-balance">
            {film.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl leading-relaxed">
            {film.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            {hasAccess? (
              <button className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition">
                <Play size={24} fill="black" /> Play Film
              </button>
            ) : film.available && (
              <button
                onClick={() => setShowCheckout(true)}
                className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition shadow-2xl"
              >
                <Lock size={22} /> Rent ${price} / R{price_zar}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. CHECKOUT MODAL: Glass */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4" onClick={() => setShowCheckout(false)}>
          <div className="bg-white/10 border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition"><X /></button>
            <h2 className="text-3xl font-bold">Rent {film.title}</h2>
            <p className="text-white/60 mt-2">7-day access. Watch anywhere.</p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-6 p-4 rounded-lg bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="you@email.com"
            />
            {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}

            <button
              onClick={handleContinue}
              disabled={loading ||!valid}
              className="w-full mt-4 bg-white text-black py-4 rounded-xl font-semibold text-lg disabled:opacity-40 hover:bg-white/90 transition"
            >
              {loading? 'Loading...' : `Continue R${price_zar}`}
            </button>
            <p className="text-xs text-white/40 text-center mt-3">Secure checkout. This window will close when done.</p>
          </div>
        </div>
      )}

      {/* 4. SUCCESS TOAST */}
      {hasAccess && (
        <div className="fixed top-6 right-6 bg-green-500/90 backdrop-blur-lg border-green-300/50 rounded-xl p-4 flex items-center gap-3 z-50 shadow-2xl animate-in fade-in">
          <Check size={20} /> <span className="font-semibold">Access Unlocked</span>
        </div>
      )}
    </main>
  );
}
