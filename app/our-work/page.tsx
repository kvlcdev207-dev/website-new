"use client";

import { useState } from "react";

type Event = {
  id: string;
  status: "past" | "today" | "upcoming";
  date: string;
  title: string;
  location: string;
};

const events: Event[] = [
  { id: "1", status: "past", date: "Sat, 2 Oct 2026", title: "Campus Clean-Up Drive", location: "College Campus, Block A" },
  { id: "2", status: "past", date: "Wed, 28 Sep 2026", title: "Teachers' Day Program", location: "College Auditorium" },
  { id: "3", status: "today", date: "Fri, 9 Oct 2026", title: "Today", location: "College Hall" },
  { id: "4", status: "upcoming", date: "Sat, 24 Oct 2026", title: "Book Donation for the Library", location: "Campus Library" },
  { id: "5", status: "upcoming", date: "Sat, 12 Dec 2026", title: "Winter Clothes Drive", location: "Boudhanath Area" },
];

const STATUS = {
  past: { dot: "bg-leo-green", line: "bg-leo-green/60", text: "text-leo-green font-bold" },
  today: { dot: "bg-leo-yellow ring-2 ring-leo-yellow/30", line: "bg-leo-yellow/60", text: "text-leo-yellow font-bold" },
  upcoming: { dot: "bg-leo-gray", line: "bg-leo-gray/30", text: "text-leo-gray" },
} as const;

type PastWorkItem = {
  title: string;
  description: string;
};

const pastWorkByYear: Record<string, PastWorkItem[]> = {
  "2026/27": [
    { title: "Tree Plantation Day", description: "Planted 200 saplings around the campus." },
    { title: "Blood Donation Camp", description: "Organized with the Red Cross; 80 people donated." },
    { title: "Community Library Setup", description: "Set up a reading corner for neighborhood children." },
    { title: "Teachers' Day Celebration", description: "A student-run program honoring campus teachers." },
  ],
  "2025/26": [
    { title: "Food Drive for Flood Victims", description: "Collected and packed dry food kits." },
    { title: "School Painting Project", description: "Painted murals at a local school." },
    { title: "Health Check-Up Camp", description: "Free basic health checks with local doctors." },
    { title: "Winter Warmth Drive", description: "Distributed blankets in the valley." },
  ],
};

const years = ["2026/27", "2025/26"];

export default function OurWorkPage() {
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <>
      <section className="bg-leo-blue text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="text-3xl font-bold md:text-4xl">Our Work</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            The club&apos;s recent events and work over the years.
          </p>
        </div>
      </section>

      {/* Timeline section */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">This year&apos;s timeline</h2>
          <p className="mt-2 text-sm text-gray-600">Past, today, and upcoming — this committee&apos;s year.</p>

          {/* MOBILE: vertical line */}
          <div className="relative mt-8 md:hidden">
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-leo-gray/30" />
            {events.map((e) => {
              const s = STATUS[e.status];
              return (
                <div key={e.id} className="relative flex items-start gap-4">
                  <span className={`relative z-10 mt-0.5 h-4 w-4 rounded-full ${s.dot}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${s.text}`}>{e.title}</p>
                    <p className="text-xs text-gray-500">{e.date}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP: horizontal line */}
          <div className="relative mt-8 hidden md:block">
            <div className="flex w-full items-center">
              {events.map((e, i) => {
                const s = STATUS[e.status];
                const isFirst = i === 0;
                const isLast = i === events.length - 1;
                return (
                  <div key={e.id} className="flex w-full items-center">
                    {!isFirst && <div className={`h-0.5 flex-1 ${s.line}`} />}
                    <span className={`relative z-10 h-4 w-4 rounded-full ${s.dot}`} />
                    {!isLast && <div className={`h-0.5 flex-1 ${s.line}`} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex w-full">
              {events.map((e) => {
                const s = STATUS[e.status];
                return (
                  <div key={e.id} className="w-full text-center">
                    <p className="text-xs text-gray-500">{e.date}</p>
                    <p className={`mt-1 text-sm font-semibold ${s.text}`}>{e.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Past Work section */}
      <section className="bg-leo-yellow/10 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Past work</h2>
          <p className="mt-2 text-sm text-gray-600">Choose a Leo year to see what the club did.</p>

          {/* Year selector buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={
                  selectedYear === year
                    ? "rounded-full bg-leo-blue px-4 py-2 font-semibold text-white"
                    : "rounded-full border border-leo-blue/30 px-4 py-2 font-semibold text-leo-blue transition-colors hover:bg-leo-blue/10"
                }
              >
                {year}
              </button>
            ))}
          </div>

          {/* Cards for the selected year */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastWorkByYear[selectedYear].map((item) => (
              <div key={item.title} className="overflow-hidden rounded-md border border-gray-200 bg-white">
                {/* Cover photo placeholder */}
                <div className="flex aspect-video items-center justify-center bg-leo-yellow/20">
                  <span className="text-sm text-leo-blue/70">Photo</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-leo-blue">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}