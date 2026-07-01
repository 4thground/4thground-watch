'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = { type: string; expires: number; progress: number; };
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

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [access, setAccess] = useState<AccessState | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'email' | 'payment'>('email');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const price = film? film.price_usd.toFixed(2) : '0.00';
  const valid = /\S+@\S+\.\S+/.test(email);

  const unlockFilm = () => {
    if (!film) return;
    localStorage.setItem(`4g_access_${film.id}`, JSON.stringify({ type: 'rent', paidAt: Date.now() }));
    setAccess({ type: 'rent', expires: Date.now() + 7 * 24 * 60 * 60 * 1000, progress: 0 });
    setHasAccess(true);
    setShowCheckout(false);
    setCheckoutStep('email');
    setCheckoutUrl(null);
    window.history.replaceState({}, '', `/film/${film.id}`);
  }

  const handleContinue = async () => {
    if (!film) return;
    setEmailError('');
    if (!valid) return setEmailError('Enter a valid email.');

    setLoading(true);
    setCheckoutStep('payment');
    try {
      const origin = window.location.origin;
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          filmId: film.id,
          amount: film.price_usd,
          returnUrl: `${origin}/film/${film.id}?status=success&film=${film.id}`,
          cancelUrl: `${origin}/film/${film.id}?status=cancelled`,
        }),
      });
      const data = await res.json();
      if (!res.ok ||!data.paymentUrl) throw new Error(data.error || 'No payment URL');
      localStorage.setItem('4g_email', email);
      setCheckoutUrl(data.paymentUrl);
    } catch (e: any) {
      setEmailError(e.message || 'Payment failed.');
      setCheckoutStep('email');
    } finally { setLoading(false); }
  };

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!isClient ||!film) return;
    const key = `4g_access_${film.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const { type, paidAt } = JSON.parse(saved);
      const expires = type === 'buy'? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;
      if (expires > Date.now()) {
        setAccess({ type, expires, progress: 0 });
        setHasAccess(true);
      } else {
        localStorage.removeItem(key);
      }
    }
    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) setEmail(savedEmail);
  }, [film, isClient]);

  useEffect(() => {
    if (!isClient ||!film) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success' && params.get('film') === film.id) {
      unlockFilm();
    }
    if (params.get('status') === 'cancelled') {
      setShowCheckout(true);
      setCheckoutStep('email');
      setEmailError('Payment was cancelled. Try again.');
      window.history.replaceState({}, '', `/film/${film.id}`);
    }
  }, [film, isClient]); // <- FIX WAS HERE

  useEffect(() => {
    if (!isClient) return;
    const handler = (event: MessageEvent) => {
      if (event.origin.includes('ikhokha.co.za') && (event.data?.status === 'success' || event.data?.event === 'payment_success')) {
        unlockFilm();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [film, isClient]);

  if (!film) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">Film not found</div>;

  const otherFilms = (films as Film[]).filter((f) => f.id!== film.id);
  const videoIdToPlay = hasAccess? film.bunny_video_id : film.bunny_trailer_id;

  return (
    <main className="bg-black text-white min-h-screen font-sans antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="4th Ground" className="h-7" />
            <span className="text- font-semibold tracking-[0.2em] text-zinc-400">4TH GROUND</span>
          </Link>
        </div>
      </nav>

      <section ref={playerRef} className="relative h-[100svh] w-full flex items-end">
        {isClient && (
          <iframe
            key={videoIdToPlay}
            src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoIdToPlay}?autoplay=false&muted=1&preload=true`}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 lg:px-12 pb-24">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
              {film.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mb-6 font-medium">
              {film.rating && <span className="px-2 py-1 border-white/20 rounded text-xs">{film.rating}</span>}
              {film.year && <span>{film.year}</span>}
              {film.genre && <><span className="text-white/30">•</span><span>{film.genre}</span></>}
              <span className="text-white/30">•</span><span>HD</span>
            </div>
            <p className="text-base lg:text-lg text-zinc-200 mb-8 max-w-2xl leading-relaxed font-medium">
              {film.description}
            </p>
            {!hasAccess && film.available && (
              <button onClick={() => setShowCheckout(true)} className="group inline-flex items-center gap-3 bg-white text-black font-semibold px-10 py-4 rounded-full hover:bg-zinc-200 transition-all text-lg">
                <PlayIcon /> Rent ${price}
              </button>
            )}
            {hasAccess && (
              <button onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })} className="group inline-flex items-center gap-3 bg-white text-black font-semibold px-10 py-4 rounded-full hover:bg-zinc-200 transition-all text-lg">
                <PlayIcon /> Play Now
              </button>
            )}
          </div>
        </div>
      </section>

      {otherFilms.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">More on 4th Ground</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {otherFilms.map((f) => (
              f.available? (
                <Link key={f.id} href={`/film/${f.id}`} className="group flex-shrink-0 w- sm:w- md:w- lg:w- snap-start">
                  <div className="rounded-2xl overflow-hidden transition-all group-hover:scale-[1.03] bg-zinc-900">
                    <img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover w-full" />
                  </div>
                  <p className="font-semibold mt-3 text-lg truncate">{f.title}</p>
                  <p className="text-sm text-zinc-500">${f.price_usd.toFixed(2)}</p>
                </Link>
              ) : (
                <div key={f.id} className="flex-shrink-0 w- sm:w- md:w- lg:w- snap-start opacity-60">
                  <div className="rounded-2xl overflow-hidden relative bg-zinc-900">
                    <img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover blur-sm brightness-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold">Coming Soon</span>
                    </div>
                  </div>
                  <p className="font-semibold mt-3 text-lg truncate text-zinc-400">{f.title}</p>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border-white/10 shadow-2xl p-8 relative">
            <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
              <XIcon />
            </button>
            <h2 className="text-4xl font-black tracking-tighter">Rent {film.title}</h2>
            <p className="text-zinc-400 mt-2 text-lg">7-day access in HD. ${price}</p>

            {checkoutStep === 'email' && (
              <div className="mt-8">
                <label className="block text-sm text-zinc-400 mb-2 font-medium">Email for your receipt</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('4g_email', e.target.value); }} className="w-full rounded-xl bg-black/50 border-white/10 px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-white/30 transition" placeholder="you@email.com" />
                {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
              </div>
            )}

            {checkoutStep === 'payment' && checkoutUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border-white/10">
                <iframe src={checkoutUrl} className="w-full h-[520px]" />
              </div>
            )}

            {checkoutStep === 'email' && (
              <button onClick={handleContinue} disabled={loading} className="w-full mt-8 bg-white text-black rounded-xl py-4 text-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50">
                {loading? 'Processing...' : 'Continue'}
              </button>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 px-6 lg:px-12 py-12 text-sm text-zinc-500">
        <div className="max-w-[1440px] mx-auto">© 2026 4th Ground. All rights reserved.</div>
      </footer>
    </main>
  );
}
