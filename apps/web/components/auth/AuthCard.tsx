import Link from "next/link";
import type { ReactNode } from "react";
import { FESTIVAL_YEAR } from "@/constants/festival";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-bg">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-gold">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
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

      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-h2 font-bold text-text">{title}</h1>
          {subtitle && (
            <p className="text-body text-text-muted">{subtitle}</p>
          )}
        </div>
        {children}
      </div>

      {footer && (
        <div className="mt-6 text-small text-text-muted">{footer}</div>
      )}
    </div>
  );
}
