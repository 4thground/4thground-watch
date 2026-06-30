import Link from 'next/link'
export default function RefundPolicyPage() {
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
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">4th Ground Rentals</p>
          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">Refund Policy</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
            Rentals are for 3 to 7 days depending on the film and price. Here’s when we can and cannot issue refunds.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <p className="mb-8 text-sm text-zinc-500">Last updated: June 2026 | 4th Ground, a division of KC Company Reg. No. 2023/664072/07</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">1. TVOD Nature of Rentals</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              All films are rented, not purchased. Rental windows are 3 to 7 days as shown at checkout. 
              Because digital access is delivered instantly, all rentals are final once playback begins, except as stated below.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">2. Eligible for Refund</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400 list-disc pl-5">
              <li>Technical failure: Platform error prevents playback and cannot be resolved within 24 hours.</li>
              <li>Duplicate charge: You were charged more than once for the same rental.</li>
              <li>Unauthorized purchase: Account compromised and purchase was not made by you.</li>
              <li>Film delisted: Title is removed within 24 hours of your rental due to a licensing issue.</li>
            </ul>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">3. Not Eligible for Refund</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400 list-disc pl-5">
              <li>Playback started: You pressed Play or the rental window started.</li>
              <li>Change of mind: You do not like the film, cast, rating, or it does not meet expectations.</li>
              <li>Expired access: Your 3-7 day rental window has ended.</li>
              <li>Device or internet: Issues caused by your connection, hardware, or browser.</li>
              <li>Region/VPN issues: Title not available in your territory due to licensing.</li>
            </ul>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">4. Licensed Content Assurance</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              4th Ground only streams fully licensed films, including all music and artwork clearances.
              "Coming soon" titles appear only after a license is secured. If a title is removed for rights reasons, refunds apply per Section 2.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">5. How We Process Refunds</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Approved refunds are issued to your original payment method by our payment processor.
              Processing time: 5-10 business days depending on your bank. VAT or taxes included in the rental are also refunded.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">6. Consumer Protection</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              This policy does not affect your rights under South African Consumer Protection Act 68 of 2008 or POPIA.
              For defective service or non-delivery, you may have additional remedies at law.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">7. How to Request a Refund</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Email <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a> within 72 hours of purchase with:
              your order ID, email used, film title, and a short description with screenshots if relevant.
              We will respond within 48 hours. Approved cases are processed without delay.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Refund Contact</h2>
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
            <Link href="/support" className="text-zinc-400 hover:text-white underline">Support</Link>
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
