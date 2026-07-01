'use client';

export default function FilmPage() {
  return (
    <main className="relative h-[100svh] w-full bg-black overflow-hidden flex items-center justify-center">

      {/* 1. CINEMA LIGHT: Breathing spotlight at back */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full
          bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)]
          blur-3xl animate-breathe" />
      </div>

      {/* 2. CENTER STACK */}
      <div className="relative z-10 flex-col items-center gap-8">

        {/* TIME THING: Single spinning ring */}
        <div className="w-20 h-20 rounded-full border-[2px] border-t-white border-r-white/20 border-b-white/20 border-l-white/20 animate-spin"
          style={{animationDuration: '1.5s'}} />

        {/* 3. TYPE: LAUNCHING SOON */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-[0.5em] text-white">
          LAUNCHING SOON
        </h1>
      </div>

      <style jsx global>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.9); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
       .animate-breathe { animation: breathe 6s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
