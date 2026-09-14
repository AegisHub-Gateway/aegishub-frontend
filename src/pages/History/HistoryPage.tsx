import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useModal } from "../../hooks/useModal";

/* ─────────────────────────────────────────────────────────────────────────────
   History — DESIGN.md v1.0
   Clean activity list grouped by date. Not a data table.
───────────────────────────────────────────────────────────────────────────── */

type SessionType = "sign" | "caption" | "derma";
type FilterId   = "all" | SessionType;

/* ── Icons ──────────────────────────────────────────────────────────────── */
const IconHand = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V6.5a1.5 1.5 0 013 0v3M10 9.5V5a1.5 1.5 0 013 0v4.5M13 8.5V6a1.5 1.5 0 013 0v5.5m0 0v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-2a1.5 1.5 0 013 0" />
  </svg>
);
const IconMic = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 01-14 0M12 17v4M8 21h8" />
  </svg>
);
const IconScan = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M3 12h18" />
  </svg>
);
const TYPE_ICON: Record<SessionType, React.ReactNode> = {
  sign:    <IconHand />,
  caption: <IconMic  />,
  derma:   <IconScan />,
};

interface HistoryItem {
  id: string;
  type: SessionType;
  label: string;
  meta: string;
  date: string;
  time: string;
  status: "complete" | "error" | "cancelled";
  detail: Record<string, unknown>;
}

const DATA: HistoryItem[] = [
  { id: "h1", type: "sign",    label: "Sign Interpretation", meta: "PAIN · 94%",              date: "Today",      time: "14:22", status: "complete",  detail: { gloss: "PAIN",  confidence: 0.94, alternatives: ["DISCOMFORT", "ACHE"], frames: 28 } },
  { id: "h2", type: "caption", label: "Live Caption",        meta: "4m 12s",                   date: "Today",      time: "11:04", status: "complete",  detail: { duration: "4m 12s", utterances: ["I need help with my medication", "Can you explain the side effects", "When should I take this"] } },
  { id: "h3", type: "derma",   label: "Derma-Scan",          meta: "Monitor",                  date: "Yesterday",  time: "16:45", status: "complete",  detail: { triage: "Monitor", observations: ["Localised visible discoloration", "Mild surface irritation"], plain_language: "The image shows a localised skin change. Consider monitoring and seek evaluation if it changes.", skin_tone_caveat: true } },
  { id: "h4", type: "sign",    label: "Sign Interpretation", meta: "HELP · 91%",               date: "Yesterday",  time: "09:12", status: "complete",  detail: { gloss: "HELP",  confidence: 0.91, alternatives: ["ASSIST", "SUPPORT"], frames: 31 } },
  { id: "h5", type: "caption", label: "Live Caption",        meta: "8m 45s",                   date: "2 days ago", time: "15:30", status: "complete",  detail: { duration: "8m 45s", utterances: ["My chest feels tight", "Is this normal after surgery", "I need to speak with a doctor", "How long will recovery take"] } },
  { id: "h6", type: "derma",   label: "Derma-Scan",          meta: "Low Concern",              date: "2 days ago", time: "10:15", status: "complete",  detail: { triage: "Low Concern", observations: ["Small raised lesion", "Even coloration"], plain_language: "Continue to monitor for changes.", skin_tone_caveat: false } },
  { id: "h7", type: "sign",    label: "Sign Interpretation", meta: "Session cancelled",         date: "3 days ago", time: "16:00", status: "cancelled", detail: { reason: "No hand detected during session." } },
];

const TYPE_LABEL: Record<SessionType, string> = { sign: "Sign", caption: "Caption", derma: "Derma" };

const STATUS_COLOR: Record<HistoryItem["status"], string> = {
  complete:  "var(--color-success)",
  error:     "var(--color-error)",
  cancelled: "var(--color-text-muted)",
};

/* Group items by date */
function groupByDate(items: HistoryItem[]): [string, HistoryItem[]][] {
  const map = new Map<string, HistoryItem[]>();
  for (const item of items) {
    if (!map.has(item.date)) map.set(item.date, []);
    map.get(item.date)!.push(item);
  }
  return Array.from(map.entries());
}

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",     label: "All" },
  { id: "sign",    label: "Sign" },
  { id: "caption", label: "Caption" },
  { id: "derma",   label: "Derma" },
];

