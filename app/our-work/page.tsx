"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import FadeIn from "@/components/FadeIn";

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

type Status = "past" | "today" | "upcoming";

type ApiEvent = {
  id?: string;
  _id?: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  type?: string;
  status?: string;
};

type TimelineItem = {
  id: string;
  iso: string;
  title: string;
  location: string;
  description: string;
  kind: "event" | "marker";
  status: Status;
};

type PastWorkItem = {
  _id?: string;
  id?: string;
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const ROW_SIZE = 5;
const STEP = 100 / ROW_SIZE;
const EASE = [0.22, 1, 0.36, 1] as const;

/** Past-work grid: rows shown at first, and rows revealed per "Show more" click. */
const INITIAL_ROWS = 2;
const ROWS_PER_CLICK = 2;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

// The visitor's local calendar day (never the UTC day — those differ in Nepal before 5:45am)
const toLocalISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function buildTimeline(events: ApiEvent[], todayISO: string): TimelineItem[] {
  const items: TimelineItem[] = events
    .map((e, index) => {
      const iso = e.date ? e.date.split("T")[0] : "";
      const status: Status = iso < todayISO ? "past" : iso === todayISO ? "today" : "upcoming";
      return {
        id: e.id ?? e._id ?? `event-${index}`,
        iso,
        title: e.title,
        location: e.location ?? "",
        description: e.description ?? "",
        kind: "event" as const,
        status,
      };
    })
    .filter((e) => e.iso) // an event without a date can't be placed on a timeline
    .sort((a, b) => a.iso.localeCompare(b.iso));

  // Nothing happening today? Drop a "Today" marker in the right place.
  if (!items.some((i) => i.status === "today")) {
    const marker: TimelineItem = {
      id: "today-marker",
      kind: "marker",
      status: "today",
      iso: todayISO,
      title: "Today",
      location: "",
      description: "",
    };
    const at = items.findIndex((i) => i.iso > todayISO);
    items.splice(at === -1 ? items.length : at, 0, marker);
  }
  return items;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

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
/*  Animation variants                                                        */
/* -------------------------------------------------------------------------- */

const rowVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const STATUS = {
  past: { dot: "bg-leo-green", glow: "shadow-leo-green/60", text: "text-leo-green", label: "Completed", ring: "ring-leo-green/30" },
  today: { dot: "bg-leo-yellow", glow: "shadow-leo-yellow/70", text: "text-leo-yellow", label: "Today", ring: "ring-leo-yellow/50" },
  upcoming: { dot: "bg-leo-blue", glow: "shadow-leo-blue/60", text: "text-leo-blue", label: "Upcoming", ring: "ring-leo-blue/30" },
} as const;

/* -------------------------------------------------------------------------- */
/*  Small shared pieces                                                       */
/* -------------------------------------------------------------------------- */

function Spinner() {
  return (
    <div className="flex justify-center py-20" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-leo-blue border-t-transparent" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Timeline pieces                                                           */
/* -------------------------------------------------------------------------- */

function PulseRing({ className }: { className: string }) {
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-full ${className}`}
      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function TimelineNode({ item, column }: { item: TimelineItem; column: number }) {
  const [active, setActive] = useState(false);
  const s = STATUS[item.status];
  const isMarker = item.kind === "marker";

  const align =
    column === 0 ? "left-0" : column === ROW_SIZE - 1 ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <motion.div
      variants={nodeVariants}
      style={{ gridColumnStart: column + 1, gridRowStart: 1 }}
      className={`relative flex flex-col items-center ${active ? "z-40" : "z-10"}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="relative">
        {item.status === "today" && <PulseRing className={s.dot} />}

        <motion.button
          type="button"
          aria-label={isMarker ? "Today" : `${item.title}, ${formatDate(item.iso)}`}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className={`relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full ring-4 shadow-lg focus:outline-none focus-visible:ring-8 ${s.dot} ${s.ring} ${s.glow}`}
        >
          {isMarker ? (
            <span className="text-[10px] font-bold tracking-wide text-white">TODAY</span>
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
          )}
        </motion.button>
      </div>

      <p
        className={`mt-3 whitespace-nowrap text-xs font-medium transition-colors duration-200 ${
          active ? s.text : "text-leo-gray"
        }`}
      >
        {formatDate(item.iso)}
      </p>

      <div className={`pointer-events-none absolute top-full mt-3 w-56 ${align}`}>
        <AnimatePresence>
          {active && !isMarker && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-xl border border-leo-gray/10 bg-white p-4 shadow-2xl"
            >
              <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full bg-leo-blue/5 px-2 py-0.5 ${s.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                <span className="text-xs font-semibold">{s.label}</span>
              </div>
              <h3 className={`mb-1 font-bold ${s.text}`}>{item.title}</h3>
              <p className="text-xs font-medium text-leo-gray">{formatDate(item.iso)}</p>
              {item.location && <p className="mt-1 text-xs text-gray-600">{item.location}</p>}
              {item.description && <p className="mt-2 text-xs text-gray-700">{item.description}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TimelineRow({
  items,
  rowIndex,
  isLast,
  nextStarted,
}: {
  items: TimelineItem[];
  rowIndex: number;
  isLast: boolean;
  nextStarted: boolean;
}) {
  const reversed = rowIndex % 2 === 1;

  const reached = items.filter((i) => i.status !== "upcoming").length;
  const trackWidth = (items.length - 1) * STEP;
  const fillRatio = items.length > 1 ? Math.max(0, reached - 1) / (items.length - 1) : 0;

  const viewport = { once: true, margin: "-80px" } as const;
  const originX = reversed ? 1 : 0;
  const side = reversed ? "right" : "left";
  const connectorShape = reversed ? "rounded-l-full border-r-0" : "rounded-r-full border-l-0";

  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      // The hovered row lifts above its neighbours so its tooltip is never covered by the next row
      className={`relative grid items-start hover:z-30 focus-within:z-30 ${isLast ? "" : "pb-24"}`}
      style={{ gridTemplateColumns: `repeat(${ROW_SIZE}, minmax(0, 1fr))` }}
    >
      {items.length > 1 && (
        <div
          className="absolute top-[22px] h-1"
          style={{ [side]: `${STEP / 2}%`, width: `${trackWidth}%` }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-leo-gray/20"
            style={{ originX }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: EASE }}
          />
          {fillRatio > 0 && (
            <motion.div
              className="absolute inset-y-0 rounded-full bg-leo-green"
              style={{ [side]: 0, width: `${fillRatio * 100}%`, originX }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            />
          )}
        </div>
      )}

      {!isLast && (
        <div
          className="pointer-events-none absolute top-[22px] h-[calc(100%+4px)] w-16"
          style={reversed ? { right: `${100 - STEP / 2}%` } : { left: `${100 - STEP / 2}%` }}
        >
          <motion.div
            className={`absolute inset-0 border-4 border-leo-gray/20 ${connectorShape}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          {nextStarted && (
            <motion.div
              className={`absolute inset-0 border-4 border-leo-green ${connectorShape}`}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={viewport}
              transition={{ duration: 0.7, ease: EASE, delay: 1 }}
            />
          )}
        </div>
      )}

      {items.map((item, j) => (
        <TimelineNode key={item.id} item={item} column={reversed ? ROW_SIZE - 1 - j : j} />
      ))}
    </motion.div>
  );
}

function MobileTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative pl-10">
      {items.map((item, i) => {
        const s = STATUS[item.status];
        const next = items[i + 1];
        const segmentDone = item.status !== "upcoming" && next && next.status !== "upcoming";
        const isMarker = item.kind === "marker";

        return (
          <li key={item.id} className="relative pb-6 last:pb-0">
            {next && (
              <div className="absolute -left-[26px] top-3 -bottom-3 w-1 overflow-hidden rounded-full bg-leo-gray/20">
                {segmentDone && (
                  <motion.div
                    className="h-full w-full origin-top bg-leo-green"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                )}
              </div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`absolute -left-8 top-1 h-4 w-4 rounded-full ring-4 ${s.dot} ${s.ring}`}
            >
              {item.status === "today" && <PulseRing className={s.dot} />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {isMarker ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-leo-yellow/15 px-3 py-1">
                  <span className="text-xs font-bold text-leo-yellow">TODAY</span>
                  <span className="text-xs text-leo-gray">{formatDate(item.iso)}</span>
                </div>
              ) : (
                <div className="rounded-xl border border-leo-gray/10 bg-white p-4 shadow-sm">
                  <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full bg-leo-blue/5 px-2 py-0.5 text-xs font-semibold ${s.text}`}>
                    {s.label}
                  </div>
                  <h3 className={`font-bold ${s.text}`}>{item.title}</h3>
                  <p className="mt-1 text-xs text-leo-gray">{formatDate(item.iso)}</p>
                  {item.location && <p className="mt-1 text-xs text-gray-600">{item.location}</p>}
                  {item.description && <p className="mt-2 text-xs text-gray-700">{item.description}</p>}
                </div>
              )}
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/*  Past work card (same design as the home page)                             */
/* -------------------------------------------------------------------------- */

function CoverImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
      ) : (
        // Brand gradient + dotted texture + camera badge, so a missing photo looks intentional
        <div
          aria-hidden
          className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-leo-blue via-leo-blue/80 to-leo-yellow transition-transform duration-700 group-hover/card:scale-105"
        >
          <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-leo-yellow/50 blur-2xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-110">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function PastWorkCard({ item, href }: { item: PastWorkItem; href: string }) {
  return (
    <Link
      href={href}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-leo-gray/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-leo-blue/20 hover:shadow-xl hover:shadow-leo-blue/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
    >
      <CoverImage src={item.imageUrl} alt={item.title} />
      <div className="flex flex-1 flex-col p-6">
        {item.year && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-leo-green">Leo Year {item.year}</p>
        )}
        <h3 className="line-clamp-2 text-lg font-bold text-leo-blue">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-leo-blue">
          View project
          <svg className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function OurWorkPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastWork, setPastWork] = useState<PastWorkItem[]>([]);
  const [pastWorkLoading, setPastWorkLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);

  const columns = useColumns();
  const gridTopRef = useRef<HTMLDivElement | null>(null);

  // Group past work items by Leo year, newest year first
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(pastWork.map((item) => item.year).filter(Boolean)));
    return uniqueYears.sort().reverse();
  }, [pastWork]);

  const activeYear = selectedYear && years.includes(selectedYear) ? selectedYear : (years[0] ?? "");

  const pastWorkByYear = useMemo(() => {
    const grouped: Record<string, PastWorkItem[]> = {};
    for (const item of pastWork) {
      const year = item.year || "Unknown";
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    }
    return grouped;
  }, [pastWork]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          const events: ApiEvent[] = Array.isArray(data) ? data : [];
          setTimelineItems(buildTimeline(events, toLocalISO(new Date())));
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Load past work items from the API
  useEffect(() => {
    const fetchPastWork = async () => {
      try {
        const res = await fetch("/api/past-work");
        if (res.ok) {
          const data = await res.json();
          setPastWork(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch past work:", error);
      } finally {
        setPastWorkLoading(false);
      }
    };
    fetchPastWork();
  }, []);

  const rows = useMemo(() => chunk(timelineItems, ROW_SIZE), [timelineItems]);

  // Past-work paging: "rows" → cards, so two rows stays true at every screen size
  const yearItems = pastWorkByYear[activeYear] ?? [];
  const initialCount = INITIAL_ROWS * columns;
  const step = ROWS_PER_CLICK * columns;
  const visibleCount = visibleRows * columns;
  const visibleItems = yearItems.slice(0, visibleCount);
  const remaining = Math.max(0, yearItems.length - visibleCount);
  const canCollapse = remaining === 0 && yearItems.length > initialCount;

  const changeYear = (year: string) => {
    setSelectedYear(year);
    setVisibleRows(INITIAL_ROWS); // every year starts back at 2 rows
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
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Our Work</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">The club&apos;s recent events and work over the years.</p>
          </div>
        </section>
      </FadeIn>

      {/*
        Timeline.
        Note: sections are NOT wrapped in <FadeIn> any more. Fading a whole <section> also fades its
        background, which showed up as a blank white band until it scrolled into view.
      */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="text-3xl font-bold text-leo-blue md:text-4xl">This Year&apos;s Timeline</h2>
              <p className="mx-auto mt-4 max-w-2xl text-leo-gray">
                Hover over or focus any dot to reveal event details.
              </p>
            </div>
          </FadeIn>

          {/* Desktop snake timeline — height now follows the content (no forced min-height) */}
          <div className="hidden md:block">
            {loading ? (
              <Spinner />
            ) : rows.length === 0 ? (
              <p className="py-10 text-center text-leo-gray">No events scheduled yet — check back soon.</p>
            ) : (
              <>
                <div className="py-4">
                  {rows.map((row, i) => (
                    <TimelineRow
                      key={i}
                      items={row}
                      rowIndex={i}
                      isLast={i === rows.length - 1}
                      nextStarted={Boolean(rows[i + 1]) && rows[i + 1][0]?.status !== "upcoming"}
                    />
                  ))}
                </div>

                <FadeIn delay={300}>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                    {(["past", "today", "upcoming"] as const).map((key) => (
                      <span key={key} className="flex items-center gap-2 text-leo-gray">
                        <span className={`h-3 w-3 rounded-full ${STATUS[key].dot}`} />
                        <span className="text-sm font-medium">{STATUS[key].label}</span>
                      </span>
                    ))}
                  </div>
                </FadeIn>
              </>
            )}
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden">
            {loading ? (
              <Spinner />
            ) : timelineItems.length === 0 ? (
              <p className="py-6 text-center text-leo-gray">No events scheduled yet — check back soon.</p>
            ) : (
              <MobileTimeline items={timelineItems} />
            )}
          </div>
        </div>
      </section>

      {/* Past work */}
      <section className="bg-leo-yellow/5 py-16 sm:py-24">
        <div ref={gridTopRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-leo-blue md:text-4xl">Past work</h2>
              <p className="mx-auto mt-4 max-w-2xl text-leo-gray">Choose a Leo year to see what the club did.</p>
            </div>
          </FadeIn>

          {pastWorkLoading ? (
            <Spinner />
          ) : years.length === 0 ? (
            <p className="py-10 text-center text-leo-gray">No past work added yet.</p>
          ) : (
            <>
              {/* Year tabs with a sliding pill */}
              <div className="mb-12 flex justify-center">
                <div
                  role="tablist"
                  aria-label="Leo year"
                  className="inline-flex flex-wrap justify-center rounded-full border border-leo-blue/15 bg-white p-1.5 shadow-sm"
                >
                  {years.map((year) => {
                    const selected = activeYear === year;
                    return (
                      <button
                        key={year}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => changeYear(year)}
                        className="relative rounded-full px-6 py-2.5 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/40"
                      >
                        {selected && (
                          <motion.span
                            layoutId="year-pill"
                            className="absolute inset-0 rounded-full bg-leo-blue shadow-md"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span
                          className={`relative z-10 transition-colors duration-200 ${
                            selected ? "text-white" : "text-leo-blue hover:text-leo-blue/70"
                          }`}
                        >
                          {year}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid: 2 rows first, then "Show more" */}
              <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visibleItems.map((item, i) => {
                    const itemId = item._id ?? item.id;
                    return (
                      <motion.li
                        key={`${activeYear}-${itemId ?? item.title}`}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.45, ease: EASE, delay: Math.min(i % step, 6) * 0.05 }}
                      >
                        <PastWorkCard item={item} href={itemId ? `/our-work/${itemId}` : "#"} />
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

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
                    {remaining > 0 ? "Show more work" : "Show less"}
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
                    Showing {Math.min(visibleCount, yearItems.length)} of {yearItems.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}