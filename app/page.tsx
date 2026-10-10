"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <FadeIn>
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
      </FadeIn>

      {/* What we do */}
      <FadeIn delay={100}>
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
              {["Service", "Leadership", "Literature"].map((item) => (
                <FadeIn key={item} delay={150} className="group">
                  <div className="rounded-xl border border-leo-gray/10 bg-white p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h3 className="font-bold text-leo-blue">{item}</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      {item === "Service"
                        ? "We run projects that help people around the campus and the valley."
                        : item === "Leadership"
                        ? "Members take turns leading — planning, deciding, and doing."
                        : "Poems, stories and blogs, written by students, in English or Nepali."}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Impact numbers */}
      <FadeIn delay={200}>
        <section className="bg-leo-yellow/10 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Our impact</h2>
            <p className="mt-2 text-sm text-gray-600">Real figures will appear here once the club enters them.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {["People helped", "Events held", "Volunteer hours", "Active members"].map((label) => (
                <FadeIn key={label} delay={100} className="group">
                  <div className="rounded-xl border border-leo-blue/20 bg-white p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <p className="text-3xl font-bold text-leo-blue">—</p>
                    <p className="mt-2 text-sm text-gray-700">{label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Latest literature */}
      <FadeIn delay={300}>
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Latest literature</h2>
            <p className="mt-2 text-sm text-gray-600">Sample cards only — real posts arrive with the literature section.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {["Poem", "Story", "Blog"].map((type) => (
                <FadeIn key={type} delay={100} className="group">
                  <Link href="/literature" className="block overflow-hidden rounded-xl border border-leo-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex aspect-video items-center justify-center bg-leo-yellow/20">
                      <span className="text-sm text-leo-blue/70">Cover image</span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-leo-yellow">{type}</p>
                      <h3 className="mt-1 font-bold text-leo-blue">Placeholder title</h3>
                      <p className="mt-2 text-sm text-gray-600">A club member</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/literature" className="font-semibold text-leo-blue underline hover:text-leo-green transition-colors">
                Browse literature
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Call to action */}
      <FadeIn delay={400}>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
            <h2 className="text-2xl font-bold md:text-3xl">Have something to say?</h2>
            <p className="mt-3 text-white/90">Poems, stories, blogs — in English or Nepali. Your writing belongs here.</p>
            <Link
              href="/sign-in"
              className="mt-6 inline-block rounded-lg bg-leo-yellow px-6 py-3 font-semibold text-leo-blue transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-leo-yellow/30"
            >
              Log in and share your writing
            </Link>
          </div>
        </section>
      </FadeIn>
    </>
  );
}