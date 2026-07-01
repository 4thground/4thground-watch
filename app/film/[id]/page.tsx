'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = { type: string; expires: number; progress: number; };
type Film = {
  id: string;
  title: string;
  description: string;
  price_usd: number; // Your JSON has this
  rent_price_cents?: number; // Make optional so build passes
  available: boolean;
  bunny_library_id: string;
  bunny_video_id: string;
  bunny_trailer_id: string;
  poster_url?: string;
  backdrop_url?: string;
  rating?: string;
  year?: number;
  genre?: string;
  language?: string;
  director?: string;
  cast?: string[];
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [access, setAccess] = useState<AccessState | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'email' | 'payment'>('email');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Use rent_price_cents if exists, else fallback to price_usd
  const price_cents = film? (film.rent_price_cents?? Math.round(film.price_usd * 100)) : 0;
  const price = (price_cents / 100).toFixed(2);
  const valid = /\S+@\S+\.\S+/.test(email);

  const handleContinue = async () => {
    if (!film) return;
    setEmailError('');
    if (!valid) return setEmailError('Please enter a valid email address.');

    setLoading(true);
    setCheckoutStep('payment');
    try {
      const origin = typeof window!== 'undefined'? window.location.origin : '';
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          filmId: film.id,
          amount_cents: price_cents, // Send cents to Stripe
          returnUrl: `${origin}/film/${film.id}?status=success&film=${film.id}`,
        }),
      });
      const data = await res.json();
      if (!data.paymentUrl) throw new Error('No payment URL');
      localStorage.setItem('4g_email', email);
      setCheckoutUrl(data.paymentUrl);
    } catch {
      setEmailError('Payment failed. Try again.');
      setCheckoutStep('email');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!film) return;
    const key = `4g_access_${film.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const { type, paidAt } = JSON.parse(saved);
      const expires = type === 'buy'? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;
      const progress = Number(localStorage.getItem(`4g_progress_${film.id}`) || 0);
      if (expires > Date.now()) setAccess({ type, expires, progress });
      else localStorage.removeItem(key);
    }
    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);
  }, [film]);

  useEffect(() => {
    if (typeof window === 'undefined' ||!film) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success' && params.get('film') === film.id) {
      localStorage.setItem(`4g_access_${film.id}`, JSON.stringify({ type: 'rent', paidAt: Date.now() }));
      setAccess({ type: 'rent', expires: Date.now() + 7 * 24 * 60 * 60 * 1000, progress: 0 });
      setShowCheckout(false);
      setCheckoutStep('email');
      setCheckoutUrl(null);
      window.history.replaceState({}, '', `/film/${film.id}`);
    }
  }, [film]);

  if (!film) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found</div>;

  const otherFilms = (films as Film[]).filter((f) => f.id!== film.id);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* NAV = Homepage */}
      {/* NAV = Fixed on top */}
<header className="fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 flex items-center">
  <div className="max-w-7xl mx-auto w-full flex items-center gap-2">
    <Link href="/" className="flex items-center gap-2">
      <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
      <span className="text-xs font-semibold tracking-widest text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded">On DIGITAL</span>
    </Link>
  </div>
</header>

{/* HERO = Starts right below nav, no gap */}
<div ref={playerRef} className="relative w-full pt-16"> 
  <div className="relative w-full aspect-video md:aspect-[16/9] lg:aspect-[21/9] bg-black">
    <iframe
      src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${access? film.bunny_video_id : film.bunny_trailer_id}`}
      className="absolute inset-0 w-full h-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-12 z-10">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-3 tracking-tight">{film.title}</h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm text-zinc-300 mb-3">
          {film.rating && <span className="px-2 py-0.5 border-zinc-500 rounded text-xs">{film.rating}</span>}
          {film.year && <span>{film.year}</span>}
          {film.genre && <><span>•</span><span>{film.genre}</span></>}
          <span>•</span><span>HD</span>
        </div>

        <p className="text-sm sm:text-base md:text-lg text-zinc-200 mb-6 max-w-xl leading-relaxed">{film.description}</p>

        {!access && film.available && (
          <button onClick={() => setShowCheckout(true)} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-base md:text-lg inline-block">Rent ${price}</button>
        )}
        {access && (
          <button onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-base md:text-lg inline-block">
            {access.progress > 30? `Resume ${Math.floor(access.progress / 60)}m` : 'Play Now'}
          </button>
        )}
      </div>
    </div>
  </div>
</div>

      {/* MORE FILMS = Homepage Row */}
      {otherFilms.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h2 className="text-2xl font-bold mb-4">More from 4th Ground</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {otherFilms.map((f) => {
              const other_price = ((f.rent_price_cents?? Math.round(f.price_usd * 100)) / 100).toFixed(2);
              return f.available? (
                <Link key={f.id} href={`/film/${f.id}`} className="group flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2">
                  <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105"><img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover" /></div>
                  <p className="font-semibold mt-3 text-base truncate">{f.title}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">{f.year && <span>{f.year}</span>}{f.genre && <span>• {f.genre}</span>}</div>
                  <p className="text-sm text-zinc-400 mt-1">From ${other_price}</p>
                </Link>
              ) : (
                <div key={f.id} className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border-neutral-800 rounded-lg p-2">
                  <div className="rounded-lg overflow-hidden relative"><img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover blur-sm brightness-50" /><div className="absolute inset-0 flex items-center justify-center"><span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border-white/20">Coming Soon</span></div></div>
                  <p className="font-semibold mt-3 text-base truncate text-zinc-400">{f.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHECKOUT = Email -> Continue -> Pay -> Close */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl bg-zinc-900 border-zinc-800 shadow-2xl p-8">
            <h2 className="text-3xl font-bold">Rent {film.title}</h2>
            <p className="text-zinc-400 mt-2">Watch instantly for 7 days in HD. ${price}</p>

            {checkoutStep === 'email' && (
              <div className="mt-8">
                <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('4g_email', e.target.value); }} className="w-full rounded-xl bg-zinc-800 border-zinc-700 px-4 py-4 outline-none focus:ring-2 focus:ring-white/50" placeholder="you@email.com" />
                {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
              </div>
            )}

            {checkoutStep === 'payment' && checkoutUrl && (
              <div className="mt-6"><iframe src={checkoutUrl} className="w-full h-[600px] rounded-xl border-zinc-700" /></div>
            )}

            <button onClick={handleContinue} disabled={loading || checkoutStep === 'payment'} className="w-full mt-8 bg-white text-black rounded-xl py-4 font-semibold hover:bg-zinc-200 transition disabled:opacity-50">
              {loading? 'Please wait...' : checkoutStep === 'email'? 'Continue' : 'Redirecting...'}
            </button>

            <button onClick={() => { setShowCheckout(false); setCheckoutStep('email'); setCheckoutUrl(null); }} className="w-full mt-3 text-zinc-400 hover:text-white">Close</button>
          </div>
        </div>
      )}

      {/* FOOTER = Homepage */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-white transition">Terms</Link><Link href="/privacy" className="hover:text-white transition">Privacy</Link><Link href="/support" className="hover:text-white transition">Support</Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5"><p>© 2026 4th Ground. All rights reserved.</p></div>
        </div>
      </footer>

      <style jsx global>{`.scrollbar-hide::-webkit-scrollbar { display: none; }.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </main>
  );
}
