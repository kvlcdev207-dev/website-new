"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import FadeIn from "@/components/FadeIn";

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

type ImpactNumbers = {
  peopleHelped: number;
  eventsHeld: number;
  volunteerHours: number;
  activeMembers: number;
};

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

export default function HomePage() {
  const { data: session } = useSession();
  const [latestWritings, setLatestWritings] = useState<DbWriting[]>([]);
  const [loading, setLoading] = useState(true);
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

      {/* Latest literature */}
      <FadeIn delay={300}>
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Latest literature</h2>
            <p className="mt-2 text-sm text-gray-600">Fresh posts from our members, in English and Nepali.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {loading ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : latestWritings.length === 0 ? (
                <p className="text-sm text-gray-600">No writings yet — be the first to share!</p>
              ) : (
                latestWritings.slice(0, 3).map((item) => (
                  <FadeIn key={item._id} delay={100} className="group">
                    <Link href={`/literature/${item._id}`} className="block overflow-hidden rounded-xl border border-leo-gray/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex aspect-video items-center justify-center bg-leo-yellow/20">
                        <span className="text-sm text-leo-blue/70">Cover image</span>
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-leo-yellow">{item.category?.toUpperCase()}</p>
                        <h3 className="mt-1 font-bold text-leo-blue">{item.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{item.author}</p>
                      </div>
                    </Link>
                  </FadeIn>
                ))
              )}
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