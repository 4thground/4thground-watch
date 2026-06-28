'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import films from '@/data/films.json';

type AccessState = {
  type: string;
  expires: number;
  progress: number;
};

// PAYHIP - rent only, USD
const PAYHIP_PRODUCTS = {
  rent: '3YqxG' // Your Payhip product ID
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as any[]).find((f) => f.id === params.id);

  const [access, setAccess] = useState<AccessState | null>(null);
  const [showTrailerEnd, setShowTrailerEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!film) return;

    // Check for existing access - no email needed
    const key = `4g_access_${film.id}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      const { type, paidAt } = JSON.parse(saved);
      const expires =
        type === 'buy'? Infinity : paidAt + 7 * 24 * 60 * 60 * 1000;

      const progress = Number(
        localStorage.getItem(`4g_progress_${film.id}`) || 0
      );

      if (expires > Date.now()) {
        setAccess({ type, expires, progress });
      } else {
        localStorage.removeItem(key);
      }
    }

    // Check Payhip return for rent
    const urlParams = new URLSearchParams(window.location.search);
    const payhipSuccess = urlParams.get('payhip_success');
    const payhipProduct = urlParams.get('product');

    if (payhipSuccess === 'true' && payhipProduct === PAYHIP_PRODUCTS.rent) {
      const key = `4g_access_${film.id}`;
      localStorage.setItem(key, JSON.stringify({ type: 'rent', paidAt: Date.now() }));
      window.history.replaceState({}, '', `/film/${film.id}`);
      setTimeout(() => window.location.reload(), 100);
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
        localStorage.setItem(
          `4g_progress_${film.id}`,
          Math.floor(currentTime).toString()
        );
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

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Film not found.
      </div>
    );
  }

  const videoId = access? film.bunny_video_id : film.bunny_trailer_id;
  const startTime = access?.progress || 0;
  const otherFilms = (films as any[]).filter((f) => f.id!== film.id);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav */}
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="4th Ground" className="h-8 rounded-md" />
            <span className="text-xs font-semibold tracking-widest text-zinc-400 border-zinc-700 px-2 py-0.5 rounded">
              OnDIGITAL
            </span>
          </Link>
      </div>

      {/* Hero Player */}
      <div className="relative w-full h-screen bg-black">
        <iframe
          ref={playerRef}
          src={`https://iframe.mediadelivery.net/embed/${film.bunny_library_id}/${videoId}?autoplay=true&start=${startTime}&preload=true`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

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
                {/* RENT BUTTON - NO EMAIL */}
                <a
                  href="https://payhip.com/b/3YqxG"
                  className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition"
                >
                  Rent
                </a>
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                $3.99 - 7 days Access. You'll be redirected to Payhip for secure Checkout.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-40 relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            {film.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 mb-4">
            {film.rating && (
              <span className="px-2 py-0.5 border border-zinc-500 rounded text-xs">
                {film.rating}
              </span>
            )}
            {film.year && <span>{film.year}</span>}
            {film.genre && <span>•</span>}
            {film.genre && <span>{film.genre}</span>}
            {film.language && <span>•</span>}
            {film.language && <span>{film.language}</span>}
            <span>•</span>
            <span>HD</span>
          </div>

          {film.director && (
            <p className="text-zinc-300 mb-1">
              <span className="text-zinc-500">Director:</span> {film.director}
            </p>
          )}

          {film.cast && film.cast.length > 0 && (
            <p className="text-zinc-300 mb-4">
              <span className="text-zinc-500">Starring:</span>{' '}
              {film.cast.join(', ')}
            </p>
          )}

          <p className="text-lg text-zinc-200 max-w-2xl leading-relaxed">
            {film.description}
          </p>
        </div>

        {!access && film.available && (
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* RENT BUTTON - NO EMAIL */}
              <a
                href="https://payhip.com/b/3YqxG"
                className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg text-center"
              >
                Rent ${film.price_usd}
              </a>
            </div>

            <p className="text-xs text-zinc-500 mt-3">
              You'll be redirected to Payhip for secure checkout.
            </p>
          </div>
        )}

        {!film.available && (
          <div className="mb-12">
            <button
              disabled
              className="bg-white/10 text-zinc-500 font-semibold px-8 py-4 rounded-full cursor-not-allowed text-lg"
            >
              Coming Soon
            </button>
          </div>
        )}

        {access && (
          <div className="mb-12">
            <button
              onClick={() =>
                playerRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition text-lg"
            >
              {access.progress > 30
               ? `Resume from ${Math.floor(access.progress / 60)}m`
                : 'Play'}
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
                <Link
                  key={f.id}
                  href={`/film/${f.id}`}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 snap-start"
                >
                  <div className="rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover"
                    />
                  </div>

                  <p className="font-semibold mt-3 text-base truncate">
                    {f.title}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    {f.year && <span>{f.year}</span>}
                    {f.genre && <span>• {f.genre}</span>}
                  </div>

                  <p className="text-sm text-zinc-400 mt-1">
                    From ${f.price_usd}
                  </p>
                </Link>
              ) : (
                <div
                  key={f.id}
                  className="flex-shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] snap-start border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors p-2"
                >
                  <div className="rounded-lg overflow-hidden relative">
                    <img
                      src={f.backdrop_url || f.poster_url}
                      alt={f.title}
                      className="aspect-video object-cover blur-sm brightness-50"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold mt-3 text-base truncate text-zinc-400">
                    {f.title}
                  </p>

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

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-8 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 4th Ground. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/support" className="hover:text-white transition">
              Support
            </Link>

            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
       .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

       .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
