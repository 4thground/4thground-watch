import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/85 to-transparent px-5 py-4 md:px-12 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight md:text-2xl">4th Ground</Link>
          <Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">Home</Link>
        </div>
      </header>

      <section className="relative flex min-h-[70svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[75vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.55),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">4th Ground Privacy</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">Your Data</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            We only collect what we need to run 4th Ground and protect your account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg h-[360px] p-6 flex-col justify-end hover:border-zinc-700 transition">
            <h2 className="text-xl font-bold">What We Collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Email, name, transaction records, device info, and viewing history. Payment details are handled by our payment provider, not stored by us.
            </p>
          </div>
          <div class="bg-zinc-900/50 border border-zinc-800 rounded-lg h-[360px] p-6 flex-col justify-end hover:border-zinc-700 transition">
            <h2 className="text-xl font-bold">How We Use It</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              To process rentals/purchases, prevent fraud, provide support, and comply with legal requirements. We do not sell your data.
            </p>
          </div>
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">Your Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Request access, correction, or deletion of your data at any time by emailing support@4thground.com.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Privacy Contact</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">Questions about your data?</p>
          <a href="mailto:support@4thground.com" className="mt-3 inline-block text-lg font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
            support@4thground.com
          </a>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-500">
            Last updated: January 2026. This is a template. Have a legal professional review before launch.
          </p>
        </div>
      </section>

     <footer className="border-t border-white/10 px-6 md:px-12 py-10 text-sm text-zinc-500">
  <div className="max-w-7xl mx-auto space-y-6">
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
      <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
      <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
      <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
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
    </main>
  )
}
