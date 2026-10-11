"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

type PastWorkItem = {
  _id?: string;
  id?: string;
  title: string;
  year: string;
  description: string;
  imageUrl?: string;
};

export default function PastWorkDetailPage() {
  const params = useParams();
  const id = params.id as string | undefined;
  const [item, setItem] = useState<PastWorkItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/past-work/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else {
          setError(true);
        }
      } catch (fetchError) {
        console.error("Failed to fetch past work item:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  return (
    <>
      <FadeIn>
        <section className="bg-leo-blue text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            {loading ? (
              <div className="h-10 w-48 animate-pulse rounded bg-white/20" />
            ) : (
              <>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">
                  Leo Year {item?.year}
                </p>
                <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                  {item?.title}
                </h1>
              </>
            )}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-leo-blue border-t-transparent"></div>
              </div>
            ) : error || !item ? (
              <div className="rounded-xl border border-leo-gray/10 bg-white p-8 text-center">
                <h2 className="text-2xl font-bold text-leo-blue">
                  Item not found
                </h2>
                <p className="mt-2 text-leo-gray">
                  The past work item you are looking for does not exist.
                </p>
                <Link
                  href="/our-work"
                  className="mt-6 inline-block rounded-md bg-leo-blue px-5 py-2 font-medium text-white hover:bg-leo-blue/90"
                >
                  Back to Our Work
                </Link>
              </div>
            ) : (
              <>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="mb-8 w-full rounded-xl object-cover"
                  />
                )}
                <div className="rounded-xl border border-leo-gray/10 bg-white p-6 shadow sm:p-8">
                  <p className="mb-2 text-sm font-semibold text-leo-yellow">
                    Leo Year {item.year}
                  </p>
                  <h2 className="mb-4 text-2xl font-bold text-leo-blue sm:text-3xl">
                    {item.title}
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {item.description}
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/our-work"
                    className="inline-block rounded-md bg-leo-blue px-5 py-2 font-medium text-white hover:bg-leo-blue/90"
                  >
                    &larr; Back to Our Work
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </FadeIn>
    </>
  );
}
