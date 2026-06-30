import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/85 to-transparent px-5 py-4 md:px-12 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight md:text-2xl">
            4th Ground
          </Link>

          <Link
            href="/"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden px-5 pb-14 pt-28 md:min-h-[65vh] md:px-12 md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%),linear-gradient(to_top,#000,rgba(0,0,0,0.65),#000)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-400">
            4th Ground
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-none tracking-tight md:text-8xl">
            Terms of Use
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
  These terms explain how you may rent and access 4th Ground’s TVOD film service. All films are licensed and rented for a 3 to 7 day period.
</p>
        </div>
      </section>

      {/* Terms Content */}
      {/* Terms Content - Grid Style like Privacy */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-12">
        <p className="mb-8 text-sm text-zinc-500">Last updated: June 2026 | 4th Ground, a division of KC Company Reg. No. 2023/664072/07</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">1. Who We Are</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              4th Ground is a TVOD streaming platform operated as a division of KC Company, Reg. No. 2023/664072/07.
              Based in Johannesburg, South Africa. Acquisitions: New York, Los Angeles, London, UK.
              By using 4th Ground you agree to these Terms.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">2. TVOD Rentals Only</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We do not sell films. All access is rental-only. Rental windows are 3 to 7 days, shown on each film page before checkout.
              The rental period starts on first playback or 30 days after purchase, whichever comes first. No ownership is transferred.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">3. Licensed Content Only</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Every film on 4th Ground is legally licensed for streaming, including all music, artwork, and ancillary rights.
              We never add content without full clearance. "Coming soon" titles are listed only after a license is secured.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">4. Account & Eligibility</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              You must be 18+ to rent films. You are responsible for keeping your account secure. One account per household.
              We may suspend or terminate accounts for fraud, abuse, or breach of these Terms.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">5. Payments & Taxes</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Prices are shown before checkout and may include VAT or other taxes. Payments are processed by third-party providers.
              4th Ground does not store your full card details. By paying you agree to the listed rental price.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">6. Availability & Changes</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Availability depends on licensing, territory rights, and technical factors. Films may be added or removed without notice.
              We may update features, pricing, or platform functionality at any time.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">7. Refunds</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Rentals are final once playback starts due to the digital nature of the service.
              For technical failures preventing access, contact <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a>.
              See our <Link href="/refund-policy" className="underline">Refund Policy</Link>.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">8. Acceptable Use</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Personal, non-commercial viewing only. You may not copy, record, share, resell, broadcast, or publicly perform content.
              No VPN abuse, DRM circumvention, scraping, bots, or credential sharing. Misuse may lead to termination.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold">9. Intellectual Property</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              All films, trailers, logos, designs, and platform IP belong to 4th Ground, KC Company, filmmakers, or licensors.
              For copyright claims see our <Link href="/dmca" className="underline">DMCA</Link> page. No IP rights are granted to you by renting.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">10. Privacy & Data</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We process data under POPIA to provide rentals, prevent fraud, and comply with licensing.
              See our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/cookies" className="underline">Cookie Policy</Link> for details.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">11. Disclaimers & Liability</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              The service is provided "as is" without warranties. To the maximum extent permitted by South African law,
              4th Ground and KC Company are not liable for indirect, incidental, or consequential damages, or content removal by rights holders.
              Our total liability is limited to the amount you paid for the rental.
            </p>
          </div>

          <div className="rounded-3xl border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:col-span-3">
            <h2 className="text-xl font-bold">12. Changes, Law & Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              We may update these Terms. Continued use means acceptance. These Terms are governed by the laws of South Africa.
              Jurisdiction: Johannesburg courts. 4th Ground, a division of KC Company Reg. No. 2023/664072/07.
              Contact: <a href="mailto:support@4thground.com" className="underline">support@4thground.com</a> or <Link href="/support" className="underline">Support</Link>.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-2xl font-bold">Legal Contact</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            4th Ground, a division of KC Company Reg. No. 2023/664072/07. Johannesburg, South Africa.
          </p>
          <a href="mailto:support@4thground.com" className="mt-3 inline-block text-lg font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
            support@4thground.com
          </a>
          <div className="mt-5 flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-zinc-400 hover:text-white underline">Privacy Policy</Link>
            <Link href="/refund-policy" className="text-zinc-400 hover:text-white underline">Refund Policy</Link>
            <Link href="/dmca" className="text-zinc-400 hover:text-white underline">DMCA</Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white underline">Contact</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
