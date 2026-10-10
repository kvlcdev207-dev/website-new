"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { writings, getWritingById, categoryLabels, categoryColors } from "@/data/literature";
import FadeIn from "@/components/FadeIn";

const EASE = [0.22, 1, 0.36, 1] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

const formatTimestamp = (iso: string) =>
  `${new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  })} UTC`;

const BackArrow = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default function LiteratureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const writing = getWritingById(id);

  const baseLikes = writing?.likes ?? 0;
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const likes = baseLikes + (liked ? 1 : 0);

  const [comments, setComments] = useState(() => writing?.comments ?? []);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const readingMinutes = useMemo(() => {
    if (!writing) return 1;
    const words = writing.fullContent.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [writing]);

  // Next two writings (wrapping around), excluding the current one
  const related = useMemo(() => {
    if (!writing) return [];
    const i = writings.findIndex((w) => w.id === writing.id);
    if (i === -1) return [];
    const picked = [1, 2].map((o) => writings[(i + o) % writings.length]).filter((w) => w.id !== writing.id);
    return picked.filter((w, idx) => picked.findIndex((x) => x.id === w.id) === idx);
  }, [writing]);

  const handleLike = () => {
    if (!liked) setBurst((b) => b + 1);
    setLiked((l) => !l);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 2200);
    } catch {
      prompt("Copy this link:", window.location.href);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    setComments((prev) => [
      {
        id: `c${Date.now()}`,
        author: commentAuthor.trim(),
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewComment("");
    setCommentAuthor("");
  };

  /* ------------------------------ Not found ------------------------------ */
  if (!writing) {
    return (
      <MotionConfig reducedMotion="user">
        <FadeIn>
          <section className="bg-leo-blue text-white">
            <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold md:text-4xl">Writing Not Found</h1>
              <p className="mx-auto mt-4 max-w-2xl text-white/90">
                The writing you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/literature"
                className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-leo-yellow px-6 py-3 text-base font-semibold text-leo-blue transition-shadow hover:shadow-xl hover:shadow-leo-yellow/30"
              >
                <BackArrow className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Literature
              </Link>
            </div>
          </section>
        </FadeIn>
      </MotionConfig>
    );
  }

  const isPoetry = writing.category === "poetry";

  return (
    <MotionConfig reducedMotion="user">
      {/* Hero */}
      <FadeIn>
        <section className="relative overflow-hidden bg-leo-blue text-white">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-leo-yellow/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Link href="/literature" className="group mb-8 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white">
              <BackArrow className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Literature
            </Link>

            <div>
              <span className="inline-flex rounded-full bg-white p-0.5">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[writing.category]}`}>
                  {categoryLabels[writing.category]}
                </span>
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{writing.title}</h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <span className="text-sm font-bold">{initials(writing.author)}</span>
                </div>
                <div>
                  <p className="font-medium">{writing.author}</p>
                  <p className="text-sm text-white/70">{writing.date}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {readingMinutes} min read
              </span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Article */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            className={`whitespace-pre-wrap text-lg leading-relaxed text-leo-gray sm:text-xl ${
              isPoetry ? "text-center font-serif leading-loose" : "sm:leading-9"
            }`}
          >
            {writing.fullContent}
          </motion.article>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-leo-gray/10 pt-8">
            <motion.button
              type="button"
              onClick={handleLike}
              whileTap={{ scale: 0.93 }}
              aria-label={liked ? "Unlike" : "Like"}
              aria-pressed={liked}
              className={`relative inline-flex items-center gap-2 rounded-lg px-5 py-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-red/50 ${
                liked
                  ? "bg-leo-red text-white shadow-lg shadow-leo-red/30"
                  : "bg-leo-gray/10 text-leo-gray hover:bg-leo-red/10 hover:text-leo-red"
              }`}
            >
              <AnimatePresence>
                {burst > 0 && liked && (
                  <motion.span
                    key={burst}
                    aria-hidden
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 rounded-lg bg-leo-red"
                  />
                )}
              </AnimatePresence>

              <motion.svg
                key={String(liked)}
                initial={liked ? { scale: 0.4 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className="relative h-5 w-5"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.14-1.14a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
              </motion.svg>

              <span className="relative inline-flex overflow-hidden tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={likes}
                    initial={{ y: liked ? 14 : -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: liked ? -14 : 14, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold"
                  >
                    {likes}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleShare}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 rounded-lg bg-leo-blue px-5 py-2.5 text-white transition-colors duration-300 hover:bg-leo-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              <span className="font-semibold">Share</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Toast */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex items-center gap-2 rounded-full bg-leo-gray px-5 py-3 text-sm font-medium text-white shadow-2xl"
            >
              <svg className="h-4 w-4 text-leo-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m5 13 4 4L19 7" />
              </svg>
              Link copied
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comments */}
      <section className="bg-leo-gray/5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-8 flex items-center gap-3 text-2xl font-bold text-leo-blue"
          >
            Comments
            <span className="rounded-full bg-leo-blue/10 px-2.5 py-0.5 text-sm tabular-nums">{comments.length}</span>
          </motion.h2>

          <motion.form
            onSubmit={handleCommentSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-10 rounded-2xl border border-leo-gray/10 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-4 font-bold text-leo-blue">Leave a comment</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="commentAuthor" className="mb-1 block text-sm font-medium text-leo-gray">
                  Name
                </label>
                <input
                  id="commentAuthor"
                  type="text"
                  required
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="block w-full rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray transition-colors placeholder:text-leo-gray/40 focus:border-leo-blue focus:outline-none focus:ring-2 focus:ring-leo-blue/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="commentText" className="mb-1 block text-sm font-medium text-leo-gray">
                  Comment
                </label>
                <textarea
                  id="commentText"
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="block w-full resize-y rounded-lg border border-leo-gray/30 bg-white px-4 py-2.5 text-leo-gray transition-colors placeholder:text-leo-gray/40 focus:border-leo-blue focus:outline-none focus:ring-2 focus:ring-leo-blue/20"
                  placeholder="Write your thoughts..."
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={!newComment.trim() || !commentAuthor.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 rounded-lg bg-leo-blue px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-leo-blue/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
            >
              Post Comment
            </motion.button>
          </motion.form>

          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.li
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: -16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-2xl border border-leo-gray/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leo-blue/10">
                      <span className="text-sm font-bold text-leo-blue">{initials(comment.author)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                        <p className="font-medium text-leo-gray">{comment.author}</p>
                        <p className="text-xs text-leo-gray/50">{formatTimestamp(comment.timestamp)}</p>
                      </div>
                      <p className="break-words text-leo-gray/90">{comment.text}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {comments.length === 0 && (
            <p className="py-8 text-center text-leo-gray/60">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>

      {/* Keep reading */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {related.length > 0 && (
            <>
              <h2 className="mb-6 text-xl font-bold text-leo-blue">Keep reading</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {related.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/literature/${w.id}`}
                      className="group flex h-full flex-col rounded-2xl border border-leo-gray/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-leo-blue/20 hover:shadow-xl hover:shadow-leo-blue/10"
                    >
                      <span className={`mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[w.category]}`}>
                        {categoryLabels[w.category]}
                      </span>
                      <h3 className="line-clamp-2 font-bold text-leo-blue">{w.title}</h3>
                      <p className="mt-2 flex-1 line-clamp-2 text-sm text-leo-gray/70">{w.excerpt}</p>
                      <p className="mt-4 flex items-center justify-between text-sm text-leo-gray/70">
                        {w.author}
                        <svg className="h-4 w-4 text-leo-blue transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/literature"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-leo-blue transition-colors hover:text-leo-blue/80"
            >
              <BackArrow className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to All Writings
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}