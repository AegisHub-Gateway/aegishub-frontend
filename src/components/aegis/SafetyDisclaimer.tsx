import { cn } from "../../lib/utils/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   SafetyDisclaimer
   Reusable disclaimer block for tool pages and the homepage safety section.

   Props:
   - compact   : single-line pill variant (for inline use inside tool UIs)
   - type      : which disclaimer text to show
   - className : additional classes for layout/spacing from parent

   Design notes:
   - All colours reference CSS tokens — no hardcoded Tailwind gray-* shades.
   - The non-compact variant uses role="note" + aria-label so screen readers
     announce it without requiring the user to navigate to it manually.
   - The icon is aria-hidden; the text carries all meaning.
───────────────────────────────────────────────────────────────────────────── */

interface SafetyDisclaimerProps {
  compact?: boolean;
  className?: string;
  type?: "general" | "derma" | "sign" | "caption";
}

const MESSAGES: Record<NonNullable<SafetyDisclaimerProps["type"]>, string> = {
  general:
    "AegisHub provides AI-assisted information only. Output is not a confirmed diagnosis and does not replace assessment by a qualified healthcare professional. For emergencies, contact emergency services immediately.",
  derma:
    "This analysis is AI-assisted and informational only. It is not a confirmed medical diagnosis. Observations may vary based on image quality and other factors. Always consult a qualified dermatologist or healthcare provider for a proper assessment.",
  sign:
    "Sign interpretation results are AI-generated and may not be fully accurate. Always verify critical medical information directly with the person or through additional means.",
  caption:
    "Live captions are AI-generated and may contain errors. Always verify critical medical information through direct communication.",
};

const ShieldIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export default function SafetyDisclaimer({
  compact = false,
  className,
  type = "general",
}: SafetyDisclaimerProps) {
  const message = MESSAGES[type];

  /* ── Compact variant ─────────────────────────────────────────────────── */
  /*
     Inline pill: used inside tool pages alongside a result or upload area.
     Small, unobtrusive, but present and readable.
  */
  if (compact) {
    return (
      <div
        className={cn("flex items-start gap-2 rounded-lg p-3", className)}
        style={{
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-subtle)",
        }}
        role="note"
        aria-label="Safety information"
      >
        <span
          className="mt-0.5 shrink-0"
          style={{ color: "var(--color-text-muted)" }}
          aria-hidden="true"
        >
          <ShieldIcon />
        </span>
        <p
          className="text-xs leading-relaxed"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {message}
        </p>
      </div>
    );
  }

  /* ── Full variant ────────────────────────────────────────────────────── */
  /*
     Section-level block: used when the disclaimer warrants its own
     visual weight — e.g. directly below a result on the DermaScan page.
  */
  return (
    <div
      className={cn("rounded-xl p-5", className)}
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-subtle)",
      }}
      role="note"
      aria-label="Safety disclaimer"
    >
      <div className="flex items-start gap-3">
        {/* Icon container */}
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
          aria-hidden="true"
        >
          <ShieldIcon />
        </div>

        <div>
          {/* Label — plain-case, not ALL-CAPS */}
          <p
            className="mb-1 text-xs font-semibold"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.01em",
            }}
          >
            AI-assisted · not medical advice
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
