"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

const Icon = ({ children, filled = false }: { children: ReactNode; filled?: boolean }) => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com/kvlc",
    icon: (
      <Icon filled>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.058 24 12.073z" />
      </Icon>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/kvlc",
    icon: (
      <Icon filled>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.163-6.162-6.163zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </Icon>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/kvlc",
    icon: (
      <Icon filled>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </Icon>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@kvlc",
    icon: (
      <Icon filled>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136c.506-1.872.506-5.815.506-5.815s0-3.93-.506-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </Icon>
    ),
  },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Literature", href: "/literature" },
  { label: "Committee", href: "/committee" },
];

const contactInfo = [
  {
    label: "Email",
    value: "info@kvlc.org.np",
    href: "mailto:info@kvlc.org.np",
    icon: (
      <Icon>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </Icon>
    ),
  },
  {
    label: "Phone",
    value: "+977-1-4XXXXXXX",
    href: "tel:+97714XXXXXXX",
    icon: (
      <Icon>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </Icon>
    ),
  },
  {
    label: "Address",
    value: "Prithvi Narayan Campus, Pokhara, Nepal",
    icon: (
      <Icon>
        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </Icon>
    ),
  },
];

const leoValues = ["Leadership", "Experience", "Opportunity", "Service"];

/* -------------------------------------------------------------------------- */
/*  Animation                                                                 */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <footer className="relative overflow-hidden bg-leo-gray text-white" role="contentinfo">
        {/* Accent line + soft background glows */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-leo-blue via-leo-yellow to-leo-green" />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-leo-yellow/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-leo-blue/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8"
          >
            {/* About */}
            <motion.div variants={columnVariants} className="lg:col-span-4">
              <Link href="/" className="mb-5 inline-flex items-center gap-3" aria-label="KVLC Home">
                {logoFailed ? (
                  <span className="text-2xl font-bold text-leo-yellow">KVLC</span>
                ) : (
                  <img
                    src="/logo.png"
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-lg bg-white/10 object-cover ring-1 ring-white/10"
                    onError={() => setLogoFailed(true)}
                  />
                )}
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">
                Kathmandu Valley Leo Club — students of the campus serving our community through
                Leadership, Experience, Opportunity &amp; Service.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {leoValues.map((value) => (
                  <li
                    key={value}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={columnVariants} className="lg:col-span-2 lg:col-start-6">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-leo-yellow">Quick Links</h3>
              <nav className="flex flex-col gap-3" aria-label="Quick links">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex w-fit items-center text-sm text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    <span className="mr-0 h-px w-0 bg-leo-yellow transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>

            {/* Contact */}
            <motion.div variants={columnVariants} className="lg:col-span-3">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-leo-yellow">Contact</h3>
              <address className="flex flex-col gap-4 not-italic">
                {contactInfo.map((item) => {
                  const content = (
                    <>
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-leo-yellow ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-leo-yellow group-hover:text-leo-gray">
                        {item.icon}
                      </span>
                      <span className="text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white">
                        <span className="block text-xs uppercase tracking-wide text-white/40">{item.label}</span>
                        {item.value}
                      </span>
                    </>
                  );
                  return item.href ? (
                    <a key={item.label} href={item.href} className="group flex items-start gap-3">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label} className="group flex items-start gap-3">
                      {content}
                    </div>
                  );
                })}
              </address>
            </motion.div>

            {/* Social */}
            <motion.div variants={columnVariants} className="lg:col-span-2">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-leo-yellow">Follow Us</h3>
              <ul className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors duration-300 hover:bg-leo-yellow hover:text-leo-gray focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-yellow"
                    >
                      {social.icon}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row"
          >
            <div className="flex flex-col items-center gap-1 text-center text-sm text-white/50 md:items-start md:text-left">
              <p>Copyright © Kathmandu Valley Leo Club - Leo Year 2026/27</p>
              <p>
                Designed and developed by Nischhal Shrestha (Tech Lead, 083 Committee). All rights reserved.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 transition-colors duration-300 hover:bg-leo-yellow hover:text-leo-gray focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-yellow"
            >
              Back to top
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </footer>
    </MotionConfig>
  );
}