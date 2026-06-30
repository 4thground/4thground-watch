'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = {
  type: string;
  expires: number;
  progress: number;
  url: string; // <-- Added: signed Bunny HLS url
};

declare global {
  interface Window {
    ikPay: any; // iKhokha SDK
  }
}

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);

  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  
  // PAYMENT STATE - NEW
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false); // iKhokha SDK Modal

  useEffect(() => {
    if (!film) return;

    // 1. CHANGED: Check localStorage cache, not backend KV
    const saved = localStorage.getItem(`4g_access_${film.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expires > Date.now()) {
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}`) || 0);
        setAccess({...data, progress });
      } else {
        localStorage.removeItem(`4g_access_${film.id}`); // Expired
      }
    }
  }, [film]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  useEffect(() => {
    if (!film) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin!== 'https://iframe.mediadelivery.net') return;
      const { event, currentTime } = e.data;
      if (event === 'timeupdate' && access) {
        localStorage.setItem(`4g_progress_${film.id}`, Math.floor(currentTime).toString());
      }
      if (event === 'ended' &&!access) {
        setShowTrailerEnd(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [access, film]);

  // 2. CHANGED: 2-step rent flow
  const handleRentClick = () => setShowEmail(true); // Step 1: Show email

  const handlePay = async () => { // Step 2: Call iKhokha
    if(!email.includes('@')) return alert('Enter valid email');
    setShowEmail(false);
    setCheckoutOpen(true);

    const res = await fetch('/api/ikhokha/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        filmId: film!.id, 
        email, 
        amount_usd: film!.price_usd || 3.99 // <-- Send email + USD
      })
    });
    const { token, error } = await res.json();
    if(error) return alert(error);

    // Mount iKhokha SDK into the div
    window.ikPay.init({ 
      token, 
      container: 'ik-pay-container', 
      onSuccess: () => unlockFilm(film!.id, email) // Step 3: After 3DS
    });
  };

  const unlockFilm = async (filmId: string, e: string) => {
    const r = await fetch(`/api/ikhokha/unlock?filmId=${filmId}&email=${encodeURIComponent(e)}`);
    const { url, exp, error } = await r.json();
    if(error) return alert(error);

    const data = { type: 'rent', expires: exp * 1000, progress: 0, url };
    localStorage.setItem(`4g_access_${filmId}`, JSON.stringify(data)); // Cache it
    setAccess(data);
    setCheckoutOpen(false);
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found.
      </div>
    );
  }

  // 3. CHANGED: Use signed HLS url if paid, else trailer iframe
  const isRented =!!access?.url;
  const videoSrc = isRented 
   ? access.url 
    : `https://iframe.mediadelivery.net/play/${process.env.NEXT_PUBLIC_BUNNY_ZONE}/${film.bunny_trailer_id}?start=${access?.progress || 0}`;
  
  const startTime = access?.progress || 0;
  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav - UNCHANGED */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
            <span className="text-xs font-semibold tracking-widest text-zinc-400 border-zinc-700 px-2 py-0.5 rounded">
              On DIGITAL
            </span>
          </Link>
      </div>

      {/* Hero Player - UNCHANGED */}
      <div className="relative w-full h-screen bg-black">
        <img
          src="/posters/backdrop1.png"
          alt="Film Backdrop"
          className="w-full h-full object-cover"
        />

        {/* Trial Play Icon - UNCHANGED */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-10 h-10 md:w-12 md:h-12 ml-1"
            >
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {showTrailerEnd &&!access && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Continue Watching
              </h3>
              <p className="text-zinc-300 text-lg mb-8">
                Rent for 7 days to unlock the full film.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleRentClick} // <-- CHANGED
                  className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition"
                >
                  Rent
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                ${film.price_usd || 3.99} - 7 days Access. Secure Checkout.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - UNCHANGED */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            {film.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 mb-4">
            {film.rating && (<span className="px-2 py-0.5 border-zinc-500 rounded text-xs">{film.rating}</span>)}
            {film.year && <span>{film.year}</span>}
            {film.genre && <span>•</span>}
            {film.genre && <span>{film.genre}</span>}
            {film.language && <span>•</span>}
            {film.language && <span>{film.language}</span>}
            <span>•</span>
            <span>HD</span>
          </div>
          {film.director && (<p className="text-zinc-300 mb-1"><span className="text-zinc-500">Director:</span> {film.director}</p>)}
          {film.cast && film.cast.length > 0 && (<p className="text-zinc-300 mb-4"><span className="text-zinc-500">Starring:</span>{' '}{film.cast.join(', ')}</p>)}
          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">{film.description}</p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRentClick} // <-- CHANGED
                className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg text-center"
              >
                Rent ${film.price_usd || 3.99}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              7 days Access. Secure checkout.
            </p>
          </div>
        )}

        {!film.available && (
          <div className="mb-12">
            <button disabled className="bg-white/10 text-zinc-500 font-semibold px-8 py-4 rounded-full cursor-not-allowed text-lg">
              Coming Soon
            </button>
          </div>
        )}

        {access && (
          <div className="mb-12">
            <button
              onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg"
            >
              {access.progress > 30? `Resume from ${Math.floor(access.progress / 60)}m` : 'Play'}
            </button>
            {access.expires!== Infinity && (
              <p className="text-xs text-zinc-500 mt-3">
                Rental expires {new Date(access.expires).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {!isFullscreen && otherFilms.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h3 className="text-2xl font-bold mb-4">More from 4th Ground</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {otherFilms.map((f: any) =>
              f.available? (
                <Link key={f.id} href={`/film/${f.id}`} className="group flex-shrink-0 w-72 sm:w-80 md:w-96 snap-start">
                  <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                    <img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover" />
                  </div>
                  <p className="font-semibold mt-3 text-base truncate">{f.title}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">From ${f.price_usd || 3.99}</p>
                </Link>
              ) : (
                <div key={f.id} className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2">
                  <div className="rounded-lg overflow-hidden relative">
                    <img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover blur-sm brightness-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border-white/20">Coming Soon</span>
                    </div>
                  </div>
                  <p className="font-semibold mt-3 text-base truncate text-zinc-400">{f.title}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Footer - UNCHANGED */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
            <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
            <Link href="/dmca" className="hover:text-white transition">DMCA</Link>
            <Link href="/support" className="hover:text-white transition">Support</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <p>© 2026 4th Ground. All rights reserved.</p>
            <p className="text-xs text-zinc-600">All content and trademarks are property of their respective owners.</p>
          </div>
        </div>
      </footer>

      {/* 4. NEW: Email Modal */}
      {showEmail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={() => setShowEmail(false)}>
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6 border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-xl mb-4">Rent {film.title}</h3>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email for 7-day access" 
              className="w-full p-3 bg-black border-white/20 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <button onClick={handlePay} className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-zinc-200">
              Continue to Payment ${film.price_usd || 3.99}
            </button>
            <p className="text-xs text-zinc-500 mt-3 text-center">Billed in ZAR via iKhokha</p>
          </div>
        </div>
      )}

      {/* 5. CHANGED: iKhokha SDK Modal, not iframe */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={() => setCheckoutOpen(false)}>
          <div className="bg-zinc-900 rounded-2xl w-full max-w-lg p-6 border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Complete Rental - ${film.price_usd || 3.99}</h3>
              <button onClick={() => setCheckoutOpen(false)} className="text-zinc-400 hover:text-white text-xl">✕</button>
            </div>
            <div id="ik-pay-container" className="bg-white rounded-lg min-h-[400px]"></div>
          </div>
        </div>
      )}

      <style jsx global>{`
     .scrollbar-hide::-webkit-scrollbar { display: none; }
     .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
