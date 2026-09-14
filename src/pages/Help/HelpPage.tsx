import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router";

/* ─────────────────────────────────────────────────────────────────────────────
   Help & Safety — DESIGN.md v1.0
   Emergency top. FAQ accordion. Calm tone. No decorative urgency.
───────────────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "How does Sign Language Interpretation work?",
    a: "Your camera captures video locally. The browser extracts hand landmark coordinates — 21 points per hand — without sending raw video anywhere. Only those lightweight coordinates are sent to the AI backend for classification.",
  },
  {
    q: "Is my data stored?",
    a: "Raw camera frames and microphone recordings are never stored or transmitted. Skin images sent during a Derma-Scan are used for the analysis request only and are not retained after the result is returned. No personal health data is stored by AegisHub.",
  },
  {
    q: "What does the Derma-Scan triage level mean?",
    a: "Triage levels — Low Concern, Monitor, Seek Evaluation — are informational categories based on the AI model's observations. They are not medical diagnoses. They are starting points for deciding whether to seek professional evaluation.",
  },
  {
    q: "Is AegisHub a medical device?",
    a: "No. AegisHub is an AI-assisted accessibility tool. It has not been validated as a medical device and its output must not be used as the sole basis for any clinical decision.",
  },
  {
    q: "What does the skin tone note mean on Derma-Scan results?",
    a: "Some AI skin analysis models have lower accuracy for certain skin tones due to limitations in training data. When this note appears, professional evaluation is especially recommended regardless of the AI result.",
  },
  {
    q: "Can I use AegisHub in a real clinical setting?",
    a: "AegisHub is currently a demonstration platform. It has not been validated for clinical use. Do not use it as the sole basis for any clinical decision. Always involve qualified healthcare professionals.",
  },
  {
    q: "How do I revoke camera or microphone access?",
    a: "You can revoke access at any time in your browser settings. In Chrome: Settings → Privacy and security → Site settings → Camera / Microphone. In Firefox: Preferences → Privacy & Security → Permissions.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <button
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-100"
        style={{ backgroundColor: "transparent" }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <span className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{q}</span>
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="shrink-0 mt-0.5 transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "var(--color-text-muted)" }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 animate-fade-in">
          <p className="text-body-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <>
      <PageMeta title="Help & Safety — AegisHub" description="Safety information and help for AegisHub." />

      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>Help & Safety</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Important safety information and answers to common questions.
          </p>
        </div>

        {/* Emergency — top, calm but clear */}
        <div
          className="rounded-lg border px-5 py-4"
          style={{ borderColor: "var(--color-error-border)", backgroundColor: "var(--color-error-bg)" }}
          role="alert"
        >
          <p className="text-body-sm font-semibold mb-1" style={{ color: "var(--color-error)" }}>
            If this is a medical emergency
          </p>
          <p className="text-body-sm" style={{ color: "var(--color-error)" }}>
            Call <strong>999</strong> / <strong>112</strong> / <strong>911</strong> immediately.
            AegisHub is not an emergency service and cannot provide emergency medical treatment.
          </p>
        </div>

        {/* AI disclaimer */}
        <div
          className="rounded-lg border px-5 py-4"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-subtle)" }}
          role="note"
        >
          <p className="text-body-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
            AI-assisted guidance only
          </p>
          <p className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
            AegisHub provides AI-assisted informational output. It is not a medical device. Output does not constitute a confirmed clinical diagnosis or treatment recommendation. Always consult a qualified healthcare professional.
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-body-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
            Frequently asked questions
          </h2>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          >
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-body-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
            Support
          </h2>
          <div
            className="rounded-lg border divide-y"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          >
            {[
              { label: "Sign Interpreter",  path: "/sign-interpreter" },
              { label: "Live Captioner",    path: "/captioner"        },
              { label: "Derma-Scan",        path: "/derma-scan"       },
              { label: "Settings",          path: "/settings"         },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center justify-between px-5 py-3.5 transition-colors duration-100"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</span>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
