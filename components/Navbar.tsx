"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Literature", href: "/literature" },
  { label: "Committee", href: "/committee" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-leo-gray/10 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3" aria-label="KVLC Home">
          <img
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-md bg-leo-blue/10 object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "block";
            }}
          />
          <span className="hidden text-xl font-bold text-leo-blue">KVLC</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-leo-gray transition-colors relative hover:text-leo-blue after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-leo-blue after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sign In Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="/sign-in"
            className="inline-flex items-center px-5 py-2 text-sm font-semibold text-leo-gray bg-leo-yellow rounded-lg transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-leo-yellow/30"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-leo-gray hover:bg-leo-gray/10 focus:outline-none focus:ring-2 focus:ring-leo-blue"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-leo-gray/10 bg-white px-4 py-4 animate-slide-down">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-leo-gray rounded-lg transition-colors hover:bg-leo-blue/5 hover:text-leo-blue"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="mt-2 mx-3 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-leo-gray bg-leo-yellow rounded-lg transition-all hover:bg-yellow-300"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}