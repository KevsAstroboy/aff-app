"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { FESTIVAL_YEAR } from "@/constants/festival";

const NAV_LINKS = [
  { label: "Programme", href: "/programme" },
  { label: "Awards", href: "/awards" },
  { label: "Masterclass", href: "/masterclass" },
  { label: "Communauté", href: "/feed" },
];

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-bg/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="7" opacity="0.4" />
              <circle cx="12" cy="12" r="10" opacity="0.2" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-eyebrow text-gold tracking-[0.2em]">AFF</div>
            <div className="text-small text-text-muted">{FESTIVAL_YEAR}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-small text-text-muted hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-small font-medium text-text-muted hover:text-text px-3 h-10 inline-flex items-center transition-colors"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center h-10 px-5 rounded-md bg-gold text-bg font-semibold hover:bg-gold-hover transition-colors"
          >
            S&apos;inscrire
          </Link>
        </div>

        <button
          className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-md text-text-muted hover:bg-surface-hover"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-bg border-t border-border">
          <div className="px-6 py-6 space-y-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block text-body text-text-muted hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-border">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <Link
                href="/login"
                className="h-11 inline-flex items-center justify-center rounded-md border border-border text-text"
                onClick={() => setOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="h-11 inline-flex items-center justify-center rounded-md bg-gold text-bg font-semibold"
                onClick={() => setOpen(false)}
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
