"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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

interface Writing {
  _id: string;
  id: string;
  category: "poetry" | "stories" | "blogs";
  title: string;
  author: string;
  excerpt: string;
  date: string;
  fullContent: string;
  likes: number;
  likedBy?: string[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  timestamp?: string;
}

const categoryLabels: Record<string, string> = {
  poetry: "Poetry",
  stories: "Short Stories",
  blogs: "Blogs & Essays",
};

const categoryColors = {
  poetry: "bg-leo-blue/10 text-leo-blue",
  stories: "bg-leo-green/10 text-leo-green",
  blogs: "bg-leo-yellow/10 text-leo-yellow",
};




export default function LiteratureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);
  const [burst, setBurst] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // Fetch literature on mount
  useEffect(() => {
    async function fetchWriting() {
      try {
        const res = await fetch(`/api/literature/${id}`);
        if (res.ok) {
          const data = await res.json();
          setWriting(data);
          setComments(data.comments || []);
        } else {
          console.error("Failed to fetch literature");
        }
      } catch (error) {
        console.error("Failed to fetch literature:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWriting();
  }, [id]);

  const readingMinutes = useMemo(() => {
    if (!writing) return 1;
    const words = writing.fullContent?.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.round(words / 200));
  }, [writing]);

  const handleLike = async () => {
    if (!session) {
      alert("Please sign in to like");
      return;
    }
    const userEmail = session.user.email;
    const alreadyLiked = Boolean(userEmail && writing?.likedBy?.includes(userEmail));
    if (!alreadyLiked) setBurst((b) => b + 1);
    try {
      const res = await fetch(`/api/literature/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", email: userEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        setWriting((prev) =>
          prev
            ? {
                ...prev,
                likes: data.likes ?? prev.likes,
                likedBy: data.likedBy ?? prev.likedBy,
              }
            : prev
        );
      } else {
        console.error("Failed to like");
      }
    } catch (error) {
      console.error("Failed to like:", error);
    }
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newComment.trim()) return;

    try {
      const res = await fetch(`/api/literature/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          data: { text: newComment.trim(), author: session.user.name || "Anonymous" },
        }),
      });

      const data = await res.json();

      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment");
    }
  };

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

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

  // The signed-in user has liked this piece if their email is in likedBy
  const userEmail = session?.user?.email;
  const isLiked = Boolean(userEmail && writing.likedBy?.includes(userEmail));

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
              aria-label={isLiked ? "Unlike" : "Like"}
              aria-pressed={isLiked}
              className="relative inline-flex items-center gap-2 rounded-lg bg-leo-gray/10 px-5 py-2.5 transition-colors duration-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              <AnimatePresence>
                {burst > 0 && isLiked && (
                  <motion.span
                    key={burst}
                    aria-hidden
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 1.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 rounded-lg bg-red-500"
                  />
                )}
              </AnimatePresence>

              <motion.svg
                key={String(isLiked)}
                initial={isLiked ? { scale: 0.4 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className={`relative h-5 w-5 ${
                  isLiked ? "fill-current text-red-500" : "text-gray-400"
                }`}
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
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
                    key={writing.likes}
                    initial={{ y: isLiked ? 14 : -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: isLiked ? -14 : 14, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold"
                  >
                    {writing.likes}
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
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51 15.49 6.49M15.49 6.49 18.5 9.5M18.5 9.5 15.5 12.5M8.5 13.51 11.5 10.5M11.5 10.5 8.5 13.51" />
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

          {session ? (
            <motion.form
              onSubmit={handleCommentSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-10 rounded-2xl border border-leo-gray/10 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 font-bold text-leo-blue">Leave a comment</h3>
              <p className="mb-4 text-sm text-leo-gray">
                Posting as {session.user.name}
              </p>
              <div className="space-y-4">
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
                disabled={!newComment.trim()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 rounded-lg bg-leo-blue px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-leo-blue/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
              >
                Post Comment
              </motion.button>
            </motion.form>
          ) : (
            <p className="mb-10 rounded-2xl border border-leo-gray/10 bg-white p-6 text-sm text-leo-gray">
              Please sign in to leave a comment.
            </p>
          )}

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
                        <p className="text-xs text-leo-gray/50">{formatTimestamp(comment.timestamp || comment.date)}</p>
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
          <h2 className="mb-6 text-xl font-bold text-leo-blue">Keep reading</h2>
          <p className="text-center text-leo-gray">More literature coming soon...</p>
        </div>
      </section>
    </MotionConfig>
  );
}