"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import FadeIn from "@/components/FadeIn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

// Shape of a writing document stored in the database
type DbWriting = {
  _id: string;
  category: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  likes?: number;
  comments?: unknown[];
};

// Shape of a past-work document (from /api/past-work)
type PastWork = {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date?: string;
};

type ImpactNumbers = {
  peopleHelped: number;
  eventsHeld: number;
  volunteerHours: number;
  activeMembers: number;
};

/* -------------------------------------------------------------------------- */
/*  Placeholder data (shown until /api/past-work responds with real data)     */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER_PAST_WORK: PastWork[] = [
  {
    _id: "placeholder-1",
    title: "Tree Plantation Day",
    description: "Planted 200 saplings around the campus with students and volunteers.",
    date: "Nov 2026",
  },
  {
    _id: "placeholder-2",
    title: "Blood Donation Camp",
    description: "Organized with the Red Cross — 80 people donated to help save lives.",
    date: "Oct 2026",
  },
  {
    _id: "placeholder-3",
    title: "Community Library Setup",
    description: "Set up a cozy reading corner for neighborhood children.",
    date: "Sep 2026",
  },
  {
    _id: "placeholder-4",
    title: "Teachers' Day Celebration",
    description: "A student-run program honoring the teachers of our campus.",
    date: "Sep 2026",
  },
];

/* -------------------------------------------------------------------------- */
/*  Shared styles (keyframes can't be expressed in plain Tailwind classes)    */
/* -------------------------------------------------------------------------- */