/* Detail modal */
function DetailModal({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  const d = item.detail;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail: ${item.label}`}
    >
      <div
        className="relative w-full max-w-md rounded-xl p-6 animate-slide-up"
        style={{ backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-xl)", border: "1px solid var(--color-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }} aria-hidden="true">
                {TYPE_ICON[item.type]}
              </span>
              <span className="text-label-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>{TYPE_LABEL[item.type]}</span>
            </div>
            <p className="text-heading-sm" style={{ color: "var(--color-text-primary)" }}>{item.label}</p>
            <p className="text-label-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>{item.date} · {item.time}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Close"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {item.type === "sign" && (
            <>
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                <p className="text-label-sm mb-0.5" style={{ color: "var(--color-text-muted)" }}>Sign</p>
                <p className="text-display-md" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>{d.gloss as string}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                  <p className="text-label-sm mb-0.5" style={{ color: "var(--color-text-muted)" }}>Confidence</p>
                  <p className="text-heading-md font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>
                    {Math.round((d.confidence as number) * 100)}%
                  </p>
                </div>
                <div className="flex-1 rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                  <p className="text-label-sm mb-0.5" style={{ color: "var(--color-text-muted)" }}>Frames</p>
                  <p className="text-heading-md font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>{d.frames as number}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(d.alternatives as string[]).map((a) => (
                  <span key={a} className="rounded-full border px-3 py-1 text-label-sm" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>{a}</span>
                ))}
              </div>
            </>
          )}
          {item.type === "caption" && (
            <>
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                <p className="text-label-sm mb-0.5" style={{ color: "var(--color-text-muted)" }}>Duration</p>
                <p className="text-heading-md font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>{d.duration as string}</p>
              </div>
              <div>
                <p className="text-label-sm mb-2 font-medium" style={{ color: "var(--color-text-secondary)" }}>Transcript</p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                  {(d.utterances as string[]).map((u, i) => (
                    <p key={i} className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                      <span className="text-label-sm mr-2" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>{String(i + 1).padStart(2, "0")}</span>
                      {u}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          {item.type === "derma" && (
            <>
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                <p className="text-label-sm mb-0.5" style={{ color: "var(--color-text-muted)" }}>Triage</p>
                <p className="text-heading-sm font-bold" style={{ color: "var(--color-text-primary)" }}>{d.triage as string}</p>
              </div>
              <ul className="space-y-1.5">
                {(d.observations as string[]).map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--color-text-muted)" }} aria-hidden="true" />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>{d.plain_language as string}</p>
              {d.skin_tone_caveat && (
                <p className="text-body-sm italic" style={{ color: "var(--color-text-muted)" }}>Note: model performance may vary across skin tones.</p>
              )}
            </>
          )}
        </div>

        <p className="mt-5 text-label-sm" style={{ color: "var(--color-text-muted)" }}>
          Demo data only — not a medical record.
        </p>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<HistoryItem | null>(null);
  const modal = useModal();

  const filtered = filter === "all" ? DATA : DATA.filter((d) => d.type === filter);
  const grouped  = groupByDate(filtered);

  return (
    <>
      <PageMeta title="History — AegisHub" description="Your past sign, caption, and scan sessions." />

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>Activity History</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Your past interpretation, captioning, and scan sessions.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by session type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="rounded-full border px-4 py-1.5 text-label-sm font-medium transition-colors duration-150"
              style={{
                borderColor: filter === f.id ? "var(--color-accent)" : "var(--color-border)",
                backgroundColor: filter === f.id ? "var(--color-accent-light)" : "transparent",
                color: filter === f.id ? "var(--color-accent-text)" : "var(--color-text-secondary)",
              }}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <p className="text-body-sm py-12 text-center" style={{ color: "var(--color-text-muted)" }}>
            No sessions found.
          </p>
        ) : (
          <div className="space-y-6">
            {grouped.map(([date, items]) => (
              <div key={date}>
                <p className="text-label-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
                  {date}
                </p>
                <div
                  className="rounded-lg border divide-y"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
                >
                  {items.map((item) => (
                    <button
                      key={item.id}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-100"
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => { setSelected(item); modal.openModal(); }}
                      aria-label={`View detail: ${item.label} — ${item.meta}`}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }} aria-hidden="true">
                      {TYPE_ICON[item.type]}
                    </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {item.label}
                          <span className="ml-2 font-normal" style={{ color: "var(--color-text-secondary)" }}>
                            {item.meta}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-label-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}>
                          {item.time}
                        </span>
                        <span
                          className="text-label-sm font-medium"
                          style={{ color: STATUS_COLOR[item.status] }}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          Demo data only. Sessions shown here are for demonstration purposes and do not represent real patient records.
        </p>
      </div>

      {modal.isOpen && selected && (
        <DetailModal item={selected} onClose={modal.closeModal} />
      )}
    </>
  );
}
