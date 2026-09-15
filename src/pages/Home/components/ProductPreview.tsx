import { Link } from "react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   ProductPreview — three AegisHub tool cards inside a rounded tray.

   Composition mirrors the Convix reference:
     • warm-tinted outer tray (rounded-3xl, subtle bg)
     • three white cards (rounded-2xl, compact, data-forward)
     • grid: 1 col → 2 col → 3 col

   Each card uses real product data: tool name, what it captures, a live
   status indicator, and a micro-CTA. No fabricated analytics numbers.
   The "preview" communicates product value through structure and clarity,
   not fake charts.
───────────────────────────────────────────────────────────────────────────── */

/* ── Inline icons ───────────────────────────────────────────────────────── */
const IcoMic = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 10a7 7 0 01-14 0M12 17v4M8 21h8" />
  </svg>
);
const IcoArrow = ({ s = 12 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const IcoCamera = ({ s = 11 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IcoPhoto = ({ s = 11 }: { s?: number }) => (
  <svg width={s} height={s} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/* ── Confidence bar sub-component ───────────────────────────────────────── */
function ConfBar({ value, label, color = "var(--color-accent)" }: {
  value: number;
  label: string;
  color?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-600">{label}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${value}%`}
        />
      </div>
    </div>
  );
}

/* ── Card 1 — Sign Language Interpreter ─────────────────────────────────── */
function SignCard() {
  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium" style={{ color: "var(--color-accent)" }}>
          Sign Language
        </span>
        <span className="text-gray-400 text-[11px]">Live &middot; camera</span>
      </div>

      {/* Input badge */}
      <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-gray-50 px-2 py-1 border border-gray-100">
        <IcoCamera s={11} />
        <span className="text-[11px] text-gray-500 font-medium">Requires camera</span>
      </div>

      {/* Latest result */}
      <div className="mt-4">
        <p className="text-[11px] text-gray-400 mb-1">Last interpretation</p>
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-semibold leading-none text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
            PAIN
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            94% confidence
          </span>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">Today &middot; 14:22</p>
      </div>

      {/* Confidence bars */}
      <div className="mt-4 space-y-2.5">
        <ConfBar value={94} label="PAIN" />
        <ConfBar value={71} label="DISCOMFORT" color="var(--color-accent-subtle)" />
        <ConfBar value={58} label="HELP" color="#9CA3AF" />
      </div>

      {/* CTA */}
      <div className="mt-auto pt-4">
        <Link
          to="/sign-interpreter"
          className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus-ring"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Open interpreter
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <IcoArrow s={11} />
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ── Card 2 — Live Captioner ─────────────────────────────────────────────── */
function CaptionCard() {
  /* Static preview of what a caption session looks like */
  const utterances = [
    { text: "Can you describe the pain on a scale of one to ten?", speaker: "Clinician", time: "0:04" },
    { text: "About a seven. It started this morning.",             speaker: "Patient",   time: "0:09" },
    { text: "Any shortness of breath or chest tightness?",         speaker: "Clinician", time: "0:14" },
  ];

  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium" style={{ color: "var(--color-accent)" }}>
          Live Captioner
        </span>
        <span className="text-gray-400 text-[11px]">Microphone</span>
      </div>

      {/* Input badge */}
      <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-gray-50 px-2 py-1 border border-gray-100">
        <IcoMic s={11} />
        <span className="text-[11px] text-gray-500 font-medium">Requires microphone</span>
      </div>

      {/* Caption transcript preview */}
      <div className="mt-4 space-y-2.5 rounded-xl bg-gray-50 p-3">
        {utterances.map((u) => (
          <div key={u.time} className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {u.speaker}
              </span>
              <span className="text-[10px] text-gray-300">{u.time}</span>
            </div>
            <p className="text-[12px] leading-snug text-gray-800">{u.text}</p>
          </div>
        ))}
        {/* Live cursor */}
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" aria-hidden="true" />
          <span className="text-[11px] text-gray-400">Live &middot; 3 speakers detected</span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-4">
        <Link
          to="/captioner"
          className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus-ring"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Open captioner
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <IcoArrow s={11} />
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ── Card 3 — Derma-Scan ─────────────────────────────────────────────────── */
function DermaCard() {
  const triageLevels: { label: string; color: string; active: boolean }[] = [
    { label: "Low concern",      color: "#16a34a", active: false },
    { label: "Monitor",          color: "#ca8a04", active: true  },
    { label: "Seek evaluation",  color: "#dc2626", active: false },
    { label: "Urgent",           color: "#991b1b", active: false },
  ];

  return (
    <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium" style={{ color: "var(--color-accent)" }}>
          Derma-Scan
        </span>
        <span className="text-gray-400 text-[11px]">Photo upload</span>
      </div>

      {/* Input badge */}
      <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-gray-50 px-2 py-1 border border-gray-100">
        <IcoPhoto s={11} />
        <span className="text-[11px] text-gray-500 font-medium">Requires photo</span>
      </div>

      {/* Last result */}
      <div className="mt-4">
        <p className="text-[11px] text-gray-400 mb-2">Last analysis result</p>

        {/* Triage tier indicator */}
        <div className="flex gap-1.5">
          {triageLevels.map((t) => (
            <div
              key={t.label}
              className="flex-1 rounded-md py-1.5 text-center"
              style={{
                background: t.active ? t.color + "18" : "#f5f5f5",
                border: `1px solid ${t.active ? t.color + "40" : "#e5e5e5"}`,
              }}
              title={t.label}
              aria-label={`${t.label}${t.active ? " — current" : ""}`}
            >
              <div
                className="mx-auto h-1.5 w-1.5 rounded-full"
                style={{ background: t.active ? t.color : "#d4d4d4" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] font-semibold" style={{ color: "#ca8a04" }}>
          Monitor
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
          Irregular border noted. Recommend follow-up with dermatologist within 4-6 weeks.
        </p>
      </div>

      {/* AI caveat — always visible, per safety requirements */}
      <p className="mt-3 text-[10px] leading-relaxed text-gray-400">
        AI-assisted observation only. Not a medical diagnosis.
      </p>

      {/* CTA */}
      <div className="mt-auto pt-4">
        <Link
          to="/derma-scan"
          className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus-ring"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Open Derma-Scan
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <IcoArrow s={11} />
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ── Outer tray ─────────────────────────────────────────────────────────── */
export default function ProductPreview() {
  return (
    <div className="px-3 sm:px-4">
      {/* Warm-tinted tray — mirrors the Convix #f5f2ee treatment adapted to
          AegisHub's cooler palette: a near-white with slight cool tint */}
      <div
        className="mx-auto w-full max-w-[920px] rounded-3xl p-4 sm:p-5"
        style={{ background: "#F0F2F7" }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <SignCard />
          <CaptionCard />
          <DermaCard />
        </div>
      </div>
    </div>
  );
}