const PAGE_CSS = `
@keyframes leo-marquee {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}
@keyframes leo-float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(0, -18px, 0); }
}
.leo-float      { animation: leo-float 9s ease-in-out infinite; }
.leo-float-slow { animation: leo-float 13s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .leo-float, .leo-float-slow { animation: none; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

// Animates a number from 0 up to the target value
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// Becomes true (once) when the element scrolls into view
function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function ImpactNumber({ value, label }: { value: number; label: string }) {
  const display = useCountUp(value);
  return (
    <FadeIn delay={100} className="group">
      <div className="rounded-xl border border-leo-blue/20 bg-white p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <p className="text-3xl font-bold tabular-nums text-leo-blue">
          {display.toLocaleString("en-US")}
        </p>
        <p className="mt-2 text-sm text-gray-700">{label}</p>
      </div>
    </FadeIn>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-leo-blue/70">
        <span className="h-0.5 w-8 rounded-full bg-leo-yellow" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold text-leo-blue md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-gray-600">{subtitle}</p>
    </div>
  );
}

function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border border-leo-blue/20 bg-white px-6 py-3 text-sm font-semibold text-leo-blue shadow-sm transition-all duration-300 hover:border-leo-blue hover:bg-leo-blue hover:text-white hover:shadow-lg hover:shadow-leo-blue/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
    >
      {children}
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Auto-scrolling carousel                                                   */
/* -------------------------------------------------------------------------- */

type MarqueeProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  /** `hidden` is true for the cloned set that makes the loop seamless (keep it out of tab order). */
  renderCard: (item: T, hidden: boolean) => ReactNode;
  label: string;
  secondsPerCard?: number;
  /** "left": content drifts left, new cards enter from the right. "right": the opposite. */
  direction?: "left" | "right";
};

/**
 * Seamless infinite carousel: the card set is rendered twice and the track slides
 * by exactly one set (-50%), then restarts — so there is no visible jump.
 * 3 cards per view on desktop, 2 on tablet, 1 (+ a peek of the next) on mobile.
 * Pauses on hover and keyboard focus. Falls back to a static, swipeable row
 * for users who prefer reduced motion, and to a centered row when there are < 3 items.
 */
function Marquee<T>({ items, getKey, renderCard, label, secondsPerCard = 7, direction = "left" }: MarqueeProps<T>) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  const animated = items.length >= 3 && !reduced;
  const centered = items.length < 3;
  const duration = Math.max(items.length * secondsPerCard, 24);

  // Card width is based on the container (cqw), so it works inside a width-less track.
  // Spacing uses margin (not gap) so one set is exactly half the track width.
  const cardSize =
    "shrink-0 mr-6 w-[85cqw] sm:w-[calc((100cqw_-_1.5rem)/2)] lg:w-[calc((100cqw_-_3rem)/3)]";

  const renderSet = (hidden: boolean) =>
    items.map((item, i) => (
      <div
        key={`${hidden ? "clone" : "main"}-${getKey(item)}`}
        aria-hidden={hidden || undefined}
        className={`${cardSize} transition-all duration-700 ease-out ${
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: inView && !hidden ? `${Math.min(i, 5) * 90}ms` : "0ms" }}
      >
        {renderCard(item, hidden)}
      </div>
    ));

  const fade =
    "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]";

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={`group relative py-6 [container-type:inline-size] ${
        animated ? `overflow-hidden ${fade}` : "overflow-x-auto [scrollbar-width:none]"
      }`}
    >
      <div
        className={`flex will-change-transform ${centered ? "w-full justify-center" : "w-max"} ${
          animated
            ? `${
                inView ? "[animation-play-state:running]" : "[animation-play-state:paused]"
              } group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]`
            : ""
        }`}
        style={
          animated
            ? {
                animationName: "leo-marquee",
                animationDuration: `${duration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: direction === "left" ? "normal" : "reverse",
              }
            : undefined
        }
      >
        {renderSet(false)}
        {animated && renderSet(true)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Past work card                                                            */
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
        // Intentional-looking placeholder: brand gradient + dotted texture + camera badge
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

function PastWorkCard({ item, hidden }: { item: PastWork; hidden: boolean }) {
  return (
    <Link
      href={`/our-work/${item._id}`}
      tabIndex={hidden ? -1 : undefined}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-leo-gray/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-leo-blue/20 hover:shadow-xl hover:shadow-leo-blue/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
    >
      <CoverImage src={item.imageUrl} alt={item.title} />
      <div className="flex flex-1 flex-col p-6">
        {item.date && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-leo-green">{item.date}</p>
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
/*  Literature card (text-only, typographic)                                  */
/* -------------------------------------------------------------------------- */

// Full class names so Tailwind can detect them
const LITERATURE_TONES: Record<string, { bg: string; tag: string; quote: string }> = {
  poetry: { bg: "to-leo-blue/10", tag: "bg-leo-blue/10 text-leo-blue", quote: "text-leo-blue" },
  stories: { bg: "to-leo-yellow/20", tag: "bg-leo-yellow/25 text-leo-gray", quote: "text-leo-yellow" },
  blogs: { bg: "to-leo-green/10", tag: "bg-leo-green/10 text-leo-green", quote: "text-leo-green" },
};
const DEFAULT_TONE = LITERATURE_TONES.poetry;

const initialsOf = (name: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function LiteratureCard({ item, hidden }: { item: DbWriting; hidden: boolean }) {
  const tone = LITERATURE_TONES[item.category?.toLowerCase()] ?? DEFAULT_TONE;

  return (
    <Link
      href={`/literature/${item._id}`}
      tabIndex={hidden ? -1 : undefined}
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
        {item.category}
      </span>

      <h3 className="relative mt-5 line-clamp-2 text-xl font-bold leading-snug text-leo-blue">{item.title}</h3>
      <p className="relative mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">{item.excerpt}</p>

      <div className="relative mt-6 flex items-center gap-3 border-t border-leo-gray/10 pt-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leo-blue/10 transition-colors duration-300 group-hover/card:bg-leo-blue">
          <span className="text-xs font-bold text-leo-blue transition-colors duration-300 group-hover/card:text-white">
            {initialsOf(item.author)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">{item.author}</p>
          {item.date && <p className="text-xs text-gray-500">{item.date}</p>}
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  What we do — icons                                                        */
/* -------------------------------------------------------------------------- */

const WHAT_WE_DO = [
  {
    title: "Service",
    text: "We run projects that help people around the campus and the valley.",
    tile: "bg-leo-green/10 text-leo-green",
    icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.14-1.14a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />,
  },
  {
    title: "Leadership",
    text: "Members take turns leading — planning, deciding, and doing.",
    tile: "bg-leo-blue/10 text-leo-blue",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Literature",
    text: "Poems, stories and blogs, written by students, in English or Nepali.",
    tile: "bg-leo-yellow/25 text-leo-gray",
    icon: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
];

const LEO_VALUES = ["Leadership", "Experience", "Opportunity", "Service"];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const { data: session } = useSession();
  const [latestWritings, setLatestWritings] = useState<DbWriting[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastWork, setPastWork] = useState<PastWork[]>(PLACEHOLDER_PAST_WORK);
  const [impact, setImpact] = useState<ImpactNumbers>({
    peopleHelped: 0,
    eventsHeld: 0,
    volunteerHours: 0,
    activeMembers: 0,
  });
  const [impactLoading, setImpactLoading] = useState(true);

  // Fetch the latest writings from the database on mount
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch("/api/literature");
        if (res.ok) {
          const data = await res.json();
          setLatestWritings(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch literature");
        }
      } catch (error) {
        console.error("Failed to fetch literature:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  // Fetch recent past work. If the endpoint isn't ready yet (or fails),
  // the placeholder items above stay on screen.
  useEffect(() => {
    async function fetchPastWork() {
      try {
        const res = await fetch("/api/past-work");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPastWork(data);
        }
      } catch (error) {
        console.error("Failed to fetch past work:", error);
      }
    }
    fetchPastWork();
  }, []);

  // Fetch the impact numbers from the database on mount
  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setImpact({
            peopleHelped: Number(data.peopleHelped) || 0,
            eventsHeld: Number(data.eventsHeld) || 0,
            volunteerHours: Number(data.volunteerHours) || 0,
            activeMembers: Number(data.activeMembers) || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch impact numbers:", error);
      } finally {
        setImpactLoading(false);
      }
    }
    fetchImpact();
  }, []);

  return (
    <>
      <style>{PAGE_CSS}</style>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-leo-blue via-leo-blue to-leo-blue/80 text-white">
        {/* Decorative background */}
        <div aria-hidden className="leo-float pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-leo-yellow/25 blur-3xl" />
        <div aria-hidden className="leo-float-slow pointer-events-none absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-leo-green/20 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />

        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
          <FadeIn>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-leo-yellow ring-1 ring-white/20 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-leo-yellow" />
              Kathmandu Valley Leo Club
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
              Students of the campus, <span className="text-leo-yellow">serving our community.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
              A student-run club where young people lead, serve, and grow.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/our-work"
                className="inline-flex items-center rounded-lg bg-leo-yellow px-7 py-3.5 font-semibold text-leo-blue transition-all duration-300 hover:scale-105 hover:bg-yellow-300 hover:shadow-xl hover:shadow-leo-yellow/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Explore our work
              </Link>
              <Link
                href="/literature"
                className="inline-flex items-center rounded-lg border border-white/30 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Read our literature
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {LEO_VALUES.map((value) => (
                <li
                  key={value}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-leo-yellow" />
                  {value}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <SectionHeader
              eyebrow="About the club"
              title="What we do"
              subtitle="The Kathmandu Valley Leo Club is a community service club for students of the campus. We organize service projects, practice leadership, and share our writing — in English and Nepali. LEO stands for Leadership, Experience, Opportunity, Service: the four things every member grows through."
            />
          </FadeIn>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {WHAT_WE_DO.map((item, i) => (
              <FadeIn key={item.title} delay={i * 120} className="group">
                <div className="h-full rounded-2xl border border-leo-gray/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-leo-blue/10">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${item.tile}`}>
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-leo-blue">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <FadeIn delay={200}>
        <section className="bg-leo-yellow/10 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Our impact</h2>
            <p className="mt-2 text-sm text-gray-600">Real figures, updated by the club&apos;s admins.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {impactLoading ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : (
                [
                  { label: "People helped", value: impact.peopleHelped },
                  { label: "Events held", value: impact.eventsHeld },
                  { label: "Volunteer hours", value: impact.volunteerHours },
                  { label: "Active members", value: impact.activeMembers },
                ].map((item) => (
                  <ImpactNumber key={item.label} label={item.label} value={item.value} />
                ))
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Recent work */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <SectionHeader
              eyebrow="What we've done"
              title="Recent work"
              subtitle="A look at the projects our members have organized and carried out lately."
            />
          </FadeIn>

          <div className="mt-6">
            {pastWork.length === 0 ? (
              <p className="py-10 text-sm text-gray-600">Our recent work will show up here soon.</p>
            ) : (
              <Marquee
                items={pastWork.slice(0, 4)}
                getKey={(item) => item._id}
                label="Recent work"
                renderCard={(item, hidden) => <PastWorkCard item={item} hidden={hidden} />}
              />
            )}
          </div>

          <FadeIn delay={150}>
            <div className="mt-6 text-center">
              <ArrowLink href="/our-work">View All Work</ArrowLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Latest literature */}
      <section className="bg-leo-gray/5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <SectionHeader
              eyebrow="From our members"
              title="Latest literature"
              subtitle="Fresh posts from our members, in English and Nepali."
            />
          </FadeIn>

          <div className="mt-6">
            {loading ? (
              <p className="py-10 text-sm text-gray-600">Loading...</p>
            ) : latestWritings.length === 0 ? (
              <p className="py-10 text-sm text-gray-600">No writings yet — be the first to share!</p>
            ) : (
              <Marquee
                items={latestWritings.slice(0, 6)}
                getKey={(item) => item._id}
                label="Latest literature"
                renderCard={(item, hidden) => <LiteratureCard item={item} hidden={hidden} />}
              />
            )}
          </div>

          <FadeIn delay={150}>
            <div className="mt-6 text-center">
              <ArrowLink href="/literature">Browse All Literature</ArrowLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Call to action */}
      <FadeIn delay={400}>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
            <h2 className="text-2xl font-bold md:text-3xl">Have something to say?</h2>
            <p className="mt-3 text-white/90">Poems, stories, blogs — in English or Nepali. Your writing belongs here.</p>
            {session ? (
              <Link
                href="/submit"
                className="mt-6 inline-block rounded-lg bg-leo-yellow px-6 py-3 font-semibold text-leo-blue transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-leo-yellow/30"
              >
                Share your writing
              </Link>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="mt-6 inline-block rounded-lg bg-leo-yellow px-6 py-3 font-semibold text-leo-blue transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-leo-yellow/30"
              >
                Log in and share your writing
              </button>
            )}
          </div>
        </section>
      </FadeIn>
    </>
  );
}