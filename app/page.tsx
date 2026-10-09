import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="bg-leo-blue text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-leo-yellow">
            Kathmandu Valley Leo Club
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Students of the campus, serving our community.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            A student-run club where young people lead, serve, and grow.
          </p>
          <p className="mt-6 text-xl font-semibold tracking-wide md:text-2xl">
            Leadership{" "}
            <span className="text-leo-yellow">·</span> Experience{" "}
            <span className="text-leo-yellow">·</span> Opportunity{" "}
            <span className="text-leo-yellow">·</span> Service
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">What we do</h2>
          <p className="mt-4 max-w-3xl text-gray-700">
            The Kathmandu Valley Leo Club is a community service club for
            students of the campus. We organize service projects, practice
            leadership, and share our writing — in English and Nepali. LEO
            stands for Leadership, Experience, Opportunity, Service: the four
            things every member grows through.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-md border border-gray-200 p-6">
              <h3 className="font-bold text-leo-blue">Service</h3>
              <p className="mt-2 text-sm text-gray-700">
                We run projects that help people around the campus and the valley.
              </p>
            </div>
            <div className="rounded-md border border-gray-200 p-6">
              <h3 className="font-bold text-leo-blue">Leadership</h3>
              <p className="mt-2 text-sm text-gray-700">
                Members take turns leading — planning, deciding, and doing.
              </p>
            </div>
            <div className="rounded-md border border-gray-200 p-6">
              <h3 className="font-bold text-leo-blue">Literature</h3>
              <p className="mt-2 text-sm text-gray-700">
                Poems, stories and blogs, written by students, in English or Nepali.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-leo-yellow/10 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Our impact</h2>
          <p className="mt-2 text-sm text-gray-600">Real figures will appear here once the club enters them.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["People helped", "Events held", "Volunteer hours", "Active members"].map((label) => (
              <div key={label} className="rounded-md border border-leo-blue/20 bg-white p-6 text-center">
                <p className="text-3xl font-bold text-leo-blue">—</p>
                <p className="mt-2 text-sm text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Latest literature</h2>
          <p className="mt-2 text-sm text-gray-600">Sample cards only — real posts arrive with the literature section.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {["Poem", "Story", "Blog"].map((type) => (
              <div key={type} className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex aspect-video items-center justify-center bg-leo-yellow/20">
                  <span className="text-sm text-leo-blue/70">Cover image</span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-leo-yellow">{type}</p>
                  <h3 className="mt-1 font-bold text-leo-blue">Placeholder title</h3>
                  <p className="mt-2 text-sm text-gray-600">A club member</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/literature" className="font-semibold text-leo-blue underline hover:text-leo-green">
              Browse literature
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-leo-blue text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">Have something to say?</h2>
          <p className="mt-3 text-white/90">Poems, stories, blogs — in English or Nepali. Your writing belongs here.</p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-md bg-leo-yellow px-6 py-3 font-semibold text-leo-blue transition-colors hover:bg-yellow-300"
          >
            Log in and share your writing
          </Link>
        </div>
      </section>
    </>
  );
}