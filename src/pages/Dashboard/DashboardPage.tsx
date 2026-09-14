import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useGreetingName } from "../../lib/hooks/useGreetingName";

/* ── Shared icon components ─────────────────────────────────────────────── */
const IconHand = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V6.5a1.5 1.5 0 013 0v3M10 9.5V5a1.5 1.5 0 013 0v4.5M13 8.5V6a1.5 1.5 0 013 0v5.5m0 0v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-2a1.5 1.5 0 013 0" />
  </svg>
);
const IconMic = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 01-14 0M12 17v4M8 21h8" />
  </svg>
);
const IconScan = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M3 12h18" />
  </svg>
);

const TOOL_ICONS = {
  sign:    <IconHand size={22} />,
  caption: <IconMic  size={22} />,
  derma:   <IconScan size={22} />,
};

const TOOLS = [
  { type: "sign"    as const, title: "Sign Language Interpreter", desc: "Translate ASL to text in real time. Camera captures hand landmarks locally — no raw video sent.",               path: "/sign-interpreter", cta: "Open" },
  { type: "caption" as const, title: "Live Captioner",            desc: "Real-time accessible captions enhanced with visual speech cues. Designed for medical conversations.",           path: "/captioner",        cta: "Open" },
  { type: "derma"   as const, title: "Derma-Scan",                desc: "Upload a skin image for plain-language insight and triage guidance. AI-assisted, never diagnostic.",            path: "/derma-scan",       cta: "Open" },
];

const RECENT: { type: "sign" | "caption" | "derma"; label: string; meta: string; time: string }[] = [
  { type: "sign",    label: "Sign Interpretation", meta: "PAIN · 94%",              time: "Today 14:22"     },
  { type: "derma",   label: "Derma-Scan",           meta: "Monitor",                 time: "Yesterday 16:45" },
  { type: "caption", label: "Live Caption",          meta: "Session ended · 3m 12s", time: "2 days ago"      },
];

function ToolCard({ tool }: { tool: typeof TOOLS[number] }) {
  return (
    <article
      className="group flex flex-col rounded-xl border-2 p-8 transition-all duration-150"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }} aria-hidden="true">
        {TOOL_ICONS[tool.type]}
      </div>
      <h2 className="text-heading-sm mb-2" style={{ color: "var(--color-text-primary)" }}>{tool.title}</h2>
      <p className="text-body-sm flex-1 mb-6" style={{ color: "var(--color-text-secondary)" }}>{tool.desc}</p>
      <Link
        to={tool.path}
        className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-label-lg font-medium transition-colors duration-150"
        style={{ backgroundColor: "var(--color-accent)", color: "var(--color-text-inverse)" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
        aria-label={`Open ${tool.title}`}
      >
        {tool.cta}
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}

export default function DashboardPage() {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = useGreetingName();            // resolves from AuthContext → localStorage
  const greeting = `${timeOfDay}, ${name}`;

  return (
    <>
      <PageMeta title="Dashboard — AegisHub" description="Your AegisHub accessibility workspace." />
      <div className="space-y-10 animate-fade-in">
        <div>
          <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>{greeting}</h1>
          <p className="text-body-md mt-1" style={{ color: "var(--color-text-secondary)" }}>Your accessibility workspace is ready.</p>
        </div>

        <section aria-label="Tools">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map((t) => <ToolCard key={t.path} tool={t} />)}
          </div>
        </section>

        <section aria-label="Recent activity">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-sm" style={{ color: "var(--color-text-primary)" }}>Recent activity</h2>
            <Link to="/history" className="flex items-center gap-1 text-label-sm font-medium transition-colors duration-150" style={{ color: "var(--color-accent)" }}>
              View all
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="rounded-lg border divide-y" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
            {RECENT.map((item) => (
              <div key={item.label + item.time} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }} aria-hidden="true">
                  {TOOL_ICONS[item.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                    {item.label}
                    <span className="ml-2 font-normal" style={{ color: "var(--color-text-secondary)" }}>{item.meta}</span>
                  </p>
                </div>
                <p className="text-label-sm shrink-0" style={{ color: "var(--color-text-muted)" }}>{item.time}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          AI-assisted tools only. Output is informational and does not constitute a clinical diagnosis. Always consult a qualified healthcare professional.
        </p>
      </div>
    </>
  );
}
