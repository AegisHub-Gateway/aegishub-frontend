import React from "react";
import { Link } from "react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   AegisHub Auth Layout
   Split-screen: form left, immersive imagery right.
   Matches the Finovate / Upmind visual language.
───────────────────────────────────────────────────────────────────────────── */

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Optional image URL — defaults to an Unsplash healthcare image */
  image?: string;
  /** Optional quote shown on the right panel */
  quote?: string;
  quoteAuthor?: string;
}

export default function AuthLayout({
  children,
  image = "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&q=85&fit=crop&auto=format",
  quote = "Health access, without barriers.",
  quoteAuthor = "AegisHub mission",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="flex min-h-screen">
        {/* ── Left: form ───────────────────────────────────────────── */}
        <div className="flex w-full flex-col overflow-y-auto lg:w-[480px] xl:w-[520px]" style={{ background: "var(--color-surface)" }}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-6">
            <Link to="/" className="flex items-center gap-2" aria-label="AegisHub home">
              <div className="flex h-7 w-7 items-center justify-center rounded" style={{ background: "var(--color-accent)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>AegisHub</span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </Link>
          </div>

          {/* Form area */}
          <div className="flex flex-1 flex-col justify-center px-8 pb-10 pt-4">
            {children}
          </div>

          {/* Bottom note */}
          <div className="px-8 py-5 border-t" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              AI-assisted tools only. Not a medical device. Output does not constitute a clinical diagnosis.
            </p>
          </div>
        </div>

        {/* ── Right: imagery ───────────────────────────────────────── */}
        <div className="relative hidden flex-1 overflow-hidden lg:flex">
          {/* Photo */}
          <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager" />
          {/* Overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 100%)" }} />
          {/* Teal bottom glow */}
          <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(0,156,122,0.25), transparent)" }} />

          {/* Quote */}
          <div className="relative z-10 flex flex-col justify-end p-14">
            {/* Shield icon */}
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(0,156,122,0.2)", border: "1px solid rgba(0,156,122,0.4)" }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>

            <blockquote>
              <p className="mb-4 font-bold text-white leading-tight" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,2.5vw,2rem)" }}>
                "{quote}"
              </p>
              {quoteAuthor && (
                <footer className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>— {quoteAuthor}</footer>
              )}
            </blockquote>

            {/* Trust signals */}
            <div className="mt-10 flex flex-wrap gap-4">
              {["Privacy-first", "No raw video sent", "WCAG-considered", "AI-assisted only"].map(t => (
                <span key={t} className="rounded-full border px-3 py-1 text-xs text-white/70" style={{ borderColor: "rgba(255,255,255,0.2)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
