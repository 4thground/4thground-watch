'use client';

import { useState, useEffect } from 'react';
import films from '@/data/films.json';

type Film = {
  id: string;
  title: string;
};

export default function FilmPage({ params }: { params: { id: string } }) {
  const film = (films as Film[]).find((f) => f.id === params.id);

  if (!film) return <div className="min-h-screen flex items-center justify-center text-white bg-black">Film not found</div>;

  return (
    <main className="relative h-[100svh] w-full bg-black overflow-hidden flex items-center justify-center font-sans antialiased">

      {/* 1. CINEMA SPOTLIGHT: Breathing light at back */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_40%,transparent_70%)]
          blur-3xl animate-breathe">
        </div>
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. CENTER CONTENT */}
      <div className="relative z-10 flex-col items-center gap-10 px-6">

        {/* Film Title - small, top */}
        <p className="text-white/50 text-sm tracking-[0.4em] uppercase">{film.title}</p>

        {/* 3. TIME THING: Spinning ring */}
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10"></div>
          <div className="absolute inset-2 rounded-full border-[1.5px] border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-duration:1.8s]"></div>
          <div className="absolute inset-4 rounded-full border-[1px] border-white/20 border-t-transparent border-r-white border-b-transparent border-l-transparent animate-spin [animation-duration:2.4s] [animation-direction:reverse]"></div>
        </div>

        {/* 4. TYPE: LAUNCHING SOON */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.4em] text-white">
            LAUNCHING
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[0.4em] text-white/60 mt-3 animate-pulse-slow">
            SOON
          </h2>
        </div>

      </div>

      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) scale(0.92); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
        }
      .animate-breathe { animation: breathe 7s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      .animate-pulse-slow { animation: pulse-slow 3.5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
