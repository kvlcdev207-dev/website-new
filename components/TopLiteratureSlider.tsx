"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { writings, categoryColors, categoryLabels } from "@/data/literature";

type Writing = (typeof writings)[number];

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_ITEMS = 5;
const AUTOPLAY_MS = 6500;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.25, ease: EASE } }),
};

/* ---------------------------------- bits ---------------------------------- */

const HeartIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.14-1.14a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === "left" ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7"} />
  </svg>
);

/** Thin bar that fills over AUTOPLAY_MS on the active slide. Pauses on hover/focus. */
function ProgressBar({
  active,
  autoplay,
  paused,
  onDone,
}: {
  active: boolean;
  autoplay: boolean;
  paused: boolean;
  onDone: () => void;
}) {
  return (
    <span className="block h-1 overflow-hidden rounded-full bg-leo-gray/15">
      {active && (
        <span
          className="block h-full origin-left rounded-full bg-leo-yellow"
          style={
            autoplay
              ? {
                  animation: `top-lit-progress ${AUTOPLAY_MS}ms linear forwards`,
                  animationPlayState: paused ? "paused" : "running",
                }
              : undefined
          }
          onAnimationEnd={autoplay ? onDone : undefined}
        />
      )}
    </span>
  );
}

/* -------------------------------- component -------------------------------- */

export default function TopLiteratureSlider() {
  // "Top" = most liked
  const top = useMemo(
    () => [...writings].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, MAX_ITEMS),
    []
  );

  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const count = top.length;
  if (count === 0) return null;

  const autoplay = !reduceMotion && count > 1;
  const paginate = (dir: number) => setPage(([cur]) => [(cur + dir + count) % count, dir]);
  const select = (i: number) => setPage(([cur]) => (i === cur ? [cur, 1] : [i, i > cur ? 1 : -1]));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) paginate(1);
    else if (info.offset.x > 80) paginate(-1);
  };

  const current: Writing = top[index];
  const likes = current.likes ?? 0;
  const comments = current.comments?.length ?? 0;

  return (
    <MotionConfig reducedMotion="user">
      <style>{`@keyframes top-lit-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>

      <section
        aria-roledescription="carousel"
        aria-label="Top literature"
        className="relative overflow-hidden bg-gradient-to-b from-leo-blue/5 via-white to-white py-16 sm:py-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-leo-yellow/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-leo-yellow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-leo-gray">
                <HeartIcon className="h-3.5 w-3.5 text-leo-red" />
                Most loved
              </span>
              <h2 className="mt-3 text-3xl font-bold text-leo-blue md:text-4xl">Top Literature</h2>
              <p className="mt-2 max-w-xl text-leo-gray/80">The pieces our readers keep coming back to.</p>
            </div>

            {count > 1 && (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm font-semibold tabular-nums text-leo-gray/60 sm:block">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                {(["left", "right"] as const).map((dir) => (
                  <motion.button
                    key={dir}
                    type="button"
                    onClick={() => paginate(dir === "left" ? -1 : 1)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={dir === "left" ? "Previous writing" : "Next writing"}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-leo-gray/15 bg-white text-leo-blue shadow-sm transition-colors duration-300 hover:bg-leo-blue hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
                  >
                    <Arrow dir={dir} />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Featured card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="lg:col-span-8"
            >
              <div className="relative flex min-h-[26rem] overflow-hidden rounded-3xl bg-gradient-to-br from-leo-blue to-leo-blue/85 p-6 text-white shadow-2xl shadow-leo-blue/20 sm:p-10">
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-leo-yellow/25 blur-3xl" />
                <span aria-hidden className="pointer-events-none absolute right-6 top-0 select-none font-serif text-[10rem] leading-none text-white/10">
                  &ldquo;
                </span>

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.article
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag={count > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={onDragEnd}
                    aria-live="polite"
                    className="relative flex flex-1 flex-col justify-between gap-8"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-leo-yellow px-3 py-1 text-xs font-bold text-leo-gray">
                          {index === 0 ? "★ Most loved" : `#${index + 1} Top pick`}
                        </span>
                        {/* white backing keeps the category colours readable on blue */}
                        <span className="inline-flex rounded-full bg-white p-0.5">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[current.category]}`}>
                            {categoryLabels[current.category]}
                          </span>
                        </span>
                      </div>

                      <h3 className="mt-5 line-clamp-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                        {current.title}
                      </h3>
                      <p className="mt-4 line-clamp-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                        {current.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                          <span className="text-sm font-bold">{initials(current.author)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{current.author}</p>
                          <p className="flex items-center gap-3 text-sm text-white/70">
                            <span>{current.date}</span>
                            <span className="flex items-center gap-1">
                              <HeartIcon className="h-3.5 w-3.5 text-leo-yellow" />
                              {likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <CommentIcon className="h-3.5 w-3.5" />
                              {comments}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/literature/${current.id}`}
                        className="group inline-flex items-center gap-2 rounded-full bg-leo-yellow px-6 py-3 text-sm font-semibold text-leo-gray transition-shadow duration-300 hover:shadow-xl hover:shadow-leo-yellow/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Read writing
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          <Arrow dir="right" />
                        </span>
                      </Link>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              {/* Mobile / tablet: segmented progress */}
              {count > 1 && (
                <div className="mt-4 flex gap-2 lg:hidden">
                  {top.map((w, i) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => select(i)}
                      aria-label={`Show ${w.title}`}
                      aria-current={i === index}
                      className="flex-1 py-2"
                    >
                      <ProgressBar active={i === index} autoplay={autoplay} paused={paused} onDone={() => paginate(1)} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Desktop: playlist */}
            {count > 1 && (
              <motion.ol
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                className="hidden flex-col gap-2 lg:col-span-4 lg:flex"
              >
                {top.map((w, i) => {
                  const active = i === index;
                  return (
                    <li key={w.id} className="relative">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-current={active}
                        className="relative w-full rounded-2xl p-4 pb-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/40"
                      >
                        {active && (
                          <motion.span
                            layoutId="top-lit-active"
                            className="absolute inset-0 rounded-2xl border border-leo-gray/10 bg-white shadow-lg shadow-leo-blue/10"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative flex items-center gap-4">
                          <span className={`text-2xl font-bold tabular-nums transition-colors duration-300 ${active ? "text-leo-yellow" : "text-leo-gray/30"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate font-semibold transition-colors duration-300 ${active ? "text-leo-blue" : "text-leo-gray"}`}>
                              {w.title}
                            </span>
                            <span className="mt-0.5 flex items-center gap-3 text-xs text-leo-gray/60">
                              <span className="truncate">{w.author}</span>
                              <span className="flex shrink-0 items-center gap-1">
                                <HeartIcon className="h-3 w-3 text-leo-red/70" />
                                {w.likes ?? 0}
                              </span>
                            </span>
                          </span>
                        </span>
                        <span className="absolute inset-x-4 bottom-2">
                          <ProgressBar active={active} autoplay={autoplay} paused={paused} onDone={() => paginate(1)} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </motion.ol>
            )}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}