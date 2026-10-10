"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const pastIssues = [
  { year: "2025/26", title: "KVLC Annual Magazine 2025/26", description: "Highlights from our service projects, events, and member stories." },
  { year: "2024/25", title: "KVLC Annual Magazine 2024/25", description: "A year of service, leadership, and community impact." },
  { year: "2023/24", title: "KVLC Annual Magazine 2023/24", description: "Stories of growth, friendship, and making a difference." },
];

const newsArticles = [
  { date: "Fri, 9 Oct 2026", title: "Leo Year 2026/27 Officially Kicks Off", excerpt: "The new executive board was installed at our kick-off meeting in College Hall." },
  { date: "Wed, 7 Oct 2026", title: "Campus Clean-Up Drive This Saturday", excerpt: "Join us at Block A, 8 AM — gloves and bags provided. All students welcome!" },
  { date: "Mon, 5 Oct 2026", title: "New Literature Section Now Live", excerpt: "Students can now publish poems, stories, and blogs on the club website." },
];

export default function LiteraturePage() {
  return (
    <>
      <FadeIn>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Literature & Publications</h1>
            <p className="mt-4 max-w-2xl text-white/90 text-lg">Read about our journey, achievements, and club news.</p>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl mb-8">Latest Issue</h2>
            <FadeIn delay={100}>
              <div className="card-hover rounded-2xl border border-leo-gray/10 overflow-hidden shadow-sm">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative lg:w-2/5 min-h-[300px] lg:min-h-0 bg-leo-gray/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-leo-gray/40">Cover Image</span>
                    </div>
                  </div>
                  <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-leo-blue mb-3">KVLC Annual Magazine 2026/27</h3>
                    <p className="text-leo-gray mb-6 leading-relaxed max-w-md">
                      This year&apos;s magazine captures our journey of service, leadership, and community.
                      From campus clean-ups to the winter clothes drive, every page tells a story of
                      students making a difference.
                    </p>
                    <Link
                      href="#"
                      className="btn-hover inline-flex items-center px-6 py-3 text-sm font-semibold text-leo-gray bg-leo-yellow rounded-lg hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-leo-yellow/30"
                    >
                      Read Now
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={200}>
        <section className="py-16 sm:py-20 bg-leo-gray/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl mb-10">Past Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastIssues.map((issue, i) => (
                <FadeIn key={issue.year} delay={i * 150} className="group">
                  <article className="card-hover rounded-2xl border border-leo-gray/10 overflow-hidden shadow-sm">
                    <div className="relative aspect-[3/4] bg-leo-gray/5">
                      <span className="absolute inset-0 flex items-center justify-center text-sm text-leo-gray/40">Cover Image</span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-semibold text-leo-yellow uppercase tracking-wider">{issue.year}</p>
                      <h3 className="mt-2 font-bold text-leo-blue group-hover:text-leo-blue/80 transition-colors">{issue.title}</h3>
                      <p className="mt-2 text-sm text-leo-gray">{issue.description}</p>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={300}>
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl mb-10">Recent Updates</h2>
            <div className="divide-y divide-leo-gray/10">
              {newsArticles.map((article, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <article className="py-6 first:pt-0 last:pb-0">
                    <p className="text-xs text-leo-gray mb-1">{article.date}</p>
                    <h3 className="font-bold text-leo-blue text-lg">{article.title}</h3>
                    <p className="mt-1 text-sm text-leo-gray">{article.excerpt}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="#"
                className="inline-flex items-center text-sm font-semibold text-leo-blue hover:text-leo-blue/80 transition-colors"
              >
                View All Updates
                <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}