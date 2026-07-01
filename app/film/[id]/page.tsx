'use client';

export default function ComingSoon() {
  return (
    <main className="relative h-[100svh] w-full bg-black overflow-hidden flex items-center justify-center font-sans antialiased">

      {/* 1. CINEMA LIGHT AT THE BACK: Breathing spotlight */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.05)_30%,transparent_70%)]
          blur-3xl animate-breathe">
        </div>
      </div>

      {/* Subtle film grain */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. CONTENT: Center */}
      <div className="relative z-10 flex-col items-center gap-8">

        {/* 3. TIME THING ROTATING: Loader ring */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-[2px] border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-[2px] border-t-white border-r-transparent border-b
