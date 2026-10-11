"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type ImageModalProps = {
  // Local public path of the full resolution photo
  src: string;
  onClose: () => void;
};

export default function ImageModal({ src, onClose }: ImageModalProps) {
  // Close on Escape and lock page scroll while the modal is open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full size photo"
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Full resolution image — clicking it does not close the modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none absolute inset-0"
      >
        <Image
          src={src}
          alt="Committee photo, full size"
          fill
          sizes="100vw"
          className="pointer-events-auto cursor-zoom-out object-contain p-4"
          onClick={(event) => event.stopPropagation()}
          priority
        />
      </motion.div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
