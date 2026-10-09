// ---------------------------------------------------------------------------
// Mock data — placeholder only. In a later phase this comes from the
// database instead of these arrays.
// ---------------------------------------------------------------------------

type CommitteeMember = {
  name: string;
  post: string;
};

// The current committee (Leo year 2026/27)
const presentCommittee: CommitteeMember[] = [
  { name: "Nischhal Shrestha", post: "Tech Lead" },
  { name: "Anisha Gurung", post: "President" },
  { name: "Rajesh Thapa", post: "Vice President" },
  { name: "Sneha Rai", post: "Secretary" },
  { name: "Bikram Shrestha", post: "Treasurer" },
  { name: "Sita Limbu", post: "Publicity Head" },
  { name: "Aayush Maharjan", post: "Event Coordinator" },
  { name: "Pooja Karki", post: "Membership Head" },
];

// Past committees — one team photo per year, no individual cards
const pastCommittees = ["2025/26", "2024/25"];

export default function CommitteePage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-leo-purple text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="text-3xl font-bold md:text-4xl">Committee</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            The people leading the club this year, and the teams that came
            before.
          </p>
        </div>
      </section>

      {/* Present committee */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-purple md:text-3xl">
            Present committee
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Leo year 2026/27 — one card per member.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {presentCommittee.map((member) => (
              <div
                key={member.name}
                className="rounded-md border border-gray-200 p-6 text-center"
              >
                {/* Member photo placeholder (circle) */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-leo-gold/20">
                  <span className="text-sm text-leo-purple/70">Photo</span>
                </div>
                <h3 className="mt-4 font-bold text-leo-purple">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-gray-700">{member.post}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past committees */}
      <section className="bg-leo-gold/10 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-leo-purple md:text-3xl">
            Past committees
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            One team photo per year.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {pastCommittees.map((year) => (
              <div
                key={year}
                className="overflow-hidden rounded-md border border-gray-200 bg-white"
              >
                {/* Team photo placeholder */}
                <div className="flex aspect-video items-center justify-center bg-leo-gold/20">
                  <span className="text-sm text-leo-purple/70">
                    Team Photo — {year}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-leo-purple">
                    Leo Year {year}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
