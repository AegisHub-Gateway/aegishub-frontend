import { Link } from "react-router";
import { cn } from "../../lib/utils/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   ModalityCard
   Used on the dashboard to present each tool as an entry point.

   Design notes:
   - All colours use CSS tokens — no hardcoded Tailwind gray-* or brand-*
     shades. This ensures the card renders correctly in both light and dark
     mode without per-class dark: overrides.
   - Hover: 1px translateY + shadow step up. No scale, no bounce.
   - Status dot: aria-hidden; status text is visible to screen readers via
     the adjacent <span>.
   - Badge: positioned top-right, teal-tinted, token-based.
   - CTA button uses .cta-button for press state (defined in globals.css).
───────────────────────────────────────────────────────────────────────────── */

interface ModalityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaPath: string;
  /** What the tool needs from the user — stated before the CTA for consent. */
  requires?: string;
  status?: "ready" | "active" | "unavailable";
  badge?: string;
  className?: string;
}

const STATUS_CONFIG = {
  ready:       { color: "var(--color-success)",        label: "Ready" },
  active:      { color: "var(--color-accent)",         label: "Active" },
  unavailable: { color: "var(--color-border-strong)",  label: "Unavailable" },
} as const;

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function ModalityCard({
  icon,
  title,
  description,
  ctaLabel,
  ctaPath,
  requires,
  status = "ready",
  badge,
  className,
}: ModalityCardProps) {
  const s = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl p-6 transition-all duration-200",
        className
      )}
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Badge — e.g. "New", "Beta" */}
      {badge && (
        <span
          className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: "var(--color-accent-light)",
            color: "var(--color-accent-text)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: "var(--color-accent-light)",
          color: "var(--color-accent)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="mb-1.5 text-base font-semibold leading-snug"
        style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>

      {/* Input requirement — stated before description and CTA */}
      {requires && (
        <p
          className="mb-3 text-xs font-medium"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
        >
          Requires {requires}
        </p>
      )}

      {/* Description */}
      <p
        className="mb-6 flex-1 text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
      >
        {description}
      </p>

      {/* Footer: CTA + status */}
      <div className="flex items-center justify-between">
        <Link
          to={ctaPath}
          className="cta-button inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold focus-ring"
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            fontFamily: "var(--font-heading)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-accent)"; }}
        >
          {ctaLabel}
          <ArrowIcon />
        </Link>

        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: s.color }}
            aria-hidden="true"
          />
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
          >
            {s.label}
          </span>
        </div>
      </div>
    </div>
  );
}
