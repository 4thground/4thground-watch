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
      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:p-10">
          <p className="text-sm text-zinc-500">Last updated: June 2026</p>

          <div className="mt-8 space-y-8 text-zinc-300">
            <div>
              <h2 className="text-2xl font-bold text-white">1. About 4th Ground</h2>
              <p className="mt-3 leading-relaxed">
                4th Ground is a TVOD, Transactional Video on Demand, streaming platform operated as a division of KC Company, Reg. No. 2023/664072/07. We are based in Johannesburg, South Africa, with acquisitions teams in New York, Los Angeles, and London, UK. 
                All films on 4th Ground are legally licensed to us for streaming. We do not offer subscriptions or purchases. Access is rental-only.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">2. Rentals Only</h2>
              <p className="mt-3 leading-relaxed">
                All films on 4th Ground are rented, not purchased. When you rent a film, you receive a limited, non-exclusive, non-transferable license for personal, private viewing only. 
                Rental periods range from 3 to 7 days depending on the title and price shown at checkout. The specific rental window for each film will be displayed on the film page before you pay. 
                Once the rental period starts, you may stream the film as many times as you like until the window expires.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">3. Licensing and Availability</h2>
              <p className="mt-3 leading-relaxed">
                Film availability depends on licensing agreements, territory rights, technical requirements, and rights holder approvals. Licensed films may be added or removed without notice. 
                Some titles may be listed as "coming soon" if licensing is pending. We do not own the films. We are a licensed distributor only.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">4. Payments and Taxes</h2>
              <p className="mt-3 leading-relaxed">
                Prices are shown in your local currency before checkout and may include applicable taxes or fees. By completing a transaction, you agree to pay the listed rental price. 
                Payments are processed by third-party payment providers. 4th Ground does not store your full payment details.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">5. Refunds</h2>
              <p className="mt-3 leading-relaxed">
                All rentals are final. Due to the digital nature of the service, we generally do not offer refunds once playback has started. 
                If you experience a technical issue that prevents access to a rented film, contact us at{' '}
                <a href="mailto:support@4thground.com" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">support@4thground.com</a>. 
                Refund requests for technical failures will be reviewed case-by-case. See our{' '}
                <Link href="/refund-policy" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Refund Policy</Link> for details.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">6. User Responsibilities</h2>
              <p className="mt-3 leading-relaxed">
                You agree to use 4th Ground for lawful, personal viewing only. You may not copy, record, screen-capture, resell, share, upload, broadcast, or publicly perform any film. 
                You may not bypass DRM, payment controls, or access restrictions, or share account access beyond your household. Misuse may result in suspension or termination of access.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">7. Intellectual Property</h2>
              <p className="mt-3 leading-relaxed">
                All films, trailers, artwork, logos, trademarks, and platform content remain the property of 4th Ground, KC Company, filmmakers, studios, or other rights holders. 
                No ownership or intellectual property rights are transferred to you by renting a film. For copyright concerns, see our{' '}
                <Link href="/dmca" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">DMCA</Link> page.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">8. Privacy and Data</h2>
              <p className="mt-3 leading-relaxed">
                We process your data to provide rentals, process payments, and comply with South African POPIA requirements. For details on what we collect and how we use it, see our{' '}
                <Link href="/privacy" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Privacy Policy</Link> and{' '}
                <Link href="/cookies" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Cookie Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">9. Service Changes and Liability</h2>
              <p className="mt-3 leading-relaxed">
                4th Ground may update, pause, remove, or modify films, pricing, features, or technical functionality at any time. The service is provided "as is" without warranties. 
                To the extent permitted by law, 4th Ground and KC Company are not liable for indirect or consequential damages, service interruptions, or content removal by rights holders.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">10. Governing Law and Contact</h2>
              <p className="mt-3 leading-relaxed">
                These Terms are governed by the laws of the Republic of South Africa. 4th Ground is a division of KC Company, Reg. No. 2023/664072/07, based in Johannesburg, South Africa. 
                For questions, support, or legal notices, contact us at{' '}
                <a href="mailto:support@4thground.com" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">support@4thground.com</a> or via our{' '}
                <Link href="/support" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Support</Link> page.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
          
        </p>
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
