import Link from 'next/link'
export default function CookiesPage() {
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
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">4th Ground Cookies</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">Cookies Policy</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            How we use cookies to keep 4th Ground secure and working.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <p className="mb-8 text-sm text-zinc-500">Last updated: June 2026 | 4th Ground, a division of KC Company Reg. No. 2023/664072/07</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">1. What Are Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Cookies are small text files stored on your device. We also use local storage, pixels, and SDKs. 
              All are referred to as "cookies" here. We use them to run 4th Ground and protect licensed content.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">2. Essential Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Required for TVOD rentals: login, session, 3-7 day rental tracking, DRM playback, security, and fraud prevention.
              The site cannot function without these. They are not used for marketing.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">3. Analytics Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Help us improve performance and licensing decisions: page views, errors, device type, playback success.
              Data is aggregated and anonymized where possible. We do not use advertising cookies.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">4. Functional Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Remember your preferences: region, language, recently viewed titles, and active rental status.
              These improve usability but are not required for core playback.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">5. Third-Party Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Set by payment processors, CDN, and DRM providers to process rentals and protect content.
              All third parties are bound by POPIA and Data Processing Agreements. No ads.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">6. Payouts & Email Collection</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Filmmakers and rights holders receiving payouts must provide an email and payment details.
              This is used only for payouts, statements, and tax compliance. Payout data is stored separately from viewer accounts.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">7. Manage Cookies</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              You can control cookies via your browser or our cookie banner. Blocking essential cookies will prevent rentals.
              For POPIA requests or cookie data questions, email <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a>.
              See our <Link href="/privacy" className="underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Cookie Contact</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            4th Ground, a division of KC Company Reg. No. 2023/664072/07. Johannesburg, South Africa.
          </p>
          <a href="mailto:support@4thground.com" className="mt-3 inline-block text-lg font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
            support@4thground.com
          </a>
          <div className="mt-5 flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">Terms of Service</Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-white underline">Privacy Policy</Link>
            <Link href="/dmca" className="text-zinc-400 hover:text-white underline">DMCA</Link>
          </div>
        </div>
      </section>
      
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
    </main>
  )
}
