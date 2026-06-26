// ...rest of your code stays same

{showTrailerEnd &&!access && (
  <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className="text-center max-w-lg w-full">
      <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Continue Watching</h3>
      <p className="text-zinc-300 text-lg mb-8">Rent for 7 days to unlock the full film.</p>

      <div className="flex flex-col items-center gap-2 w-full max-w-sm mx-auto">
        <a
          href="https://payhip.com/b/3YqxG"
          className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-zinc-200 transition text-center"
        >
          Rent - $3.99
        </a>
        <p className="text-xs text-zinc-400 mt-2 text-center">
          7 days access. Support: support@4thground.com - 24/7
        </p>
      </div>
    </div>
  </div>
)}

{!access && film.available && (
  <div className="mb-12 max-w-sm">
    <a
      href="https://payhip.com/b/3YqxG"
      className="w-full block bg-white text-black font-semibold py-3 rounded-full hover:bg-zinc-200 transition text-center"
    >
      Rent - $3.99
    </a>
    <p className="text-xs text-zinc-400 mt-2 text-center">
      7 days access. Support: support@4thground.com - 24/7
    </p>
  </div>
)}
