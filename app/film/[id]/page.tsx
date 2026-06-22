'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import films from '@/data/films.json';

const ZAR_TO_USD_RATE = 16.2;

type AccessState = {
  type: string;
  expires: number;
  progress: number;
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);

  const [email, setEmail] = useState('');
  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false); // NEW: track HD thumb load
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  // Bunny thumbnail URLs - tiny vs HD
  const thumbTiny = film? `https://vz-${film.bunny_library_id}.b-cdn.net/${film.bunny_trailer_id}/thumbnail.jpg?width=40&quality=20&blur=5` : '';
  const thumbHD = film? `https://vz-${film.bunny_library_id}.b-cdn.net/${film.bunny_trailer_id}/thumbnail.jpg?width=1920&quality=75&format=webp` : '';

  useEffect(() => {
    if (!film) return;

    const savedEmail = localStorage.getItem('4g_email');
    if (savedEmail) {
      setEmail(savedEmail);
      const key = `4g_access_${film.id}_${savedEmail}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const { type, paidAt } = JSON.parse(saved);
        const expires = type === 'buy'? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;
        const progress = Number(localStorage.getItem(`4g_progress_${film.id}_${savedEmail}`) || 0);
        if (expires > Date.now()) {
          setAccess({ type, expires, progress });
          setShowPlayer(true);
        } else {
          localStorage.removeItem(key);
        }
      }
    }
  }, [film]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);

  useEffect(() => {
    if (!film ||!showPlayer) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin!== 'https://iframe.mediadelivery.net') return;
      const { event, currentTime } = e.data;
      if (event === 'timeupdate' && access && email) {
        localStorage.setItem(`4g_progress_${film.id}_${email}`, Math.floor(currentTime).toString());
      }
      if (event === 'ended' &&!access) {
        setShowTrailerEnd(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [access, film, email, showPlayer]);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found.
      </div>
    );
  }

  const zarToUsd = (zarCents: number) => {
    const usd = zarCents / 100 / ZAR_TO_USD_RATE;
    return usd.toFixed(2);
  };

  const payWithPaystack = (type: 'rent' | 'buy') => {
    if (!email) return alert('Enter email first');
    localStorage.setItem('4g_email', email);
    const amount = type === 'buy'? film.buy_price_cents : film.rent_price_cents;

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      currency: 'ZAR',
      metadata: { film_id: film.id, type },
      callback: function (response: any) {
        const key = `4g_access_${film.id}_${email}`;
        localStorage.setItem(key, JSON.stringify({ reference: response.reference, type, paidAt: Date.now() }));
        setTimeout(() => window.location.reload(), 500);
      },
    });
    handler.openIframe();
  };

  const videoId = access? film.bunny_video_id : film.bunny_trailer_id;
  const startTime = access?.progress || 0;
  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent px-6 md:px-12 py-4">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
        </Link>
      </div>

      {/* Hero Player */}
      <div className="relative w-full h-screen bg-black">
        {showPlayer? (
          <iframe
            ref={playerRef}
            src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoId}?autoplay=true&start=${startTime}`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          // UPDATED: LQIP blur effect
          <div className="relative w-full h-full overflow-hidden">
            {/* Tiny blurred base - 2KB, loads instantly */}
            <img
              src={thumbTiny}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
              style={{ opacity: thumbLoaded? 0 : 1, transition: 'opacity 0.4s ease-out' }}
            />

            {/* HD version - fades in when ready */}
            <Image
              src={thumbHD}
              alt={film.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              onLoadingComplete={() => setThumbLoaded(true)}
              style={{ opacity: thumbLoaded? 1 : 0, transition: 'opacity 0.4s ease-out' }}
            />

            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => setShowPlayer(true)}
                className="bg-white text-black font-semibold px-12 py-4 rounded-full hover:bg-zinc-200 transition text-xl flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 0 000-2.538L6.3 2.84z"/></svg>
                Play Trailer
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        {showTrailerEnd &&!access && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
              <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Continue Watching</h3>
              <p className="text-zinc-300 text-lg mb-8">Rent for 7 days or buy to own forever.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => payWithPaystack('rent')} className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition">
                  Rent ${zarToUsd(film.rent_price_cents)}
                </button>
                <button onClick={() => payWithPaystack('buy')} className="bg-white/10 backdrop-blur text-white font-semibold px-8 py-3 rounded-full border border-white/20 hover:bg-white/20 transition">
                  Buy ${zarToUsd(film.buy_price_cents)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{film.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 mb-4">
            {film.rating && <span className="px-2 py-0.5 border border-zinc-500 rounded text-xs">{film.rating}</span>}
            {film.year && <span>{film.year}</span>}
            {film.genre && <><span>•</span><span>{film.genre}</span></>}
            {film.language && <><span>•</span><span>{film.language}</span></>}
            <span>•</span><span>HD</span>
          </div>
          {film.director && <p className="text-zinc-300 mb-1"><span className="text-zinc-500">Director:</span> {film.director}</p>}
          {film.cast && film.cast.length > 0 && <p className="text-zinc-300 mb-4"><span className="text-zinc-500">Starring:</span> {film.cast.join(', ')}</p>}
          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">{film.description}</p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <input
              type="email"
              placeholder="Enter email to continue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full max-w-md mb-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => payWithPaystack('rent')} className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg">
                Rent ${zarToUsd(film.rent_price_cents)}
              </button>
              <button onClick={() => payWithPaystack('buy')} className="bg-white/10 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition text-lg">
                Buy ${zarToUsd(film.buy_price_cents)}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3">Charged in ZAR. Approx USD shown.</p>
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
              onClick={() => {
                setShowPlayer(true);
                playerRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
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
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-semibold mt-3 text-base truncate">{f.title}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">From ${zarToUsd(f.rent_price_cents)}</p>
                </Link>
              ) : (
                <div key={f.id} className="flex-shrink-0 w-72 sm:w-80 md:w-96 snap-start border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2">
                  <div className="rounded-lg overflow-hidden relative">
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover blur-sm brightness-50"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                        Coming Soon
                      </span>
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

      <footer className="border-t border-white/10 px-6 md:px-12 py-8 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 4th Ground. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/support" className="hover:text-white transition">Support</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
