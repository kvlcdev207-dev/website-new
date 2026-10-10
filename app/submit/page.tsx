"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import FadeIn from "@/components/FadeIn";

const categoryOptions = [
  { value: "poetry", label: "Poetry" },
  { value: "stories", label: "Stories" },
  { value: "blogs", label: "Blogs" },
];

const inputClasses =
  "block w-full rounded-lg border border-leo-gray/20 bg-white px-4 py-2.5 text-leo-gray transition-colors placeholder:text-leo-gray/40 focus:border-leo-blue focus:outline-none focus:ring-2 focus:ring-leo-blue/20";

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("poetry");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    kind: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/literature/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          author: session.user.name || "Anonymous",
          content: content.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({
          text: data.message || "Writing published!",
          kind: "success",
        });
        setTitle("");
        setCategory("poetry");
        setContent("");
        setMode("write");
        setTimeout(() => router.push("/literature"), 1200);
      } else {
        setMessage({ text: data.error || "Failed to publish writing.", kind: "error" });
      }
    } catch {
      setMessage({
        text: "Something went wrong. Please try again.",
        kind: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-leo-gray/5">
        <p className="text-leo-gray">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-leo-gray/5 px-4">
        <FadeIn className="w-full max-w-md">
          <div className="rounded-xl border border-leo-gray/20 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-leo-blue/10">
              <svg
                className="h-7 w-7 text-leo-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-leo-blue">
              Please sign in to submit your writing
            </h1>
            <p className="mt-3 text-sm text-leo-gray">
              Share your poems, stories, and blogs with the club community.
            </p>
            <button
              onClick={() => signIn("google")}
              className="mt-6 w-full rounded-lg bg-leo-yellow px-5 py-3 text-sm font-semibold text-leo-gray transition-shadow duration-300 hover:shadow-lg hover:shadow-leo-yellow/40"
            >
              Sign In with Google
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  const authorName = session.user.name || "Anonymous";

  return (
    <div className="min-h-screen bg-leo-gray/5">
      {/* Hero */}
      <FadeIn>
        <section className="relative overflow-hidden bg-leo-blue text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-leo-yellow/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">
              Submit Your Writing
            </h1>
            <p className="mt-3 text-white/90">
              Poems, stories, and blogs — in English or Nepali.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Form */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeIn>
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-leo-gray/20 bg-white p-6 shadow-lg sm:p-8"
            >
              {/* Posting as */}
              <div className="mb-6 flex items-center gap-3 rounded-lg bg-leo-blue/5 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leo-blue text-xs font-bold text-white">
                  {initials(authorName)}
                </div>
                <p className="text-sm text-leo-gray">
                  Posting as:{" "}
                  <span className="font-semibold text-leo-blue">{authorName}</span>
                </p>
              </div>

              {message && (
                <div
                  role="status"
                  className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
                    message.kind === "success"
                      ? "bg-leo-green/10 text-leo-green"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Title */}
              <div className="mb-6">
                <label
                  htmlFor="submit-title"
                  className="mb-1.5 block text-sm font-medium text-leo-gray"
                >
                  Title
                </label>
                <input
                  id="submit-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your writing a title"
                  className={inputClasses}
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label
                  htmlFor="submit-category"
                  className="mb-1.5 block text-sm font-medium text-leo-gray"
                >
                  Category
                </label>
                <select
                  id="submit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClasses}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content with Write / Preview toggle */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="submit-content"
                  className="text-sm font-medium text-leo-gray"
                >
                  Content
                </label>
                <div
                  role="tablist"
                  aria-label="Content mode"
                  className="inline-flex rounded-lg border border-leo-gray/20 bg-leo-gray/5 p-1"
                >
                  {(["write", "preview"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      role="tab"
                      aria-selected={mode === m}
                      onClick={() => setMode(m)}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                        mode === m
                          ? "bg-white text-leo-blue shadow-sm"
                          : "text-leo-gray hover:text-leo-blue"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "write" ? (
                <textarea
                  id="submit-content"
                  required
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing... Poetry, stories, and reflections — English or Nepali."
                  className="block min-h-[300px] w-full resize-y rounded-lg border border-leo-gray/20 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-leo-gray placeholder:text-leo-gray/40 focus:border-leo-blue focus:outline-none focus:ring-2 focus:ring-leo-blue/20"
                />
              ) : (
                <div className="min-h-[300px] rounded-lg border border-leo-gray/20 bg-leo-gray/5 px-5 py-4">
                  {content.trim() ? (
                    <div className="whitespace-pre-wrap text-lg leading-relaxed text-leo-gray">
                      {content}
                    </div>
                  ) : (
                    <p className="text-sm italic text-leo-gray/50">
                      Nothing to preview yet — start writing in the Write tab.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !content.trim()}
                  className="w-full rounded-lg bg-leo-blue px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-leo-blue/90 hover:shadow-lg hover:shadow-leo-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Publishing…" : "Publish Writing"}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
