import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-leo-purple text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact form — placeholder until the email service is connected
              (the working form arrives with the contact feature in Phase 5) */}
          <section>
            <h2 className="text-lg font-bold text-leo-gold">Contact the club</h2>
            <form className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-gold focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-gold focus:outline-none"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-gold focus:outline-none"
              />
              {/* Placeholder button: does nothing until the real form is built */}
              <button
                type="button"
                className="rounded-md bg-leo-gold px-4 py-2 font-semibold text-leo-purple transition-colors hover:bg-white"
              >
                Send message
              </button>
            </form>
            <p className="mt-3 text-sm text-white/70">
              Coming soon: this form will email the club.
            </p>
          </section>

          {/* Map — placeholder until the club location is added in settings */}
          <section>
            <h2 className="text-lg font-bold text-leo-gold">Find us</h2>
            <div className="mt-4 flex aspect-video items-center justify-center rounded-md border-2 border-dashed border-white/30">
              <p className="text-sm text-white/70">Map will appear here</p>
            </div>
          </section>
        </div>

        {/* Guidelines and Privacy pages arrive in a later phase */}
        <nav className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/guidelines" className="transition-colors hover:text-leo-gold">
            Guidelines
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-leo-gold">
            Privacy
          </Link>
        </nav>

        {/* Required centered lines — keep the wording exact */}
        <p className="mt-6 text-center text-sm">
          Copyright © Kathmandu Valley Leo Club - Leo Year 2026/27
        </p>
        <p className="mt-2 text-center text-sm">
          Design and Developed by Nischhal Shrestha (Tech Lead, 083 Committee).
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
