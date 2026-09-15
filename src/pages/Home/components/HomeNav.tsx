import { useState } from "react";
import { Link } from "react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   HomeNav — floating pill navbar for the AegisHub marketing homepage.

   Layout:
     [Logo + wordmark]  [tool links · middle]  [Sign in · Get started · ☰]

   Collapses to hamburger at < md. Mobile dropdown is an extension of the
   pill — same white surface, same border radius vocabulary.
───────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS: { label: string; to: string; muted?: boolean }[] = [
  { label: "Sign Language", to: "/sign-interpreter" },
  { label: "Captioner",     to: "/captioner"        },
  { label: "Derma-Scan",   to: "/derma-scan"       },
  { label: "Safety info",  to: "/help", muted: true },
];

/* Inline SVG icons — no icon-lib dependency */
const IcoChevronRight = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IcoMenu = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);
const IcoClose = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* AegisHub logo mark — the blue shield icon from the existing logo.svg,
   reproduced as an inline component so it renders without an <img> request. */
function AegisIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}
      role="img" aria-label="AegisHub logo mark">
      <rect width="32" height="32" rx="8.421" fill="#465FFF" />
      {/* Three vertical bars (white, descending heights) */}
      <rect x="8.424" y="6.737" width="3.368" height="18.526" rx="1.684" fill="white" />
      <rect x="14.742" y="13.473" width="3.368" height="11.789" rx="1.684" fill="white" fillOpacity="0.9" />
      <rect x="21.055" y="9.262" width="3.368" height="15" rx="1.684" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

export default function HomeNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-center px-3 pt-4 sm:px-4 sm:pt-6">
      <nav
        className="relative flex w-full max-w-[760px] items-center rounded-full border border-gray-200 bg-white py-2 pl-2 pr-2 shadow-sm"
        aria-label="Main navigation"
      >
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 pl-1.5 focus-ring rounded-full"
          aria-label="AegisHub home"
        >
          <AegisIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          <span
            className="hidden text-[14px] font-semibold text-gray-900 sm:block"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}
          >
            AegisHub
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────────────────────────── */}
        <div className="hidden items-center gap-1 pl-6 text-[13.5px] md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-3 py-1.5 font-medium transition-colors duration-150 focus-ring hover:bg-gray-100"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className={link.muted ? "text-gray-500 hover:text-gray-900" : "text-gray-600 hover:text-gray-900"}>
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Right cluster ─────────────────────────────────────────────── */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Sign in — desktop only */}
          <Link
            to="/signin"
            className="hidden rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 focus-ring md:inline-flex"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Sign in
          </Link>

          {/* Get started CTA — pill with trailing circle, teal accent on hover */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-[13px] font-medium text-white focus-ring sm:text-[14px]"
            style={{
              fontFamily: "var(--font-heading)",
              background: "#009C7A",
              transition: "background-color 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s cubic-bezier(0.22,1,0.36,1), transform 0.15s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "#00B389";
              el.style.boxShadow = "0 4px 16px rgba(0,156,122,0.35)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "#009C7A";
              el.style.boxShadow = "none";
              el.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(0.975)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
          >
            <span className="hidden sm:inline">Get started</span>
            <span className="sm:hidden">Start</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <IcoChevronRight />
            </span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="inline-flex rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-ring md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IcoClose /> : <IcoMenu />}
          </button>
        </div>

        {/* ── Mobile dropdown ───────────────────────────────────────────── */}
        {open && (
          <div
            className="absolute left-2 right-2 top-full z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg md:hidden"
            role="menu"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="menuitem"
                className="flex items-center rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-ring"
                style={{ fontFamily: "var(--font-heading)" }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Auth links in mobile */}
            <div className="mt-2 flex gap-2 border-t border-gray-100 pt-2">
              <Link
                to="/signin"
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-center text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-ring"
                style={{ fontFamily: "var(--font-heading)" }}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90 focus-ring"
                style={{ fontFamily: "var(--font-heading)", background: "#009C7A" }}
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
