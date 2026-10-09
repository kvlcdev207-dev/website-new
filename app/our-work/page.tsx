"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Mock data — placeholder only. In a later phase this comes from the
// database instead of these arrays.
// ---------------------------------------------------------------------------

type UpcomingEvent = {
  date: string;
  title: string;
  location: string;
  description: string;
};

type PastWorkItem = {
  title: string;
  description: string;
};

// Events that have not happened yet
const upcomingEvents: UpcomingEvent[] = [
  {
    date: "Sat, 24 Oct 2026",
    title: "Campus Clean-Up Drive",
    location: "College Campus, Block A",
    description:
      "A morning of cleaning and tidying the campus with gloves and bags provided.",
  },
  {
    date: "Sat, 14 Nov 2026",
    title: "Book Donation for the Library",
    location: "Campus Library",
    description:
      "Bring your old textbooks and story books to stock the student library.",
  },
  {
    date: "Sat, 12 Dec 2026",
    title: "Winter Clothes Drive",
    location: "Boudhanath Stupa Area",
    description:
      "Collecting warm clothes from students to share with families nearby.",
  },
];

// Past work, grouped by Leo year. The year selector shows one group at a time.
const pastWorkByYear: Record<string, PastWorkItem[]> = {
  "2026/27": [
    {
      title: "Tree Plantation Day",
      description: "Planted 200 saplings around the campus with the eco club.",
    },
    {
      title: "Blood Donation Camp",
      description: "Organized with the Red Cross; 80 people donated blood.",
    },
    {
      title: "Community Library Setup",
      description: "Set up a small reading corner for the neighborhood children.",
    },
    {
      title: "Teachers' Day Celebration",
      description: "A student-run program to honor the campus teachers.",
    },
  ],
  "2025/26": [
    {
      title: "Food Drive for Flood Victims",
      description: "Collected and packed dry food kits for affected families.",
    },
    {
      title: "School Painting Project",
      description: "Painted the walls of a local school with educational murals.",
    },
    {
      title: "Health Check-Up Camp",
      description: "Free basic health checks with a team of local doctors.",
    },
    {
      title: "Winter Warmth Drive",
      description: "Distributed blankets and warm clothes in the valley.",
    },
  ],
};

// Years shown in the selector (newest first)
const years = ["2026/27", "2025/26"];

export default function OurWorkPage() {
  // Which year's past work is shown (only used by the year selector)
  const [selectedYear, setSelectedYear] = useState(years[0]);

  return (
    <>
      {/* Page header */}
      <section className="bg-leo-purple text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="text-3xl font-bold md:text-4xl">Our Work</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            What the club is doing next, and what we have done before, year
            by year.
          </p>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-purple md:text-3xl">
            Upcoming events
          </h2>
          <div className="mt-8 space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-md border border-gray-200 p-5 sm:flex sm:items-start sm:gap-5"
              >
                {/* Date badge */}
                <div className="mb-3 rounded-md bg-leo-gold/20 px-4 py-2 text-center sm:mb-0 sm:min-w-[130px]">
                  <p className="text-sm font-bold text-leo-purple">
                    {event.date}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-leo-purple">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-leo-purple/80">
                    {event.location}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past work, by year */}
      <section className="bg-leo-gold/10 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-purple md:text-3xl">
            Past work
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a Leo year to see what the club did.
          </p>

          {/* Year selector buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={
                  selectedYear === year
                    ? "rounded-full bg-leo-purple px-4 py-2 font-semibold text-white"
                    : "rounded-full border border-leo-purple/30 px-4 py-2 font-semibold text-leo-purple transition-colors hover:bg-leo-purple/10"
                }
              >
                {year}
              </button>
            ))}
          </div>

          {/* Cards for the selected year */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastWorkByYear[selectedYear].map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-md border border-gray-200 bg-white"
              >
                {/* Cover photo placeholder */}
                <div className="flex aspect-video items-center justify-center bg-leo-gold/20">
                  <span className="text-sm text-leo-purple/70">Photo</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-leo-purple">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-700">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
