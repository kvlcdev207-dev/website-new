"use client";

import { useState } from "react";
import Link from "next/link";

// Navigation links. Pages are built in later phases, so these paths are
// placeholders for now (they show a 404 until their page exists).
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Literature", href: "/literature" },
  { label: "Committee", href: "/committee" },
];

export default function Navbar() {
  // Tracks whether the mobile menu is open (only used on small screens)
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-leo-purple shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Club name — clicking it goes home */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-leo-gold">KVLC</span>
          <span className="hidden text-sm text-white sm:inline">
            Kathmandu Valley Leo Club
          </span>
        </Link>

        {/* Desktop links — hidden on small screens */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white transition-colors hover:text-leo-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sign-in"
            className="rounded-md bg-leo-gold px-4 py-2 font-semibold text-leo-purple transition-colors hover:bg-white"
          >
            Sign In
          </Link>
        </nav>

        {/* Hamburger button — visible only on small screens */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          className="text-white md:hidden"
        >
          {menuOpen ? (
            // Close (X) icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — only rendered when open, only on small screens */}
      {menuOpen && (
        <nav className="border-t border-white/20 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-white hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-md bg-leo-gold px-3 py-2 text-center font-semibold text-leo-purple"
            >
              Sign In
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
