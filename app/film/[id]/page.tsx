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

  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!film) return;

    // 1. Check localStorage for active rental
    const key = `4g_access_${film.id}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      const { type, expires, progress } = JSON.parse(saved);
      if (expires > Date.now()) {
        setAccess({ type, expires, progress: Number(progress || 0) });
      } else {
        localStorage.removeItem(key);
      }
    }
  }, [film]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    if (!film) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin!== 'https://iframe.mediadelivery.net') return;
      const { event, currentTime } = e.data;
      if (event === 'timeupdate' && access) {
        localStorage.setItem(`4g_progress_${film.id}`, Math.floor(currentTime).toString());
      }
      if (event === 'ended' &&!access) setShowTrailerEnd(true);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [access, film]);

  // 2. Create iKhokha checkout + open modal
  const handleRent = async () => {
    const res = await fetch('/api/ikhokha/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filmId: film!.id, amount: 3.99 })
    });
    const { checkout_url, session_id } = await res.json();
    setCheckoutUrl(checkout_url);
    setCheckoutOpen(true);
    pollPayment(session_id, film!.id);
  };

  // 3. Poll backend until webhook marks it paid
  const pollPayment = (session_id: string, filmId: string) => {
    const int = setInterval(async () => {
      const r = await fetch(`/api/ikhokha/status?session=${session_id}`);
      const { status, expires } = await r.json();
      if (status === 'paid') {
        localStorage.setItem(`4g_access_${filmId}`, JSON.stringify({
          type: 'rent',
          expires,
          progress: 0
        }));
        setAccess({ type: 'rent', expires, progress: 0 });
        setCheckoutOpen(false);
        clearInterval(int);
      }
    }, 3000);
  };

  if (!film) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found.</div>;
  }

  const videoId = access? film.bunny_video_id : film.bunny_trailer_id;
  const startTime = access?.progress || 0;
  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
          <span className="text-xs font-semibold tracking-widest text-zinc-400 border-zinc-700 px-2 py-0.5 rounded">
            On DIGITAL
          </span>
        </Link>
      </div>

      {/* Hero Player */}
      <div className="relative w-full h-screen bg-black">
        {access? (
          <iframe
            ref={playerRef}
            src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${film.bunny_video_id}?autoplay=true&preload=true&start=${startTime}`}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        ) : (
          <>
            <img src="/posters/backdrop1.png" alt="Film Backdrop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10 md:w-12 md:h-12 ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.285L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {showTrailerEnd &&!access && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Continue Watching</h3>
              <p className="text-zinc-300 text-lg mb-8">Rent for 7 days to unlock the full film.</p>
              <button onClick={handleRent} className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition">
                Rent $3.99
              </button>
              <p className="text-xs text-zinc-500 mt-4">$3.99 - 7 days Access. Secure checkout.</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{film.title}</h1>
          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">{film.description}</p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <button onClick={handleRent} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">
              Rent $3.99
            </button>
            <p className="text-xs text-zinc-500 mt-3">7 days Access. Checkout opens here.</p>
          </div>
        )}

        {access && (
          <div className="mb-12">
            <button onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">
              {access.progress > 30? `Resume from ${Math.floor(access.progress / 60)}m` : 'Play'}
            </button>
            <p className="text-xs text-zinc-500 mt-3">Rental expires {new Date(access.expires).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* iKhokha Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={() => setCheckoutOpen(false)}>
          <div className="bg-zinc-900 rounded-2xl w-full max-w-lg h-[700px] border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-semibold">Complete Rental - $3.99</h3>
              <button onClick={() => setCheckoutOpen(false)} className="text-zinc-400 hover:text-white text-xl">✕</button>
            </div>
            <iframe src={checkoutUrl} className="w-full h-[calc(100%-60px)]" />
          </div>
        </div>
      )}

      {/* Footer + More Films... keep yours here */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link>
          </div>
          <p>© 2026 4th Ground. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
