"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import TopLiteratureSlider from "@/components/TopLiteratureSlider";
import { categoryColors, categoryLabels, type Category } from "@/data/literature";

const EASE = [0.22, 1, 0.36, 1] as const;
const filters: Category[] = ["all", "poetry", "stories", "blogs"];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

// Shape of a writing document stored in the database
type DbWriting = {
  _id: string;
  category: "poetry" | "stories" | "blogs";
  title: string;
  author: string;
  excerpt: string;
  date: string;
  likes?: number;
  comments?: unknown[];
};

export default function LiteraturePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [allWritings, setAllWritings] = useState<DbWriting[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all writings from the database on mount
  useEffect(() => {
    async function fetchWritings() {
      try {
        const res = await fetch("/api/literature");
        if (res.ok) {
          const data = await res.json();
          setAllWritings(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch literature");
        }
      } catch (error) {
        console.error("Failed to fetch literature:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWritings();
  }, []);

  const filteredWritings = useMemo(
    () => (activeCategory === "all" ? allWritings : allWritings.filter((w) => w.category === activeCategory)),
    [activeCategory, allWritings]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allWritings.length };
    for (const w of allWritings) map[w.category] = (map[w.category] ?? 0) + 1;
    return map;
  }, [allWritings]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Hero */}
      <FadeIn>
        <section className="relative overflow-hidden bg-leo-blue text-white">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-leo-yellow/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Literature &amp; Creative Writing</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              Poems, stories, and blogs written by our members in English and Nepali.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Top literature */}
      <TopLiteratureSlider />

      {/* Filters */}
      <section className="bg-white pb-4 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-2 text-center"
          >
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Member Writings</h2>
          </motion.div>

          <div className="mt-6 flex justify-center">
            <div
              role="group"
              aria-label="Category filters"
              className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-leo-gray/10 bg-leo-gray/5 p-1.5"
            >
              {filters.map((cat) => {
                const selected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={selected}
                    className="relative rounded-full px-5 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/40"
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-leo-blue shadow-md shadow-leo-blue/30"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${
                        selected ? "text-white" : "text-leo-gray hover:text-leo-blue"
                      }`}
                    >
                      {cat === "all" ? "All" : categoryLabels[cat]}
                      <span
                        className={`rounded-full px-1.5 text-xs tabular-nums transition-colors duration-200 ${
                          selected ? "bg-white/20 text-white" : "bg-leo-gray/10 text-leo-gray/70"
                        }`}
                      >
                        {counts[cat] ?? 0}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Writings grid */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="py-16 text-center text-leo-gray">Loading writings…</p>
          ) : (
          <>
          <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredWritings.map((writing, i) => (
                <motion.li
                  key={writing._id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
                >
                  <Link
                    href={`/literature/${writing._id}`}
                    className="group flex h-full flex-col rounded-2xl border border-leo-gray/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-leo-blue/20 hover:shadow-xl hover:shadow-leo-blue/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/40"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[writing.category]}`}>
                        {categoryLabels[writing.category]}
                      </span>
                      <span className="flex h-8 w-8 -translate-x-1 items-center justify-center rounded-full bg-leo-blue/5 text-leo-blue opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-leo-blue">{writing.title}</h3>
                    <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-leo-gray/80">{writing.excerpt}</p>

                    <div className="flex items-center justify-between border-t border-leo-gray/10 pt-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leo-blue/10 transition-colors duration-300 group-hover:bg-leo-blue">
                          <span className="text-xs font-bold text-leo-blue transition-colors duration-300 group-hover:text-white">
                            {initials(writing.author)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-leo-gray">{writing.author}</p>
                          <p className="text-xs text-leo-gray/60">{writing.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-leo-gray/60">
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5 text-leo-red/70" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.14-1.14a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {writing.likes ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {writing.comments?.length ?? 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Empty state */}
          <AnimatePresence>
            {filteredWritings.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <p className="text-leo-gray">No writings found in this category yet.</p>
                <p className="mt-2 text-sm text-leo-gray/60">Be the first to share your writing!</p>
              </motion.div>
            )}
          </AnimatePresence>
          </>
          )}

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
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-leo-blue py-16 text-white sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-leo-yellow/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto max-w-3xl px-4 text-center"
        >
          <h2 className="text-2xl font-bold md:text-4xl">Have a story to tell?</h2>
          <p className="mt-4 text-lg text-white/90">
            Share your poems, stories, essays, or reflections with the club community. Your voice matters.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-8 inline-block"
          >
            <Link
              href="/submit"
              className="group relative inline-flex items-center overflow-hidden rounded-lg bg-leo-yellow px-8 py-4 text-base font-semibold text-leo-blue transition-shadow duration-300 hover:shadow-xl hover:shadow-leo-yellow/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span className="relative z-10 flex items-center">
                Submit Your Work
                <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-full w-full -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[200%]"
              />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}