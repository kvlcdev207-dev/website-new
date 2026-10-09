import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-leo-gray text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-bold text-leo-yellow">Contact the club</h2>
            <form className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-yellow focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-yellow focus:outline-none"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-leo-yellow focus:outline-none"
              />
              <button
                type="button"
                className="rounded-md bg-leo-blue px-4 py-2 font-semibold text-white transition-colors hover:bg-leo-blue/90"
              >
                Send message
              </button>
            </form>
            <p className="mt-3 text-sm text-white/70">Coming soon: this form will email the club.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-leo-yellow">Find us</h2>
            <div className="mt-4 flex aspect-video items-center justify-center rounded-md border-2 border-dashed border-white/30">
              <p className="text-sm text-white/70">Map will appear here</p>
            </div>
          </section>
        </div>

        <nav className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/guidelines" className="text-white/70 transition-colors hover:text-leo-yellow">Guidelines</Link>
          <Link href="/privacy" className="text-white/70 transition-colors hover:text-leo-yellow">Privacy</Link>
        </nav>

        <p className="mt-6 text-center text-sm text-white/70">Copyright © Kathmandu Valley Leo Club - Leo Year 2026/27</p>
        <p className="mt-2 text-center text-sm text-white/70">Design and Developed by Nischhal Shrestha (Tech Lead, 083 Committee). All rights reserved.</p>
      </div>
    </footer>
  );
}