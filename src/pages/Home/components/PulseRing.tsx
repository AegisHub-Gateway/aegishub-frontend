/* ─────────────────────────────────────────────────────────────────────────────
   PulseRing — wraps any child element with two pulsing sonar rings.
   The child stays motionless; only the rings animate.
───────────────────────────────────────────────────────────────────────────── */

import type { ReactNode } from "react";

interface PulseRingProps {
  children: ReactNode;
  className?: string;
}

export default function PulseRing({ children, className = "" }: PulseRingProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <style>{`
        @keyframes pr-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-ring { animation: none !important; opacity: 0 !important; }
        }
      `}</style>

      {/* Pulse ring 1 */}
      <span
        className="pr-ring pointer-events-none absolute inset-0 rounded-full"
        style={{
          border: "1.5px solid rgba(113,113,122,0.55)",
          animation: "pr-pulse 2s cubic-bezier(0.16,1,0.3,1) infinite",
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      />
      {/* Pulse ring 2 — delayed 1s */}
      <span
        className="pr-ring pointer-events-none absolute inset-0 rounded-full"
        style={{
          border: "1.5px solid rgba(113,113,122,0.55)",
          animation: "pr-pulse 2s cubic-bezier(0.16,1,0.3,1) 1s infinite",
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}
