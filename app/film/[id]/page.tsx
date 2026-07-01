'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

const LIBRARY_ID = '694590';
const TRAILER_ID = '24a1b8b6-8bd6-46f4-acd5-7d7525ba4b4b';
const MAIN_ID = 'c561937c-eaae-42b2-bafc-f9f934a668a0';

type AccessState = { type: 'rent' | 'buy'; expires: number; progress: number; };
declare global { interface Window { ikPay: any; }

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);
  const [access, setAccess] = useState<AccessState | null>(null);
  const [signedSrc, setSignedSrc] = useState<string | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!film) return;
    const saved = localStorage.getItem(`4g_access_${film.id}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expires > Date.now()) {
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}`) || 0);
        setAccess({...data, progress });
      } else {
        localStorage.removeItem(`4g_access_${film.id}`);
      }
    }
  }, [film]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  // NEW: Get signed URL for trailer or film
  useEffect(() => {
    const loadSrc = async () => {
      if (!film) return;
      const isTrailer =!access;
      const videoId = isTrailer? TRAILER_ID : MAIN_ID;

      const res = await fetch('/api/bunny-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId, isTrailer,
          type: access?.type,
          paidAt: access?.expires === Infinity? Date.now() : access?.expires - 7 * 24 * 60 * 60 * 1000
        })
      });
      if (res.ok) {
        const { src } = await res.json();
        setSignedSrc(src + `&start=${access?.progress || 0}`);
      }
    }
    loadSrc();
  }, [film, access]);

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

  const handleRentClick = () => setShowEmail(true);
  const handlePay = async () => { /* same as your code */ 
    if(!email.includes('@')) return alert('Enter valid email');
    setShowEmail(false); setCheckoutOpen(true);
    const res = await fetch('/api/ikhokha/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filmId: film!.id, email, amount_usd: film!.price_usd || 3.99 }) });
    const { token, error } = await res.json(); if(error) return alert(error);
    window.ikPay.init({ token, container: 'ik-pay-container', onSuccess: () => unlockFilm(film!.id, email) });
  };
  const unlockFilm = async (filmId: string, e: string) => {
    const r = await fetch(`/api/ikhokha/unlock?filmId=${filmId}&email=${encodeURIComponent(e)}`);
    const { exp, error } = await r.json(); if(error) return alert(error);
    const data = { type: 'rent', expires: exp * 1000, progress: 0 };
    localStorage.setItem(`4g_access_${filmId}`, JSON.stringify(data)); setAccess(data); setCheckoutOpen(false);
  }

  if (!film) { return <div className="min-h-screen bg-black text-white flex items-center justify-center">Film not found.</div>; }

  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav - BACK */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
            <span className="text-xs font-semibold tracking-widest text-zinc-400 border-zinc-700 px-2 py-0.5 rounded">On DIGITAL</span>
          </Link>
      </div>

      {/* Hero Player - BACK with Backdrop */}
      <div className="relative w-full h-screen bg-black">
        <img src="/posters/backdrop1.png" alt="Film Backdrop" className="w-full h-full object-cover" />
        
        {/* Player over backdrop */}
        <div className="absolute inset-0">
          {signedSrc && (
            <iframe ref={playerRef} src={signedSrc} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {showTrailerEnd &&!access && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Continue Watching</h3>
              <p className="text-zinc-300 text-lg mb-8">Rent for 7 days to unlock the full film.</p>
              <button onClick={handleRentClick} className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition">Rent</button>
              <p className="text-xs text-zinc-500 mt-4">${film.price_usd || 3.99} - 7 days Access. Secure Checkout.</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - BACK */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{film.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 mb-4">
            {film.rating && (<span className="px-2 py-0.5 border-zinc-500 rounded text-xs">{film.rating}</span>)}
            {film.year && <span>{film.year}</span>}
            {film.genre && <span>• {film.genre}</span>}
            {film.language && <span>• {film.language}</span>}
            <span>• HD</span>
          </div>
          {film.director && (<p className="text-zinc-300 mb-1"><span className="text-zinc-500">Director:</span> {film.director}</p>)}
          {film.cast && film.cast.length > 0 && (<p className="text-zinc-300 mb-4"><span className="text-zinc-500">Starring:</span> {film.cast.join(', ')}</p>)}
          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">{film.description}</p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <button onClick={handleRentClick} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">Rent ${film.price_usd || 3.99}</button>
            <p className="text-xs text-zinc-500 mt-3">7 days Access. Secure checkout.</p>
          </div>
        )}
        {access && (
          <div className="mb-12">
            <button onClick={() => playerRef.current?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">
              {access.progress > 30? `Resume from ${Math.floor(access.progress / 60)}m` : 'Play'}
            </button>
            {access.expires!== Infinity && (<p className="text-xs text-zinc-500 mt-3">Rental expires {new Date(access.expires).toLocaleDateString()}</p>)}
          </div>
        )}
      </div>

      {/* More from 4th Ground - BACK */}
      {!isFullscreen && otherFilms.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h3 className="text-2xl font-bold mb-4">More from 4th Ground</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {otherFilms.map((f: any) => (
              <Link key={f.id} href={`/film/${f.id}`} className="group flex-shrink-0 w-72 sm:w-80 md:w-96 snap-start">
                <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                  <img src={f.backdrop_url || f.poster_url} alt={f.title} className="aspect-video object-cover" />
                </div>
                <p className="font-semibold mt-3 text-base truncate">{f.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer - BACK */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto">© 2026 4th Ground. All rights reserved.</div>
      </footer>

      {/* Modals - SAME */}
      {showEmail && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={() => setShowEmail(false)}><div className="bg-zinc-900 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}><h3 className="font-semibold text-xl mb-4">Rent {film.title}</h3><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email for 7-day access" className="w-full p-3 bg-black border-white/20 rounded-lg mb-4"/><button onClick={handlePay} className="w-full bg-white text-black font-semibold py-3 rounded-full">Continue to Payment ${film.price_usd || 3.99}</button></div></div> )}
      {checkoutOpen && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={() => setCheckoutOpen(false)}><div className="bg-zinc-900 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}><div id="ik-pay-container" className="bg-white rounded-lg min-h-[400px]"></div></div></div> )}
      
      <style jsx global>{`.scrollbar-hide::-webkit-scrollbar { display: none; }.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}
