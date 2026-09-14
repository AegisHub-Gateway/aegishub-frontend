import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useTheme } from "../../context/ThemeContext";

/* ─────────────────────────────────────────────────────────────────────────────
   Settings — DESIGN.md v1.0
   Grouped sections with a single border. Not individual cards per setting.
───────────────────────────────────────────────────────────────────────────── */

/* ── Toggle control ─────────────────────────────────────────────────────────── */
function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: checked ? "var(--color-accent)" : "var(--color-border-strong)", outlineColor: "var(--color-accent)" }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-150"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        aria-hidden="true"
      />
    </button>
  );
}

/* ── Setting row ─────────────────────────────────────────────────────────────── */
function SettingRow({ label, description, id, checked, onChange }: {
  label: string; description?: string; id: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-body-sm font-medium cursor-pointer" style={{ color: "var(--color-text-primary)" }}>
          {label}
        </label>
        {description && <p className="text-body-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{description}</p>}
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

/* ── Section wrapper ────────────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-body-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
        {title}
      </h2>
      <div
        className="rounded-lg border divide-y"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        {children}
      </div>
    </div>
  );
}

function SectionRow({ children }: { children: React.ReactNode }) {
  return <div className="px-5">{children}</div>;
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [largeCaptions, setLargeCaptions] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const THEMES = [
    { value: "light", label: "Light" },
    { value: "dark",  label: "Dark"  },
  ] as const;

  return (
    <>
      <PageMeta title="Settings — AegisHub" description="Customise your AegisHub experience." />

      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>Settings</h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Customise your AegisHub experience.
          </p>
        </div>

        {/* ── Appearance ── */}
        <Section title="Appearance">
          <SectionRow>
            <div className="py-4">
              <p className="text-body-sm font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>Theme</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Theme selection">
                {THEMES.map((t) => {
                  const active = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={!active ? toggleTheme : undefined}
                      className="flex items-center gap-2 rounded-sm border px-4 py-2 text-label-lg font-medium transition-colors duration-150"
                      style={{
                        borderColor: active ? "var(--color-accent)" : "var(--color-border)",
                        backgroundColor: active ? "var(--color-accent-light)" : "transparent",
                        color: active ? "var(--color-accent-text)" : "var(--color-text-secondary)",
                      }}
                      aria-pressed={active}
                    >
                      {t.value === "light" ? (
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )} {t.label}
                      {active && (
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} style={{ color: "var(--color-accent)" }} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
                <button
                  disabled
                  className="flex items-center gap-2 rounded-sm border px-4 py-2 text-label-lg font-medium opacity-40 cursor-not-allowed"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  System <span className="text-label-sm">(soon)</span>
                </button>
              </div>
            </div>
          </SectionRow>
          <SectionRow>
            <div className="py-4">
              <p className="text-body-sm font-medium mb-2" style={{ color: "var(--color-text-primary)" }}>Font size</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Font size selection">
                {["Default", "Large"].map((s) => (
                  <button
                    key={s}
                    disabled={s === "Large"}
                    className="rounded-sm border px-4 py-1.5 text-label-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: s === "Default" ? "var(--color-accent)" : "var(--color-border)",
                      backgroundColor: s === "Default" ? "var(--color-accent-light)" : "transparent",
                      color: s === "Default" ? "var(--color-accent-text)" : "var(--color-text-secondary)",
                    }}
                  >
                    {s}{s === "Large" && " (soon)"}
                  </button>
                ))}
              </div>
            </div>
          </SectionRow>
        </Section>

        {/* ── Accessibility ── */}
        <Section title="Accessibility">
          <SectionRow>
            <SettingRow
              id="reduced-motion"
              label="Reduced motion"
              description="Minimise animations throughout the interface."
              checked={reducedMotion}
              onChange={setReducedMotion}
            />
          </SectionRow>
          <SectionRow>
            <SettingRow
              id="high-contrast"
              label="High contrast"
              description="Increase contrast for captions and key interface elements."
              checked={highContrast}
              onChange={setHighContrast}
            />
          </SectionRow>
          <SectionRow>
            <SettingRow
              id="large-text"
              label="Larger text"
              description="Increase the base font size across the application."
              checked={largeText}
              onChange={setLargeText}
            />
          </SectionRow>
          <SectionRow>
            <SettingRow
              id="large-captions"
              label="Large captions"
              description="Use extra-large text in the Live Captioner display."
              checked={largeCaptions}
              onChange={setLargeCaptions}
            />
          </SectionRow>
        </Section>

        {/* ── Privacy ── */}
        <Section title="Privacy">
          {[
            { title: "Camera processing",  value: "On device",        note: "Hand landmarks are extracted locally. No raw camera frames are transmitted." },
            { title: "Microphone",         value: "On device",        note: "Audio features are extracted locally. No raw recordings are transmitted." },
            { title: "Image upload",       value: "Encrypted transit", note: "Skin images are sent only when you start a scan and are not stored after analysis." },
          ].map(({ title, value, note }) => (
            <SectionRow key={title}>
              <div className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-body-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{title}</p>
                  <p className="text-body-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{note}</p>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2.5 py-0.5 text-label-sm font-medium"
                  style={{ borderColor: "var(--color-success-border)", backgroundColor: "var(--color-success-bg)", color: "var(--color-success)" }}
                >
                  {value}
                </span>
              </div>
            </SectionRow>
          ))}
        </Section>

        {/* ── Application ── */}
        <Section title="Application">
          <SectionRow>
            <SettingRow
              id="notifications"
              label="Notifications"
              description="Allow in-app notifications for session results."
              checked={notifications}
              onChange={setNotifications}
            />
          </SectionRow>
          <SectionRow>
            <div className="py-4">
              <p className="text-body-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Language</p>
              <select
                disabled
                className="rounded-sm border px-3 py-2 text-body-sm opacity-50 cursor-not-allowed"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-subtle)", color: "var(--color-text-secondary)" }}
                aria-label="Language (coming soon)"
              >
                <option>English (US)</option>
              </select>
              <p className="mt-1 text-body-sm" style={{ color: "var(--color-text-muted)" }}>Additional languages coming soon.</p>
            </div>
          </SectionRow>
          <SectionRow>
            <div className="py-4">
              <button
                className="text-body-sm font-medium transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                onClick={() => {
                  setReducedMotion(false); setHighContrast(false); setLargeText(false);
                  setLargeCaptions(false); setNotifications(true);
                }}
              >
                Reset to defaults
              </button>
            </div>
          </SectionRow>
        </Section>

        {/* ── About ── */}
        <Section title="About AegisHub">
          <SectionRow>
            <div className="py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L3 8v5c0 5 4 9 9 11 5-2 9-6 9-11V8L12 2z" fill="white" fillOpacity="0.95" />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-body-sm font-bold" style={{ color: "var(--color-text-primary)" }}>AegisHub</p>
                  <p className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>Universal Health Accessibility Gateway</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Version", value: "1.0.0-demo" },
                  { label: "Mode",    value: "Mock API"   },
                  { label: "Build",   value: "Sep 2026"   },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-md px-3 py-2.5" style={{ backgroundColor: "var(--color-surface-subtle)" }}>
                    <p className="text-label-sm" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                    <p className="text-body-sm font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                AI-assisted tools only. Not a medical device. Output does not constitute a clinical diagnosis. Always consult a qualified healthcare professional.
              </p>
            </div>
          </SectionRow>
        </Section>
      </div>
    </>
  );
}
