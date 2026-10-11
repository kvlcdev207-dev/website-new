"use client";

import { useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

type Member = {
  name: string;
  role: string;
  // Photo in /public/images/committee/ — committed to GitHub with the code
  image: string;
  priority: number;
};

// Static committee list — edit names, roles and photo paths here.
// Cards render in priority order. If a photo file is missing, the
// card falls back to a Leo Blue to Gold gradient with a user icon.
const committeeMembers: Member[] = [
  { name: "Leo Sujan Pokharel", role: "President", image: "/images/committee/sujan-pokharel.png", priority: 1 },
  { name: "Leo Anubhav K.C.", role: "Vice-President", image: "/images/committee/anubhav-kc.png", priority: 2 },
  { name: "Leo Samita Gyawali", role: "Secretary", image: "/images/committee/samita-gyawali.png", priority: 3 },
  { name: "Leo Ashika Budhathoki", role: "Treasurer", image: "/images/committee/ashika-budhathoki.png", priority: 4 },
  { name: "Leo Prince Parajuli", role: "Membership Chair", image: "/images/committee/prince-parajuli.png", priority: 5 },
  { name: "Leo Abishek Parajuli", role: "Joint Secretary", image: "/images/committee/abishek-parajuli.png", priority: 6 },
  { name: "Leo Sailesh Acharya", role: "Joint Treasurer", image: "/images/committee/sailesh-acharya.png", priority: 7 },
  { name: "Leo Aashish B.K.", role: "Event Manager", image: "/images/committee/aashish-bk.png", priority: 8 },
  { name: "Leo Riju Maharjan", role: "Event Manager", image: "/images/committee/riju-maharjan.png", priority: 9 },
  { name: "Leo Aashu Gurung", role: "Event Manager", image: "/images/committee/aashu-gurung.png", priority: 10 },
  { name: "Leo Yunesh Shrestha", role: "Outreach Manager", image: "/images/committee/yunesh-shrestha.png", priority: 11 },
  { name: "Leo Ambika Shrestha", role: "Outreach Manager", image: "/images/committee/ambika-shrestha.png", priority: 12 },
  { name: "Leo Nischhal Shrestha", role: "Technical Lead", image: "/images/committee/nischhal-shrestha.png", priority: 13 },
  { name: "Leo Hemraj Timilsaina", role: "Content Creator", image: "/images/committee/hemraj-timilsaina.png", priority: 14 },
  { name: "Leo Rohit Rai", role: "Content Creator", image: "/images/committee/rohit-rai.png", priority: 15 },
];

type PastCommittee = { year: string; image?: string };

// Add as many as you want — the grid adjusts automatically.
const pastCommittees: PastCommittee[] = [
  { year: "2025/26" },
  { year: "2024/25" },
  { year: "2023/24" },
  { year: "2022/23" },
  { year: "2021/22" },
  { year: "2020/21" },
];

// Logo shown faintly in each card's banner. Put the file in /public.
const BANNER_LOGO = "/logo.png";

function MemberCard({ member, index }: { member: Member; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <FadeIn delay={(index % 5) * 80}>
      <div className="group h-full overflow-hidden rounded-3xl border border-leo-gray/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
        {/* banner */}
        <div className="relative h-24 bg-gradient-to-br from-leo-blue via-leo-blue to-leo-blue/80">
          <Image
            src={BANNER_LOGO}
            alt=""
            fill
            className="object-contain p-3 opacity-25 transition-opacity duration-300 group-hover:opacity-40"
          />
        </div>

        {/* avatar overlapping banner — gradient shows until a photo loads */}
        <div className="-mt-14 flex justify-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-leo-blue to-leo-yellow shadow-lg flex items-center justify-center">
            {imageFailed ? (
              <svg
                className="h-12 w-12 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ) : (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
        </div>

        <div className="px-4 pb-6 pt-4 text-center">
          <h3 className="text-lg font-bold leading-tight text-leo-blue">{member.name}</h3>
          <span className="mt-3 inline-block rounded-full bg-leo-yellow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-leo-blue">
            {member.role}
          </span>
        </div>
      </div>
    </FadeIn>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <FadeIn>
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">{title}</h2>
        <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-leo-yellow" />
        <p className="mx-auto mt-3 max-w-xl text-sm text-leo-gray">{subtitle}</p>
      </div>
    </FadeIn>
  );
}

export default function CommitteePage() {
  // Members always render in priority order
  const sortedMembers = [...committeeMembers].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <>
      <FadeIn>
        <section className="relative overflow-hidden bg-leo-blue text-white">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-leo-yellow/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <span className="inline-block rounded-full bg-leo-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-leo-blue">
              Leo Year 2026/27
            </span>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">Meet Our Committee</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">
              The dedicated team leading Kathmandu Valley Leo Club this year.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Committee Members" subtitle="The team steering the club this year, listed by priority." />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sortedMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-leo-gray/5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Past Committees" subtitle="The teams who built the club before us." />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastCommittees.map((c, i) => (
              <FadeIn key={c.year} delay={(i % 3) * 100}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-leo-gray/10 bg-gradient-to-br from-leo-gray/5 to-leo-gray/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={`Leo Year ${c.year} committee`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-leo-gray/50">
                      Team Photo — {c.year}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-leo-blue/90 to-transparent p-4 pt-12">
                    <h3 className="text-lg font-bold text-white">Leo Year {c.year}</h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
