"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import FadeIn from "@/components/FadeIn";

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

type Status = "past" | "today" | "upcoming";

type ApiEvent = {
  id: string;
  _id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: string;
  status: string;
};

type TimelineItem = {
  id: string;
  iso: string;
  title: string;
  location: string;
  description: string;
  kind: "event" | "marker";
  status: Status;
  date?: string;
  type?: string;
};

type PastWorkItem = { title: string; description: string };

const pastWorkByYear: Record<string, PastWorkItem[]> = {
  "2026/27": [
    { title: "Tree Plantation Day", description: "Planted 200 saplings around the campus." },
    { title: "Blood Donation Camp", description: "Organized with the Red Cross; 80 people donated." },
    { title: "Community Library Setup", description: "Set up a reading corner for neighborhood children." },
    { title: "Teachers&apos; Day Celebration", description: "A student-run program honoring campus teachers." },
  ],
  "2025/26": [
    { title: "Food Drive for Flood Victims", description: "Collected and packed dry food kits." },
    { title: "School Painting Project", description: "Painted murals at a local school." },
    { title: "Health Check-Up Camp", description: "Free basic health checks with local doctors." },
    { title: "Winter Warmth Drive", description: "Distributed blankets in the valley." },
  ],
};

const years = Object.keys(pastWorkByYear).sort().reverse();

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const ROW_SIZE = 5;
const STEP = 100 / ROW_SIZE;
const EASE = [0.22, 1, 0.36, 1] as const;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const toLocalISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function buildTimeline(items: ApiEvent[], todayISO: string): TimelineItem[] {
  const itemsWithStatus: TimelineItem[] = items.map((e: ApiEvent) => {
    const iso = e.date ? e.date.split("T")[0] : "";
    let status: "past" | "today" | "upcoming";
    if (iso && iso < new Date().toISOString().split("T")[0]) status = "past";
    else if (iso === new Date().toISOString().split("T")[0]) status = "today";
    else status = "upcoming";
    return { ...e, iso, status, kind: "event" as const };
  });

  if (!itemsWithStatus.some((i) => i.status === "today")) {
    const marker: TimelineItem = {
      id: "today-marker",
      kind: "marker",
      status: "today",
      iso: todayISO,
      title: "Today",
      location: "",
      description: "",
      date: todayISO,
      type: "marker",
    };
    const at = itemsWithStatus.findIndex((i) => i.iso && i.iso > todayISO);
    itemsWithStatus.splice(at === -1 ? itemsWithStatus.length : at, 0, marker);
  }
  return itemsWithStatus;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
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

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const viewport = { once: true, amount: 0.2 } as const;

const STATUS = {
  past: { dot: "bg-leo-green", glow: "shadow-leo-green/60", text: "text-leo-green", label: "Completed", ring: "ring-leo-green/30" },
  today: { dot: "bg-leo-yellow", glow: "shadow-leo-yellow/70", text: "text-leo-yellow", label: "Today", ring: "ring-leo-yellow/50" },
  upcoming: { dot: "bg-leo-blue", glow: "shadow-leo-blue/60", text: "text-leo-blue", label: "Upcoming", ring: "ring-leo-blue/30" },
} as const;

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
  const s = STATUS[item.status as keyof typeof STATUS];
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
      className={`relative grid items-start ${isLast ? "" : "pb-24"}`}
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
        const s = STATUS[item.status as keyof typeof STATUS];
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
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function OurWorkPage() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [todayISO] = useState<string>(() => toLocalISO(new Date()));

useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          const items: ApiEvent[] = data.map((event: ApiEvent) => {
            const iso = event.date ? event.date.split("T")[0] : "";
            let status: "past" | "today" | "upcoming";
            if (iso && iso < new Date().toISOString().split("T")[0]) status = "past";
            else if (iso === new Date().toISOString().split("T")[0]) status = "today";
            else status = "upcoming";
            return { ...event, iso: event.date?.split("T")[0] || "", status, kind: "event" as const };
          });
          const todayISO = new Date().toISOString().split("T")[0];
          const timelineItems = buildTimeline(items, todayISO);
          setTimelineItems(timelineItems);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const rows = useMemo(() => chunk(timelineItems, ROW_SIZE), [timelineItems]);

  return (
    <MotionConfig reducedMotion="user">
      <FadeIn>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Our Work</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">The club&apos;s recent events and work over the years.</p>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-leo-blue md:text-4xl">This Year&apos;s Timeline</h2>
                <p className="mx-auto mt-4 max-w-2xl text-leo-gray">
                  Hover over or focus any dot to reveal event details.
                </p>
              </div>
            </FadeIn>

            <div className="hidden min-h-[480px] md:block">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-leo-blue border-t-transparent"></div>
                </div>
              ) : (
                <div className="py-8">
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
              )}

              <FadeIn delay={300}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                  {(["past", "today", "upcoming"] as const).map((key) => (
                    <span key={key} className="flex items-center gap-2 text-leo-gray">
                      <span className={`h-3 w-3 rounded-full ${STATUS[key as keyof typeof STATUS].dot}`} />
                      <span className="text-sm font-medium">{STATUS[key as keyof typeof STATUS].label}</span>
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>

            <div className="md:hidden">
              <MobileTimeline items={timelineItems} />
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={200}>
        <section className="py-16 sm:py-20 bg-leo-yellow/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl mb-6">Past work</h2>
            <p className="mb-6 text-sm text-gray-600">Choose a Leo year to see what the club did.</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={
                    selectedYear === year
                      ? "rounded-full bg-leo-blue px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      : "rounded-full border border-leo-blue/30 px-4 py-2 font-semibold text-leo-blue transition-all duration-300 hover:bg-leo-blue/10"
                  }
                >
                  {year}
                </button>
              ))}
            </div>

            <FadeIn delay={100}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastWorkByYear[selectedYear].map((item) => (
                  <FadeIn key={item.title} delay={100} className="group">
                    <Link
                      href="#"
                      className="block overflow-hidden rounded-xl border border-leo-gray/10 bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="flex aspect-video items-center justify-center bg-leo-yellow/20">
                        <span className="text-sm text-leo-blue/70">Photo</span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-leo-blue group-hover:text-leo-blue/80 transition-colors">{item.title}</h3>
                        <p className="mt-1 text-sm text-gray-700">{item.description}</p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      </FadeIn>
    </MotionConfig>
  );
}