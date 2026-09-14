import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useTheme } from "../../context/ThemeContext";
import { useScrollReveal } from "../../lib/hooks/useScrollReveal";

/* ─────────────────────────────────────────────────────────────────────────────
   AegisHub Homepage — Rebuilt
   Design decisions:
   • Hero is the three-tool selection: the structural argument of the product
     presented first, not buried. Each panel states tool, input required, and
     who it's for before the visitor clicks anything.
   • One orchestrated motion moment: hero panels stagger in on first load.
     Scroll reveals used only where sequence matters (how-it-works steps).
   • No ALL-CAPS eyebrow labels. No decorative arrows on every CTA.
   • Numbers 01/02/03/04 used in how-it-works because that content IS a
     sequence — not as decoration.
   • Stats removed (were fabricated numbers that undermine trust).
   • Testimonial removed (fabricated quote undermines the trust it claims to build).
   • Medical disclaimer gets its own visible section, not just a footer note.
───────────────────────────────────────────────────────────────────────────── */

/* ── SVG icons ───────────────────────────────────────────────────────────── */
const IcoHand = ({ s = 24 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V6.5a1.5 1.5 0 013 0v3M10 9.5V5a1.5 1.5 0 013 0v4.5M13 8.5V6a1.5 1.5 0 013 0v5.5m0 0v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-2a1.5 1.5 0 013 0" />
  </svg>
);
const IcoMic = ({ s = 24 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 01-14 0M12 17v4M8 21h8" />
  </svg>
);
const IcoScan = ({ s = 24 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10M12 7v10" />
  </svg>
);
const IcoShield = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IcoCamera = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IcoPhoto = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IcoChevronDown = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const IcoArrowRight = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IcoMoon = ({ s = 17 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const IcoSun = ({ s = 17 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

/* ── Navbar ───────────────────────────────────────────────────────────────── */
function Navbar({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Track scroll for background reveal */
  useState(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  });

  const toolLinks = [
    { label: "Sign Language", href: "/sign-interpreter" },
    { label: "Captioner",     href: "/captioner" },
    { label: "Derma-Scan",    href: "/derma-scan" },
  ];

  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 transition-all"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--color-surface) 90%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid transparent",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-6 lg:px-10">
        {/* Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-ring rounded"
          aria-label="AegisHub — home"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--color-accent)" }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
          >
            AegisHub
          </span>
        </Link>

        {/* Desktop nav — tool links + disclaimer */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {toolLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="nav-link text-sm font-medium focus-ring rounded"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
          {/* Persistent disclaimer link — required for medical context */}
          <a
            href="#safety"
            className="nav-link text-sm font-medium focus-ring rounded"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            Safety info
          </a>
        </nav>

        {/* Right: theme toggle + auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg focus-ring transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}
          >
            {theme === "dark" ? <IcoSun /> : <IcoMoon />}
          </button>

          <Link
            to="/signin"
            className="hidden text-sm font-medium focus-ring rounded px-1 transition-colors lg:block"
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-heading)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold focus-ring transition-colors lg:block"
            style={{ background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-heading)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent)"; }}
          >
            Get started
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg focus-ring lg:hidden"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className="overflow-hidden transition-all lg:hidden"
        style={{
          maxHeight: mobileOpen ? "420px" : "0",
          background: "var(--color-surface)",
          borderTop: mobileOpen ? "1px solid var(--color-border)" : "none",
          transitionDuration: "280ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation" className="px-6 py-5 space-y-1">
          {toolLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium focus-ring transition-colors"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#safety"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium focus-ring transition-colors"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            Safety info
          </a>
          <div className="pt-3 flex gap-2">
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-lg border py-2.5 text-center text-sm font-medium focus-ring"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", fontFamily: "var(--font-heading)" }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-lg py-2.5 text-center text-sm font-semibold focus-ring"
              style={{ background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-heading)" }}
            >
              Get started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ── Hero: three-panel tool selection ───────────────────────────────────── */
/*
   The hero IS the tool selection. Three panels, immediately visible,
   each stating what it does, who it's for, and what it needs from the user.
   This is both design and an accessibility/consent requirement.

   Entrance: panels stagger in with translateY(24px)→0 + opacity 0→1.
   The unifying statement enters first (40ms head start), then panels
   at 80ms intervals. Uses CSS classes so prefers-reduced-motion collapses
   the animation automatically (see globals.css).
*/
const TOOL_PANELS = [
  {
    id:          "sign",
    icon:        <IcoHand s={28} />,
    inputIcon:   <IcoCamera s={13} />,
    inputLabel:  "Requires camera",
    title:       "Sign Language Interpreter",
    who:         "For sign language users and healthcare providers",
    description: "Hold a sign in front of your camera. The browser extracts hand landmark coordinates locally and sends only those to the AI — your video never leaves your device. Results appear as plain text.",
    cta:         "Open interpreter",
    path:        "/sign-interpreter",
    delay:       1,
  },
  {
    id:          "caption",
    icon:        <IcoMic s={28} />,
    inputIcon:   <IcoMic s={13} />,
    inputLabel:  "Requires microphone",
    title:       "Live Captioner",
    who:         "For deaf and hard-of-hearing patients in clinical settings",
    description: "Spoken words are transcribed in real time with high-contrast captions. Designed for noisy environments, masked clinicians, and situations where speech cannot otherwise be heard.",
    cta:         "Open captioner",
    path:        "/captioner",
    delay:       2,
  },
  {
    id:          "derma",
    icon:        <IcoScan s={28} />,
    inputIcon:   <IcoPhoto s={13} />,
    inputLabel:  "Requires a photo",
    title:       "Derma-Scan",
    who:         "For anyone with a skin concern to discuss with a clinician",
    description: "Upload a photo of a skin concern. A compressed image is sent to the AI backend, which returns a plain-language summary of what's visible — not a diagnosis, but a structured starting point.",
    cta:         "Open Derma-Scan",
    path:        "/derma-scan",
    delay:       3,
  },
] as const;

function Hero() {
  return (
    <section
      aria-label="AegisHub tools"
      className="pt-28 pb-20 px-6 lg:px-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-site">
        {/* Unifying statement */}
        <div className="hero-statement mb-12 max-w-2xl">
          <p
            className="mb-3 text-sm font-medium"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            GatewayHacks 2026 — Track 1: Accessibility &amp; Health
          </p>
          <h1
            className="mb-5 font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.025em",
              color: "var(--color-text-primary)",
            }}
          >
            Three tools. One gateway.<br />
            Healthcare communication that works.
          </h1>
          <p
            className="text-lg leading-relaxed max-w-xl"
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
          >
            AegisHub brings sign language interpretation, live captioning, and AI-assisted skin analysis into one platform. Choose the tool that fits your situation.
          </p>
        </div>

        {/* Three-panel grid */}
        <div className="grid gap-px bg-border md:grid-cols-3 rounded-xl overflow-hidden" role="list" aria-label="Available tools">
          {TOOL_PANELS.map((panel) => (
            <article
              key={panel.id}
              role="listitem"
              className={`hero-panel hero-panel-${panel.delay} flex flex-col bg-surface p-8`}
              style={{ background: "var(--color-surface)" }}
            >
              {/* Icon */}
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "var(--color-accent-light)",
                  color: "var(--color-accent)",
                }}
                aria-hidden="true"
              >
                {panel.icon}
              </div>

              {/* Input requirement — stated before the CTA (consent/accessibility) */}
              <div
                className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{
                  background: "var(--color-surface-subtle)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {panel.inputIcon}
                <span className="text-xs font-medium" style={{ fontFamily: "var(--font-heading)" }}>
                  {panel.inputLabel}
                </span>
              </div>

              {/* Title + audience */}
              <h2
                className="mb-1.5 text-lg font-semibold leading-snug"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
              >
                {panel.title}
              </h2>
              <p
                className="mb-4 text-xs font-medium"
                style={{ color: "var(--color-accent-text)", fontFamily: "var(--font-heading)" }}
              >
                {panel.who}
              </p>

              {/* Description */}
              <p
                className="mb-8 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
              >
                {panel.description}
              </p>

              {/* CTA — full-width at bottom of panel */}
              <Link
                to={panel.path}
                className="cta-button inline-flex items-center justify-between gap-2 rounded-lg px-5 py-3 text-sm font-semibold focus-ring"
                style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                  fontFamily: "var(--font-heading)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent)"; }}
              >
                {panel.cta}
                <IcoArrowRight s={14} />
              </Link>
            </article>
          ))}
        </div>

        {/* Below-panel trust line */}
        <p
          className="mt-6 text-xs text-center"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}
        >
          AI-assisted tools. Not a substitute for medical advice. See{" "}
          <a
            href="#safety"
            className="underline underline-offset-2 focus-ring rounded"
            style={{ color: "var(--color-text-muted)" }}
          >
            safety information
          </a>{" "}
          before use.
        </p>
      </div>
    </section>
  );
}

/* ── Split-processing explainer ─────────────────────────────────────────── */
/*
   This is the real technical differentiator: the browser never sends raw
   video/audio. Only extracted coordinates, meshes, or a compressed image
   cross the network. This earns trust; it gets a real section.
*/
const PROCESSING_POINTS = [
  {
    tool:   "Sign Language",
    input:  "Camera video",
    keeps:  "Full video stream",
    sends:  "21 hand landmark coordinates (X, Y, Z) per frame",
    why:    "MediaPipe extracts joint positions in the browser. The AI needs coordinates, not pixels.",
  },
  {
    tool:   "Live Captioner",
    input:  "Microphone audio",
    keeps:  "Full audio recording",
    sends:  "Compressed audio chunks to a speech-to-text service",
    why:    "Audio is processed in near-real time; only the audio frames needed for the current utterance are transmitted.",
  },
  {
    tool:   "Derma-Scan",
    input:  "Photo upload",
    keeps:  "Original high-resolution image",
    sends:  "One compressed JPEG, then discarded server-side after analysis",
    why:    "The image needs to reach the model, but only once — it is not stored or retained.",
  },
] as const;

function SplitProcessing() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="processing-heading"
      className="py-24 px-6 lg:px-10"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-site">
        {/* Section header */}
        <div className="mb-16 max-w-2xl">
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            How the data flows
          </p>
          <h2
            id="processing-heading"
            className="mb-5 font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Your raw data stays in your browser.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
          >
            Every AegisHub tool follows the same principle: heavy processing happens locally in your browser, and only the lightweight result of that processing — coordinates, not video — is sent to the AI. This is not a privacy promise bolted on after the fact; it is the architecture.
          </p>
        </div>

        {/* Per-tool breakdown */}
        <div className="space-y-px rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          {PROCESSING_POINTS.map((p, i) => (
            <div
              key={p.tool}
              data-reveal="rr-fade-up"
              data-delay={`rr-delay-${i + 1}`}
              className="grid gap-6 p-8 md:grid-cols-3"
              style={{
                background: "var(--color-surface)",
                borderBottom: i < PROCESSING_POINTS.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              {/* Tool label */}
              <div>
                <p
                  className="mb-1 text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
                >
                  {p.tool}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}
                >
                  Input: {p.input}
                </p>
              </div>

              {/* What stays vs what's sent */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ background: "var(--color-surface-subtle)", color: "var(--color-text-muted)" }}
                    aria-label="Stays in browser"
                  >
                    ✕
                  </span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}>Stays in browser</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>{p.keeps}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                    aria-label="Sent to AI"
                  >
                    ✓
                  </span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-accent-text)", fontFamily: "var(--font-heading)" }}>Sent to AI</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>{p.sends}</p>
                  </div>
                </div>
              </div>

              {/* Why */}
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}>Why</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>{p.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works: four steps ────────────────────────────────────────────── */
/*
   Numbers 01–04 are used here because this IS a sequence. The content
   earns the numbering — it is not decorative chrome.
*/
const HOW_STEPS = [
  {
    n:     "01",
    title: "Choose your tool",
    body:  "Select the modality that fits the situation: signing, speech, or a photo of a skin concern.",
  },
  {
    n:     "02",
    title: "Grant access",
    body:  "The browser asks for camera, microphone, or file access. Nothing is activated until you say so.",
  },
  {
    n:     "03",
    title: "Processing happens locally",
    body:  "Hand coordinates, audio chunks, or a compressed image are prepared in your browser. Heavy data never leaves your device.",
  },
  {
    n:     "04",
    title: "Read the result",
    body:  "Plain-language output appears immediately — interpreted sign, live caption, or a structured skin observation. Confidence is shown where it applies.",
  },
] as const;

function HowItWorks() {
  return (
    <section
      aria-labelledby="steps-heading"
      className="py-24 px-6 lg:px-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-site">
        <div className="mb-14 max-w-xl">
          <p
            className="mb-4 text-sm font-medium"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            From input to result
          </p>
          <h2
            id="steps-heading"
            className="font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Four steps, end to end.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((s, i) => (
            <div
              key={s.n}
              data-reveal="rr-fade-up"
              data-delay={`rr-delay-${i + 1}`}
              className="relative"
            >
              {/* Connector line between steps (desktop only) */}
              {i < HOW_STEPS.length - 1 && (
                <div
                  className="absolute top-4 hidden h-px lg:block"
                  style={{
                    width: "calc(100% - 2.5rem)",
                    left: "calc(100% - 1.25rem)",
                    background: "var(--color-border)",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Step number */}
              <p
                className="mb-4 text-3xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-border-strong)",
                  letterSpacing: "-0.03em",
                }}
                aria-hidden="true"
              >
                {s.n}
              </p>

              <p
                className="mb-2 text-base font-semibold"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
              >
                {s.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Medical safety disclaimer — its own section ─────────────────────────── */
/*
   Brief requirement: "visible, plainly worded, not hidden in fine print."
   This gets the same visual weight as any other content section.
   Using role="note" and aria-labelledby so screen readers announce it clearly.
*/
function SafetySection() {
  return (
    <section
      id="safety"
      aria-labelledby="safety-heading"
      role="note"
      className="py-20 px-6 lg:px-10"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="mx-auto max-w-site">
        <div className="rounded-xl p-8 md:p-12" style={{ border: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
          <div className="mb-6 flex items-start gap-4">
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <IcoShield s={20} />
            </div>
            <div>
              <h2
                id="safety-heading"
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
              >
                These tools are assistive, not diagnostic.
              </h2>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
              >
                Read before using AegisHub in any clinical or health-related context.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                heading: "Not a medical device",
                body: "AegisHub is a communication and accessibility tool. It does not diagnose conditions, prescribe treatment, or replace the clinical judgment of a qualified healthcare professional.",
              },
              {
                heading: "Results may be incorrect",
                body: "AI outputs — sign interpretations, captions, and skin observations — can be wrong. Confidence scores are shown where available, but a high confidence score is not a guarantee of accuracy.",
              },
              {
                heading: "Emergencies",
                body: "If you or someone else is experiencing a medical emergency, contact emergency services immediately. Do not rely on any AI tool for emergency communication.",
              },
            ].map((item) => (
              <div key={item.heading}>
                <p
                  className="mb-2 text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
                >
                  {item.heading}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Does AegisHub send raw video to its servers?",
    a: "No. The camera is used locally in your browser to extract hand landmark coordinates. Only those lightweight coordinates — never raw video frames — are sent to the AI backend for classification.",
  },
  {
    q: "Is the Derma-Scan output a medical diagnosis?",
    a: "No. Derma-Scan provides an AI-assisted observation to support — not replace — professional medical assessment. It is a structured starting point for a conversation with a clinician, not a diagnosis. Always consult a qualified healthcare provider.",
  },
  {
    q: "How accurate is the sign language interpretation?",
    a: "Accuracy depends on sign clarity, lighting, and camera quality. A confidence score is shown with every result so clinicians and patients can assess reliability before acting on it.",
  },
  {
    q: "What browsers and devices does AegisHub support?",
    a: "AegisHub is built on standard browser APIs (MediaDevices, WebGL). It works on modern Chrome, Edge, Firefox, and Safari on desktop and mobile. Camera and microphone features require a secure context (HTTPS or localhost).",
  },
  {
    q: "Is AegisHub free?",
    a: "The platform is free to use. It was built for GatewayHacks 2026 and is openly accessible for demonstration and accessibility research purposes.",
  },
  {
    q: "What happens to my data?",
    a: "Raw camera video and audio are never stored or transmitted. Extracted data (coordinates, audio chunks) is used only for real-time inference and is not retained. Uploaded Derma-Scan images are discarded after analysis.",
  },
] as const;

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 px-6 lg:px-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-site">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          {/* Left: heading + link to help */}
          <div>
            <p
              className="mb-4 text-sm font-medium"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
            >
              Common questions
            </p>
            <h2
              id="faq-heading"
              className="mb-5 font-bold leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
              }}
            >
              What you should know before you use this.
            </h2>
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
            >
              More detailed information — including accessibility statements, privacy details, and technical limitations — is on the Help page.
            </p>
            <Link
              to="/help"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold focus-ring"
              style={{ background: "var(--color-accent)", color: "#fff", fontFamily: "var(--font-heading)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent)"; }}
            >
              Help &amp; documentation
            </Link>
          </div>

          {/* Right: accordion */}
          <div data-reveal="rr-fade-up">
            {FAQS.map((f, i) => (
              <div key={f.q} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 py-5 text-left focus-ring rounded"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="mt-0.5 shrink-0 transition-transform duration-200"
                    style={{
                      color: "var(--color-text-muted)",
                      transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    aria-hidden="true"
                  >
                    <IcoChevronDown />
                  </span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: open === i ? "240px" : "0" }}
                  aria-hidden={open !== i}
                >
                  <p
                    className="pb-5 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                  >
                    {f.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  const TOOL_LINKS = [
    { label: "Sign Language Interpreter", to: "/sign-interpreter" },
    { label: "Live Captioner",            to: "/captioner" },
    { label: "Derma-Scan",               to: "/derma-scan" },
    { label: "Dashboard",                to: "/dashboard" },
  ];
  const INFO_LINKS = [
    { label: "Safety information",  to: "/help",     anchor: "#safety" },
    { label: "Help & documentation", to: "/help",    anchor: "" },
    { label: "Privacy details",     to: "/help",     anchor: "" },
    { label: "Accessibility",       to: "/help",     anchor: "" },
  ];
  const ACCOUNT_LINKS = [
    { label: "Sign in",    to: "/signin" },
    { label: "Sign up",    to: "/signup" },
    { label: "Settings",   to: "/settings" },
    { label: "History",    to: "/history" },
  ];

  return (
    <footer
      role="contentinfo"
      style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="mx-auto max-w-site px-6 py-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2.5 focus-ring rounded w-fit">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "var(--color-accent)" }}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
              >
                AegisHub
              </span>
            </Link>
            <p
              className="mb-4 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
            >
              A health accessibility gateway combining sign language interpretation, live captioning, and AI-assisted skin analysis.
            </p>
            {/* Disclaimer link repeated in footer — required by brief */}
            <a
              href="#safety"
              className="text-xs underline underline-offset-2 focus-ring rounded"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
            >
              Medical disclaimer
            </a>
          </div>

          {/* Tools */}
          <div>
            <p
              className="mb-4 text-xs font-semibold"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
            >
              Tools
            </p>
            <ul className="space-y-2.5">
              {TOOL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm focus-ring rounded transition-colors"
                    style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & info */}
          <div>
            <p
              className="mb-4 text-xs font-semibold"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
            >
              Safety &amp; info
            </p>
            <ul className="space-y-2.5">
              {INFO_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to + l.anchor}
                    className="text-sm focus-ring rounded transition-colors"
                    style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p
              className="mb-4 text-xs font-semibold"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
            >
              Account
            </p>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm focus-ring rounded transition-colors"
                    style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 flex flex-col gap-2 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}
          >
            © {new Date().getFullYear()} AegisHub. Built for GatewayHacks 2026 — Track 1: Accessibility &amp; Health.
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-body)" }}
          >
            AI-assisted tools only — not a medical device or diagnostic service.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Page composition ────────────────────────────────────────────────────── */
export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  /* useScrollReveal observes [data-reveal] elements — used in SplitProcessing,
     HowItWorks, and FAQ sections only. Not applied to hero (CSS animation). */
  const pageRef = useScrollReveal("-60px 0px");

  return (
    <>
      <PageMeta
        title="AegisHub — Health Accessibility Gateway"
        description="Sign language interpretation, live captioning, and AI-assisted skin analysis. Three tools, one platform, your data stays in your browser."
      />
      <div
        ref={pageRef as React.RefObject<HTMLDivElement>}
        style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
      >
        <Navbar theme={theme} onToggle={toggleTheme} />
        <main>
          <Hero />
          <SplitProcessing />
          <HowItWorks />
          <SafetySection />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
