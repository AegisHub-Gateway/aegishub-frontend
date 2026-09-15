import { Link } from "react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   HomeFooter — complete footer for the AegisHub marketing homepage.
   Dark background, high contrast, premium feel.
───────────────────────────────────────────────────────────────────────────── */

function AegisIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 shrink-0"
      role="img" aria-label="AegisHub logo mark">
      <rect width="32" height="32" rx="8.421" fill="#465FFF" />
      <rect x="8.424" y="6.737" width="3.368" height="18.526" rx="1.684" fill="white" />
      <rect x="14.742" y="13.473" width="3.368" height="11.789" rx="1.684" fill="white" fillOpacity="0.9" />
      <rect x="21.055" y="9.262" width="3.368" height="15" rx="1.684" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Sign Language Interpreter", to: "/sign-interpreter" },
      { label: "Live Captioner",            to: "/captioner"        },
      { label: "Derma-Scan",               to: "/derma-scan"       },
      { label: "Dashboard",                to: "/dashboard"        },
    ],
  },
  {
    heading: "Features",
    links: [
      { label: "Real-time processing", to: "/sign-interpreter" },
      { label: "Clinical captions",    to: "/captioner"        },
      { label: "AI skin analysis",     to: "/derma-scan"       },
      { label: "Privacy by design",    to: "/help"             },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help & Docs",     to: "/help"     },
      { label: "Safety info",     to: "/help"     },
      { label: "Privacy details", to: "/help"     },
      { label: "History",         to: "/history"  },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in",    to: "/signin"        },
      { label: "Settings",   to: "/settings"      },
    ],
  },
];

export default function HomeFooter() {
  return (
    <footer className="bg-[#0D1014]">
      <div className="mx-auto max-w-[1100px] px-5 pt-16 pb-8 sm:px-8">
        {/* Top row */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <AegisIcon />
              <span
                className="text-[16px] font-semibold text-white"
                style={{ letterSpacing: "-0.01em" }}
              >
                AegisHub
              </span>
            </Link>
            <p
              className="text-[13px] leading-relaxed max-w-[240px] text-gray-400"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A health accessibility gateway combining sign language interpretation,
              live captioning, and AI-assisted skin analysis.
            </p>
            <p
              className="mt-4 text-[11px] leading-relaxed max-w-[240px] text-gray-500"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              AI-assisted tools only — not a medical device or diagnostic service.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13px] text-gray-400 transition-colors duration-150 hover:text-white"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-start sm:gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-100 focus-ring sm:inline-flex"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Create account
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 focus-ring sm:inline-flex"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Open dashboard
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-gray-500" style={{ fontFamily: "var(--font-heading)" }}>
            &copy; {new Date().getFullYear()} AegisHub. Built for GatewayHacks 2026 — Track 1: Accessibility &amp; Health.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/help"
              className="text-[12px] text-gray-500 transition-colors hover:text-gray-300"
            >
              Privacy
            </Link>
            <Link
              to="/help"
              className="text-[12px] text-gray-500 transition-colors hover:text-gray-300"
            >
              Safety disclaimer
            </Link>
            <Link
              to="/help"
              className="text-[12px] text-gray-500 transition-colors hover:text-gray-300"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
