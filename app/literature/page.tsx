"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

type Category = "all" | "poetry" | "stories" | "blogs";

type Writing = {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  author: string;
  excerpt: string;
  date: string;
};

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "poetry", label: "Poetry" },
  { id: "stories", label: "Short Stories" },
  { id: "blogs", label: "Blogs & Essays" },
];

const writings: Writing[] = [
  {
    id: "1",
    category: "poetry",
    title: "Morning Light Over the Campus",
    author: "Leo Nischhal Shrestha",
    excerpt: "Golden rays slip through the library windows, painting verses on dusty shelves. Each beam a stanza, each shadow a pause...",
    date: "Fri, 9 Oct 2026",
  },
  {
    id: "2",
    category: "stories",
    title: "The Library's Secret",
    author: "Leo Anubhav K.C.",
    excerpt: "There was a book that nobody had checked out in twenty years. Its cover was worn, its title faded. When Maya finally opened it...",
    date: "Wed, 7 Oct 2026",
  },
  {
    id: "3",
    category: "blogs",
    title: "Why I Serve: A Leo's Journey",
    author: "Leo Samita Gyawali",
    excerpt: "People ask why I spend weekends cleaning parks or tutoring kids. The answer isn't in what I give, but in what I become...",
    date: "Mon, 5 Oct 2026",
  },
  {
    id: "4",
    category: "poetry",
    title: "नेपाली कविता: हाम्रो विद्यालय",
    author: "Leo Ashika Budhathoki",
    excerpt: "हाम्रो विद्यालय, ज्ञानको मन्दिर, जहाँ सपना उड्छ निर्विघ्न। शिक्षा को ज्योति जलाएर, हामी बनौँ देशको स्तम्भ...",
    date: "Sat, 3 Oct 2026",
  },
  {
    id: "5",
    category: "stories",
    title: "The Last Bench",
    author: "Leo Prince Parajuli",
    excerpt: "Everyone wanted the front row. But the last bench held stories — whispered dreams, shared lunches, and the quiet promise of friendship...",
    date: "Thu, 1 Oct 2026",
  },
  {
    id: "6",
    category: "blogs",
    title: "Leadership Lessons from a Clean-Up Drive",
    author: "Leo Sailesh Acharya",
    excerpt: "Picking up trash taught me more about leadership than any workshop. It's not about directing — it's about showing up first...",
    date: "Tue, 29 Sep 2026",
  },
  {
    id: "7",
    category: "poetry",
    title: "Monsoon Memories",
    author: "Leo Sita Limbu",
    excerpt: "Rain on the tin roof, steam from tea cups, and the smell of wet earth. Some memories don't need words, just the sound of rain...",
    date: "Sun, 27 Sep 2026",
  },
  {
    id: "8",
    category: "blogs",
    title: "Building a Reading Culture",
    author: "Leo Aashish B.K.",
    excerpt: "Our campus library has 5,000 books but only 50 regular visitors. Here's how we're changing that, one book club at a time...",
    date: "Fri, 25 Sep 2026",
  },
  {
    id: "9",
    category: "stories",
    title: "The Letter I Never Sent",
    author: "Leo Yunesh Shrestha",
    excerpt: "It sat in my drawer for three years. Three years of 'I'll send it tomorrow.' Some tomorrows never come, and that's okay...",
    date: "Wed, 23 Sep 2026",
  },
];

const categoryColors = {
  poetry: "bg-leo-blue/10 text-leo-blue",
  stories: "bg-leo-green/10 text-leo-green",
  blogs: "bg-leo-yellow/10 text-leo-yellow",
};

export default function LiteraturePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredWritings = activeCategory === "all"
    ? writings
    : writings.filter((w) => w.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <FadeIn>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Literature & Creative Writing</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Poems, stories, and blogs written by our members in English and Nepali.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Category Filters */}
      <FadeIn delay={100}>
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Category filters">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-leo-blue text-white shadow-lg shadow-leo-blue/30"
                      : "text-leo-gray bg-white border border-leo-gray/20 hover:bg-leo-blue/5 hover:text-leo-blue"
                  }`}
                  aria-pressed={activeCategory === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Member Writings Grid */}
      <FadeIn delay={200}>
        <section className="py-16 sm:py-20 bg-leo-gray/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWritings.map((writing) => (
                <FadeIn key={writing.id} delay={100} className="group">
                  <article className="card-hover bg-white rounded-2xl border border-leo-gray/10 p-6 shadow-sm h-full flex flex-col">
                    {/* Category Tag */}
                    <span className={`inline-block mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${categoryColors[writing.category]}`}>
                      {writing.category.toUpperCase()}
                    </span>

                    {/* Title */}
                    <h3 className="mb-3 font-bold text-leo-blue group-hover:text-leo-blue/80 transition-colors line-clamp-2">
                      {writing.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="flex-1 text-sm text-leo-gray/80 leading-relaxed line-clamp-3 mb-4">
                      {writing.excerpt}
                    </p>

                    {/* Author & Date */}
                    <div className="pt-4 border-t border-leo-gray/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-leo-blue/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-leo-blue">
                            {writing.author.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-leo-gray">{writing.author}</p>
                          <p className="text-xs text-leo-gray/60">{writing.date}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}

              {/* Empty state */}
              {filteredWritings.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-leo-gray">No writings found in this category yet.</p>
                  <p className="mt-2 text-sm text-leo-gray/60">Be the first to share your writing!</p>
                </div>
              )}
            </div>

            {/* Load More / View All */}
            {filteredWritings.length >= 6 && (
              <FadeIn delay={300}>
                <div className="mt-10 text-center">
                  <Link
                    href="#"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-leo-blue transition-colors hover:text-leo-blue/80"
                  >
                    View All Writings
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </FadeIn>

      {/* Submit Section (CTA) */}
      <FadeIn delay={400}>
        <section className="py-16 sm:py-20 bg-leo-blue text-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Have a story to tell?</h2>
            <p className="mt-4 text-lg text-white/90">
              Share your poems, stories, essays, or reflections with the club community.
              Your voice matters.
            </p>
            <Link
              href="/submit"
              className="mt-8 inline-flex items-center px-8 py-4 text-base font-semibold text-leo-blue bg-leo-yellow rounded-lg transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-xl hover:shadow-leo-yellow/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Submit Your Work
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </section>
      </FadeIn>
    </>
  );
}