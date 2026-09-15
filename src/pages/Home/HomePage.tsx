import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import HomeNav from "./components/HomeNav";
import ProductPreview from "./components/ProductPreview";
import HomeFooter from "./components/HomeFooter";
import BlurFadeIn from "./components/BlurFadeIn";
import Aurora from "./components/Aurora";
import PulseRing from "./components/PulseRing";

/* ─────────────────────────────────────────────────────────────────────────────
   AegisHub — Complete Homepage
   Structure:
     Hero (full-viewport rounded canvas)
       └─ HomeNav · HeroContent · ProductPreview (bleeds off bottom)
     Section 01 — Product Introduction
     Section 02 — Three Tools (capabilities)
     Section 03 — How It Works (4-step sequence)
     Section 04 — Split-Processing / Privacy
     Section 05 — Medical Safety (required)
     Section 06 — Final CTA
     HomeFooter
───────────────────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
   Apple-style blur + fade + translateY entrance.
   Uses IntersectionObserver for performance.
───────────────────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("scroll-revealed");
            observerRef.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observerRef.current?.observe(el);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(setupObserver, 80);
    return () => {
      clearTimeout(t);
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);
}

/* ── Shared primitives ───────────────────────────────────────────────────── */
const IcoChevronRight = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IcoCheck = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IcoShield = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────────── */
function HeroContent() {
  return (
    <div className="flex flex-col items-center px-4 pb-10 pt-10 text-center sm:pb-14 sm:pt-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.12] px-4 py-1.5 text-[13px] text-white/80 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-accent)" }} aria-hidden="true" />
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>
          AegisHub &middot; Health Accessibility Gateway
        </span>
      </span>

      <h1
        className="mt-5 max-w-4xl text-white sm:mt-6"
        style={{
          fontSize: "clamp(34px, 7.5vw, 70px)",
          lineHeight: 1.05,
          fontWeight: 600,
          letterSpacing: "-0.025em",
          fontFamily: "var(--font-heading)",
        }}
      >
        <BlurFadeIn
          text="Making healthcare"
          delay={0.3}
          stagger={0.08}
          loop
        />
        {" "}
        <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em" }}>
          <BlurFadeIn
            text="accessible"
            delay={0.6}
            stagger={0.1}
            loop
          />
        </span>
        <br />
        <BlurFadeIn
          text="for everyone."
          delay={0.9}
          stagger={0.08}
          loop
        />
      </h1>

      <p
        className="mt-4 max-w-xl px-2 text-white/60 sm:mt-5"
        style={{ fontSize: "clamp(14px, 3.2vw, 17px)", fontFamily: "var(--font-heading)", lineHeight: 1.65, fontWeight: 300 }}
      >
        Sign language interpretation, live clinical captions, and AI-assisted
        skin analysis — in one platform, with your data staying in your browser.
      </p>

      <div className="mt-7 sm:mt-8">
        <PulseRing>
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 rounded-full bg-[#009C7A] py-2.5 pl-7 pr-2 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#00B389] hover:shadow-lg hover:shadow-[#009C7A]/25 focus-ring sm:py-3 sm:pl-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get started free
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 sm:h-8 sm:w-8">
              <IcoChevronRight />
            </span>
          </Link>
        </PulseRing>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <Link to="/help" className="text-[13px] text-white/50 underline underline-offset-2 transition-colors hover:text-white/80 focus-ring rounded"
          style={{ fontFamily: "var(--font-heading)" }}>
          Safety information
        </Link>
        <span className="text-white/20" aria-hidden="true">&middot;</span>
        <Link to="/dashboard" className="text-[13px] text-white/50 underline underline-offset-2 transition-colors hover:text-white/80 focus-ring rounded"
          style={{ fontFamily: "var(--font-heading)" }}>
          Open dashboard
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 01 — Product Introduction
   Full-width editorial intro: left headline, right supporting copy + CTA.
   Mirrors the Convix "We Champion the Bold" section quality.
────────────────────────────────────────────────────────────────────────── */
function SectionIntro() {
  return (
    <section
      id="product"
      className="py-24 px-5 sm:px-8"
      style={{ background: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Left — headline */}
          <div className="scroll-reveal" data-delay="0">
            <p
              className="mb-5 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
            >
              What is AegisHub
            </p>
            <h2
              className="font-bold leading-tight text-gray-900"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                letterSpacing: "-0.025em",
                fontFamily: "var(--font-heading)",
                lineHeight: 1.1,
              }}
            >
              Three tools.<br />
              One{" "}
              <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400 }}>
                gateway.
              </span>
              <br />
              Zero raw data sent.
            </h2>
          </div>

          {/* Right — copy + points */}
          <div className="scroll-reveal" data-delay="80">
            <p
              className="mb-8 text-[15px] leading-relaxed text-gray-600"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
            >
              AegisHub is a healthcare accessibility platform built for the people
              who need it most — deaf and hard-of-hearing patients, sign language
              users, and clinicians communicating across barriers. Every tool
              processes data locally in your browser first.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Hand landmarks extracted in-browser — no video transmitted",
                "Audio frames processed per-utterance, not stored",
                "Skin images discarded server-side after analysis",
                "Confidence scores shown with every AI result",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                    aria-hidden="true"
                  >
                    <IcoCheck s={11} />
                  </span>
                  <span className="text-[14px] leading-snug text-gray-600" style={{ fontFamily: "var(--font-heading)" }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <PulseRing>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2.5 rounded-full bg-gray-900 py-2.5 pl-6 pr-2 text-[14px] font-medium text-white transition-all duration-200 hover:bg-gray-800 focus-ring"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Try AegisHub free
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <IcoChevronRight />
                </span>
              </Link>
            </PulseRing>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 02 — Three Tools (capabilities)
   Three cards with different visual weights — NOT identical boring SaaS cards.
   Card 1 is large/featured, cards 2+3 are standard.
────────────────────────────────────────────────────────────────────────── */

const IcoHand = ({ s = 24 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 11.5V6.5a1.5 1.5 0 013 0v3M10 9.5V5a1.5 1.5 0 013 0v4.5M13 8.5V6a1.5 1.5 0 013 0v5.5m0 0v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-2a1.5 1.5 0 013 0" />
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
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10M12 7v10" />
  </svg>
);

function SectionTools() {
  return (
    <section
      id="features"
      className="py-24 px-5 sm:px-8"
      style={{ background: "#F0F2F7" }}
    >
      <div className="mx-auto max-w-[1100px]">
        {/* Header */}
        <div className="mb-14 max-w-2xl scroll-reveal" data-delay="0">
          <p
            className="mb-4 text-[12px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
          >
            Platform tools
          </p>
          <h2
            className="font-bold leading-tight text-gray-900"
            style={{
              fontSize: "clamp(26px, 3.5vw, 42px)",
              letterSpacing: "-0.022em",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.12,
            }}
          >
            Every tool built for a{" "}
            <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400 }}>
              real clinical need.
            </span>
          </h2>
        </div>

        {/* Bento-style grid — large card left + two stacked right */}
        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">

          {/* Large featured card — Sign Language */}
          <article
            className="scroll-reveal flex flex-col rounded-3xl p-8 lg:col-span-2 lg:row-span-2"
            data-delay="0"
            style={{
              background: "#0D1014",
              minHeight: 380,
            }}
          >
            <div
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "rgba(0,156,122,0.25)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <IcoHand s={24} />
            </div>
            <p className="mb-1 text-[12px] font-medium text-white/40 uppercase tracking-wide"
              style={{ fontFamily: "var(--font-heading)" }}>
              Requires camera
            </p>
            <h3
              className="mb-3 font-semibold text-white leading-snug"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontFamily: "var(--font-heading)", letterSpacing: "-0.015em" }}
            >
              Sign Language Interpreter
            </h3>
            <p className="mb-8 text-[14px] leading-relaxed text-white/60 max-w-md"
              style={{ fontFamily: "var(--font-heading)" }}>
              Your camera captures hand movement. MediaPipe extracts 21 landmark
              coordinates per frame — entirely in-browser. Only those lightweight
              coordinates reach the LSTM model. Raw video never leaves your device.
            </p>
            <ul className="space-y-2 mb-auto">
              {["Real-time hand landmark extraction", "AI gloss classification with confidence", "Alternative interpretations shown", "Works in noisy clinical environments"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/60"
                  style={{ fontFamily: "var(--font-heading)" }}>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                    <IcoCheck s={9} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <PulseRing>
                <Link
                  to="/sign-interpreter"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#009C7A] py-2 pl-5 pr-2 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#00B389] focus-ring"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Open interpreter
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <IcoChevronRight s={12} />
                  </span>
                </Link>
              </PulseRing>
            </div>
          </article>

          {/* Card — Live Captioner */}
          <article
            className="scroll-reveal flex flex-col rounded-3xl p-7"
            data-delay="60"
            style={{ background: "#FFFFFF", border: "1px solid var(--color-border)" }}
          >
            <div
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <IcoMic s={22} />
            </div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500"
              style={{ fontFamily: "var(--font-heading)" }}>
              Requires microphone
            </p>
            <h3
              className="mb-2 font-semibold leading-snug text-gray-900"
              style={{ fontSize: "clamp(16px, 2vw, 20px)", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}
            >
              Live Captioner
            </h3>
            <p className="mb-auto text-[13px] leading-relaxed text-gray-600"
              style={{ fontFamily: "var(--font-heading)" }}>
              Real-time high-contrast captions for deaf and hard-of-hearing patients.
              Built for masked clinicians, noisy wards, and critical conversations.
            </p>
            <Link
              to="/captioner"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#009C7A] transition-colors hover:text-[#00846A] focus-ring rounded"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Open captioner <IcoChevronRight s={12} />
            </Link>
          </article>

          {/* Card — Derma-Scan */}
          <article
            className="scroll-reveal flex flex-col rounded-3xl p-7"
            data-delay="120"
            style={{ background: "#FFFFFF", border: "1px solid var(--color-border)" }}
          >
            <div
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <IcoScan s={22} />
            </div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500"
              style={{ fontFamily: "var(--font-heading)" }}>
              Requires photo upload
            </p>
            <h3
              className="mb-2 font-semibold leading-snug text-gray-900"
              style={{ fontSize: "clamp(16px, 2vw, 20px)", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}
            >
              Derma-Scan
            </h3>
            <p className="mb-auto text-[13px] leading-relaxed text-gray-600"
              style={{ fontFamily: "var(--font-heading)" }}>
              Upload a photo of a skin concern. One compressed image is sent,
              analysed, then discarded. Returns a plain-language triage observation,
              never a diagnosis.
            </p>
            <Link
              to="/derma-scan"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#009C7A] transition-colors hover:text-[#00846A] focus-ring rounded"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Open Derma-Scan <IcoChevronRight s={12} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 03 — How It Works (4-step sequence)
────────────────────────────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    n: "01",
    title: "Choose your tool",
    body: "Select the modality that fits the situation — signing, speech, or a photo. Each tool is independent and can be used without the others.",
  },
  {
    n: "02",
    title: "Grant access",
    body: "The browser requests only what it needs: camera, microphone, or a file. Nothing activates until you explicitly allow it.",
  },
  {
    n: "03",
    title: "Local processing",
    body: "Heavy computation runs in your browser. Hand coordinates, audio chunks, or a compressed image are prepared before anything is transmitted.",
  },
  {
    n: "04",
    title: "Read the result",
    body: "Plain-language output appears immediately. Interpreted sign, live caption, or a structured skin observation — with confidence shown where applicable.",
  },
] as const;

function SectionHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-5 sm:px-8"
      style={{ background: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-16 max-w-xl scroll-reveal" data-delay="0">
          <p
            className="mb-4 text-[12px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
          >
            How it works
          </p>
          <h2
            className="font-bold leading-tight text-gray-900"
            style={{
              fontSize: "clamp(26px, 3.5vw, 42px)",
              letterSpacing: "-0.022em",
              fontFamily: "var(--font-heading)",
              lineHeight: 1.12,
            }}
          >
            From input to result<br />in four steps.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_STEPS.map((step, i) => (
            <div key={step.n} className="relative scroll-reveal" data-delay={String(i * 60)}>
              {/* Connector line between steps — desktop */}
              {i < HOW_STEPS.length - 1 && (
                <div
                  className="absolute top-5 hidden h-px lg:block"
                  style={{
                    left: "calc(100% - 1rem)",
                    width: "calc(100% - 1rem)",
                    background: "var(--color-border)",
                  }}
                  aria-hidden="true"
                />
              )}
              <p
                className="mb-4 font-bold leading-none text-gray-200"
                style={{
                  fontSize: "2.5rem",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "-0.04em",
                }}
                aria-hidden="true"
              >
                {step.n}
              </p>
              <h3
                className="mb-2 font-semibold text-gray-900"
                style={{ fontSize: "15px", fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed text-gray-600"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 04 — Privacy & Split-Processing
   This is a real technical differentiator — earns its own section.
────────────────────────────────────────────────────────────────────────── */
const PRIVACY_ROWS = [
  {
    tool: "Sign Language",
    keeps: "Full video stream stays in browser",
    sends: "21 landmark coordinates (X, Y, Z) per frame",
    why: "The AI needs joint positions, not pixels. MediaPipe extracts them locally.",
  },
  {
    tool: "Live Captioner",
    keeps: "Continuous microphone feed stays local",
    sends: "Compressed audio chunks, per utterance",
    why: "Only the audio needed for the current sentence is transmitted, then discarded.",
  },
  {
    tool: "Derma-Scan",
    keeps: "Original high-resolution photo stays local",
    sends: "One compressed JPEG, discarded after analysis",
    why: "The image crosses the network once, is never stored, and is deleted post-analysis.",
  },
] as const;

function SectionPrivacy() {
  return (
    <section
      className="py-24 px-5 sm:px-8"
      style={{ background: "#F0F2F7" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          {/* Left — sticky-ish heading block */}
          <div className="lg:sticky lg:top-8 scroll-reveal" data-delay="0">
            <p
              className="mb-4 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
            >
              Privacy by design
            </p>
            <h2
              className="mb-5 font-bold leading-tight text-gray-900"
              style={{
                fontSize: "clamp(24px, 3vw, 38px)",
                letterSpacing: "-0.022em",
                fontFamily: "var(--font-heading)",
                lineHeight: 1.12,
              }}
            >
              Your raw data<br />
              <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400 }}>
                never leaves
              </span>
              <br />
              your browser.
            </h2>
            <p
              className="text-[14px] leading-relaxed text-gray-600"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              This is not a privacy promise added after the fact. It is the
              architecture. Heavy processing runs locally, and only the extracted
              result — coordinates, not video — crosses the network.
            </p>
          </div>

          {/* Right — per-tool rows */}
          <div
            className="scroll-reveal rounded-3xl overflow-hidden"
            data-delay="60"
            style={{ border: "1px solid var(--color-border)", background: "#FFFFFF" }}
          >
            {PRIVACY_ROWS.map((row, i) => (
              <div
                key={row.tool}
                className="p-7"
                style={{ borderBottom: i < PRIVACY_ROWS.length - 1 ? "1px solid var(--color-border)" : "none" }}
              >
                <p
                  className="mb-4 text-[13px] font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {row.tool}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ background: "#F0F1F5", color: "#8C90A0" }}
                      aria-label="Stays in browser"
                    >&#x2715;</span>
                    <div>
                      <p className="text-[11px] font-medium mb-0.5 text-gray-500" style={{ fontFamily: "var(--font-heading)" }}>
                        Stays in browser
                      </p>
                      <p className="text-[12px] text-gray-600" style={{ fontFamily: "var(--font-heading)" }}>
                        {row.keeps}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
                      aria-label="Sent to AI"
                    >&#x2713;</span>
                    <div>
                      <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--color-accent-text)", fontFamily: "var(--font-heading)" }}>
                        Sent to AI
                      </p>
                      <p className="text-[12px] text-gray-600" style={{ fontFamily: "var(--font-heading)" }}>
                        {row.sends}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-gray-500" style={{ fontFamily: "var(--font-heading)" }}>
                  <span className="font-medium text-gray-700">Why: </span>
                  {row.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 05 — Medical Safety
   Required by the brief — visible, plainly worded, not fine print.
────────────────────────────────────────────────────────────────────────── */
function SectionSafety() {
  return (
    <section
      id="safety"
      className="py-24 px-5 sm:px-8"
      style={{ background: "#FFFFFF" }}
      aria-labelledby="safety-heading"
    >
      <div className="mx-auto max-w-[1100px]">
        <div
          className="scroll-reveal rounded-3xl p-8 sm:p-12"
          style={{ background: "#F0F2F7", border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-start gap-5 mb-8">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              <IcoShield s={22} />
            </div>
            <div>
              <h2
                id="safety-heading"
                className="font-semibold mb-1 text-gray-900"
                style={{ fontSize: "18px", fontFamily: "var(--font-heading)" }}
              >
                These tools are assistive, not diagnostic.
              </h2>
              <p
                className="text-[13px] text-gray-500"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Read before using AegisHub in any clinical or health-related context.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Not a medical device",
                body: "AegisHub is a communication and accessibility tool. It does not diagnose conditions, prescribe treatment, or replace the judgment of a qualified healthcare professional.",
              },
              {
                title: "Results may be incorrect",
                body: "AI outputs — sign interpretations, captions, and skin observations — can be wrong. Confidence scores are displayed where available, but high confidence is not a guarantee of accuracy.",
              },
              {
                title: "Emergencies",
                body: "If you or someone else is experiencing a medical emergency, contact emergency services immediately. Do not rely on any AI tool for emergency communication.",
              },
            ].map((item) => (
              <div key={item.title}>
                <p
                  className="mb-2 text-[13px] font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[13px] leading-relaxed text-gray-600"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            <Link
              to="/help"
              className="text-[13px] font-medium text-[#009C7A] transition-colors hover:text-[#00846A] focus-ring rounded"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Read full safety documentation &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SECTION 06 — Final CTA
   Dark container, strong headline, primary + secondary CTAs.
   Mirrors the premium close-out quality from the Convix reference.
────────────────────────────────────────────────────────────────────────── */
function SectionFinalCTA() {
  return (
    <section
      className="py-8 px-5 sm:px-8 sm:pb-8"
      style={{ background: "#F0F2F7" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div
          className="scroll-reveal relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16"
          style={{ background: "#0D1014" }}
        >
          {/* Subtle teal glow */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,156,122,0.20) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <p
              className="mb-5 text-[12px] font-semibold uppercase tracking-wider text-white/40"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get started today
            </p>
            <h2
              className="mx-auto mb-5 max-w-2xl font-bold text-white leading-tight"
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                letterSpacing: "-0.025em",
                fontFamily: "var(--font-heading)",
                lineHeight: 1.1,
              }}
            >
              Healthcare communication<br />
              that{" "}
              <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400 }}>
                actually works.
              </span>
            </h2>
            <p
              className="mx-auto mb-10 max-w-md text-[14px] leading-relaxed text-white/50"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sign language, live captions, and skin triage — open the platform and
              start a session in under a minute.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <PulseRing>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-3 rounded-full bg-[#009C7A] py-2.5 pl-7 pr-2 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#00B389] hover:shadow-lg hover:shadow-[#009C7A]/25 focus-ring"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Create free account
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <IcoChevronRight />
                  </span>
                </Link>
              </PulseRing>
              <PulseRing>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-[14px] font-medium text-white/80 transition-all duration-200 hover:border-white/40 hover:text-white focus-ring"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Open dashboard
                </Link>
              </PulseRing>
            </div>

            <p
              className="mt-8 text-[12px] text-white/30"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              AI-assisted only &middot; Not a medical device &middot; Free for demonstration purposes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   PAGE COMPOSITION
────────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <PageMeta
        title="AegisHub — Health Accessibility Gateway"
        description="Sign language interpretation, live captioning, and AI-assisted skin analysis. Three tools, one platform, your data stays in your browser."
      />

      {/* Outer wrapper — light neutral page background */}
      <main
        className="min-h-screen w-full"
        style={{ background: "#F0F2F7", fontFamily: "var(--font-heading)" }}
      >
        {/* ── HERO — rounded full-viewport canvas ─── */}
        <div className="p-3 sm:p-4">
          <section
            className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl"
            style={{ height: "calc(100vh - 24px)" }}
            aria-label="AegisHub hero"
          >
            <Aurora />
            <div className="absolute inset-0 bg-white/[0.03]" aria-hidden="true" />
            <div className="relative z-10">
              <HomeNav />
              <HeroContent />
              <ProductPreview />
            </div>
          </section>
        </div>

        {/* ── BELOW-FOLD SECTIONS ─── */}
        <SectionIntro />
        <SectionTools />
        <SectionHowItWorks />
        <SectionPrivacy />
        <SectionSafety />
        <SectionFinalCTA />
        <HomeFooter />
      </main>
    </>
  );
}
