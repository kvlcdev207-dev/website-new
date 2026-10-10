"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Work", href: "/our-work" },
  { label: "Literature", href: "/literature" },
  { label: "Committee", href: "/committee" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const menuVariants: Variants = {
  closed: { height: 0, opacity: 0 },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: EASE, when: "beforeChildren", staggerChildren: 0.06 },
  },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease: EASE } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: -12 },
  open: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

function MenuIcon({ open }: { open: boolean }) {
  // Three bars that morph into an X
  const bar = "absolute left-0 h-0.5 w-full rounded-full bg-current";
  return (
    <span className="relative block h-4 w-5" aria-hidden>
      <motion.span
        className={bar}
        style={{ top: 0 }}
        animate={open ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      />
      <motion.span
        className={bar}
        style={{ top: 7 }}
        animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className={bar}
        style={{ top: 14 }}
        animate={open ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      />
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const pathname = usePathname();

  // Scroll state + reading-progress bar
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Close the mobile menu on navigation or Escape
  useEffect(() => {
    const handleRouteChange = () => setMenuOpen(false);
    handleRouteChange();
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
          scrolled || menuOpen
            ? "border-leo-gray/10 bg-white/85 shadow-md shadow-leo-gray/5 backdrop-blur-lg"
            : "border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <Link href="/" className="group flex items-center gap-3" aria-label="KVLC Home">
            {logoFailed ? (
              <span className="text-xl font-bold text-leo-blue">KVLC</span>
            ) : (
              <motion.img
                src="/logo.png"
                alt=""
                width={36}
                height={36}
                whileHover={{ rotate: -6, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="h-9 w-9 rounded-md bg-leo-blue/10 object-cover"
                onError={() => setLogoFailed(true)}
              />
            )}
          </Link>

          {/* Desktop navigation */}
          <nav
            className="relative hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(link.href)}
                  onFocus={() => setHovered(link.href)}
                  onBlur={() => setHovered(null)}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/40 ${
                    active ? "text-leo-blue" : "text-leo-gray hover:text-leo-blue"
                  }`}
                >
                  {/* Hover pill that glides between links */}
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 -z-10 rounded-lg bg-leo-blue/5"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                  {/* Active underline that slides to the current page */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-leo-blue"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign In (desktop) */}
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link
                href="/sign-in"
                className="group relative inline-flex items-center overflow-hidden rounded-lg bg-leo-yellow px-5 py-2 text-sm font-semibold text-leo-gray shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-leo-yellow/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue/50"
              >
                <span className="relative z-10">Sign In</span>
                {/* Shine sweep */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-full -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[200%]"
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-leo-gray transition-colors duration-300 hover:bg-leo-gray/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leo-blue md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon open={menuOpen} />
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="overflow-hidden border-t border-leo-gray/10 md:hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-300 ${
                          active
                            ? "bg-leo-blue/10 text-leo-blue"
                            : "text-leo-gray hover:bg-leo-blue/5 hover:text-leo-blue"
                        }`}
                      >
                        {link.label}
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-leo-blue" />}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div variants={itemVariants} className="mt-2 px-3">
                  <Link
                    href="/sign-in"
                    className="flex w-full items-center justify-center rounded-lg bg-leo-yellow px-5 py-3 text-sm font-semibold text-leo-gray transition-shadow duration-300 hover:shadow-lg hover:shadow-leo-yellow/30 active:scale-[0.98]"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll progress bar */}
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-leo-blue via-leo-yellow to-leo-green"
        />
      </motion.header>
    </MotionConfig>
  );
}