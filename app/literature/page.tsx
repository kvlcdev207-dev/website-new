"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import TopLiteratureSlider from "@/components/TopLiteratureSlider";
import { categoryLabels, type Category } from "@/data/literature";

const EASE = [0.22, 1, 0.36, 1] as const;
const filters: Category[] = ["all", "poetry", "stories", "blogs"];

/** Rows shown at first, and how many rows each "Show more" click reveals. */
const INITIAL_ROWS = 2;
const ROWS_PER_CLICK = 2;

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

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const initialsOf = (name: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Same tones as the home page cards (full class names so Tailwind can see them)
const TONES: Record<DbWriting["category"], { bg: string; tag: string; quote: string }> = {
  poetry: { bg: "to-leo-blue/10", tag: "bg-leo-blue/10 text-leo-blue", quote: "text-leo-blue" },
  stories: { bg: "to-leo-yellow/20", tag: "bg-leo-yellow/25 text-leo-gray", quote: "text-leo-yellow" },
  blogs: { bg: "to-leo-green/10", tag: "bg-leo-green/10 text-leo-green", quote: "text-leo-green" },
};

/** Columns currently shown by the grid (matches Tailwind's sm / lg breakpoints). */
function useColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const update = () => setCols(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

/* -------------------------------------------------------------------------- */
/*  Card (same design as the home page literature card)                       */
/* -------------------------------------------------------------------------- */

function WritingCard({ writing }: { writing: DbWriting }) {
  const tone = TONES[writing.category] ?? TONES.poetry;

  return (
    <Link
      href={`/literature/${writing._id}`}
      className={`group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-leo-gray/10 bg-gradient-to-br from-white via-white ${tone.bg} p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-leo-blue/20 hover:shadow-xl hover:shadow-leo-blue/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50`}
    >
      {/* Decorative quote mark */}
      <svg
        aria-hidden
        className={`absolute right-5 top-5 h-16 w-16 opacity-10 transition-all duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110 group-hover/card:opacity-20 ${tone.quote}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.4 4C5.8 5.4 3 8.9 3 13.2V20h7.5v-7.5H6.6c.2-2.3 1.5-4 3.6-5L9.4 4zm10 0c-3.6 1.4-6.4 4.9-6.4 9.2V20h7.5v-7.5h-3.9c.2-2.3 1.5-4 3.6-5L19.4 4z" />
      </svg>

      <span className={`relative inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tone.tag}`}>
        {categoryLabels[writing.category] ?? writing.category}
      </span>

      <h3 className="relative mt-5 line-clamp-2 text-xl font-bold leading-snug text-leo-blue">{writing.title}</h3>
      <p className="relative mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">{writing.excerpt}</p>

      <div className="relative mt-6 flex items-center gap-3 border-t border-leo-gray/10 pt-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leo-blue/10 transition-colors duration-300 group-hover/card:bg-leo-blue">
          <span className="text-xs font-bold text-leo-blue transition-colors duration-300 group-hover/card:text-white">
            {initialsOf(writing.author)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">{writing.author}</p>
          {writing.date && <p className="text-xs text-gray-500">{writing.date}</p>}
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LiteraturePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [allWritings, setAllWritings] = useState<DbWriting[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);

  const columns = useColumns();
  const gridTopRef = useRef<HTMLDivElement | null>(null);

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

  // Rows → cards, so "2 rows" stays true on every screen size
  const initialCount = INITIAL_ROWS * columns;
  const step = ROWS_PER_CLICK * columns;
  const visibleCount = visibleRows * columns;
  const visibleWritings = filteredWritings.slice(0, visibleCount);
  const remaining = Math.max(0, filteredWritings.length - visibleCount);
  const canCollapse = remaining === 0 && filteredWritings.length > initialCount;

  const changeCategory = (cat: Category) => {
    setActiveCategory(cat);
    setVisibleRows(INITIAL_ROWS); // every filter starts back at 2 rows
  };

  const showMore = () => setVisibleRows((r) => r + ROWS_PER_CLICK);
  const showLess = () => {
    setVisibleRows(INITIAL_ROWS);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      <TopLiteratureSlider writings={allWritings.slice(0, 5)} />

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
                    onClick={() => changeCategory(cat)}
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
        <div ref={gridTopRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="py-16 text-center text-leo-gray">Loading writings…</p>
          ) : (
            <>
              <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visibleWritings.map((writing, i) => (
                    <motion.li
                      key={writing._id}
                      layout
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, ease: EASE, delay: Math.min(i % step, 6) * 0.05 }}
                    >
                      <WritingCard writing={writing} />
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

              {/* Show more / Show less */}
              {(remaining > 0 || canCollapse) && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={remaining > 0 ? showMore : showLess}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    aria-expanded={remaining === 0}
                    className="group inline-flex items-center gap-2 rounded-full border border-leo-blue/20 bg-white px-7 py-3 text-sm font-semibold text-leo-blue shadow-sm transition-all duration-300 hover:border-leo-blue hover:bg-leo-blue hover:text-white hover:shadow-lg hover:shadow-leo-blue/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
                  >
                    {remaining > 0 ? "Show more writings" : "Show less"}
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${
                        remaining > 0 ? "group-hover:translate-y-0.5" : "rotate-180 group-hover:-translate-y-0.5"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.button>

                  <p className="text-xs tabular-nums text-leo-gray/60">
                    Showing {Math.min(visibleCount, filteredWritings.length)} of {filteredWritings.length}
                  </p>
                </div>
              )}
            </>
          )}
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