import Link from "next/link";

const executiveBoard = [
  { name: "Leo Sujan Pokharel", post: "President" },
  { name: "Leo Anubhav K.C.", post: "Vice-President" },
  { name: "Leo Samita Gyawali", post: "Secretary" },
  { name: "Leo Ashika Budhathoki", post: "Treasurer" },
  { name: "Leo Prince Parajuli", post: "Membership Chair" },
];

const committeeMembers = [
  { name: "Leo Abishek Parajuli", post: "Joint Secretary" },
  { name: "Leo Sailesh Acharya", post: "Joint Treasurer" },
  { name: "Leo Aashish B.K.", post: "Event Manager" },
  { name: "Leo Riju Maharjan", post: "Event Manager" },
  { name: "Leo Aashu Gurung", post: "Event Manager" },
  { name: "Leo Yunesh Shrestha", post: "Outreach Manager" },
  { name: "Leo Ambika Shrestha", post: "Outreach Manager" },
  { name: "Leo Nischhal Shrestha", post: "Technical Lead" },
  { name: "Leo Hemraj Timilsaina", post: "Content Creator" },
  { name: "Leo Rohit Rai", post: "Content Creator" },
];

function MemberCard({ name, post }: { name: string; post: string }) {
  return (
    <Link
      href="#"
      className="group flex flex-col items-center text-center p-6 bg-white rounded-xl border border-leo-gray/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Profile image with leo-yellow ring */}
      <div className="relative mb-4">
        <div className="absolute -inset-1 bg-leo-yellow/20 rounded-full" />
        <div className="relative h-28 w-28 rounded-full bg-leo-gray/10 flex items-center justify-center overflow-hidden ring-4 ring-leo-yellow/30">
          <span className="text-4xl font-medium text-leo-gray/40">
            {name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-leo-blue group-hover:text-leo-blue/80 transition-colors">{name}</h3>
      <p className="mt-1 text-sm font-medium text-leo-yellow">{post}</p>
    </Link>
  );
}

export default function CommitteePage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-leo-blue text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Committee</h1>
          <p className="mt-4 max-w-2xl text-white/90 text-lg">
            The dedicated team leading Kathmandu Valley Leo Club for Leo Year 2026/27.
          </p>
        </div>
      </section>

      {/* Executive Board */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Executive Board</h2>
              <p className="mt-2 text-sm text-leo-gray">The core leadership team steering the club this year.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {executiveBoard.map((member) => (
              <MemberCard key={member.name} name={member.name} post={member.post} />
            ))}
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-16 sm:py-20 bg-leo-gray/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-leo-blue md:text-3xl">Committee Members</h2>
            <p className="mt-2 text-sm text-leo-gray">The dedicated members driving our projects and initiatives.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {committeeMembers.map((member) => (
              <MemberCard key={member.name} name={member.name} post={member.post} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Committees - kept simple */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-leo-blue md:text-3xl mb-8 text-center">Past Committees</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {["2025/26", "2024/25"].map((year) => (
              <div key={year} className="overflow-hidden rounded-xl border border-leo-gray/10 bg-white p-8 text-center">
                <div className="flex aspect-video items-center justify-center bg-leo-gray/5 rounded-lg mb-4">
                  <span className="text-sm text-leo-gray/50">Team Photo — {year}</span>
                </div>
                <h3 className="font-bold text-leo-blue text-lg">Leo Year {year}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}