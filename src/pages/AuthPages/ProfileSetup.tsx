import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import { useAuth } from "../../context/AuthContext";

/* ─────────────────────────────────────────────────────────────────────────────
   Profile Setup — step wizard for new AegisHub users.
   Steps: Role → Display name & photo → Preferences → Done
───────────────────────────────────────────────────────────────────────────── */

type Role = "patient" | "provider" | "carer" | "other";
type Step = 1 | 2 | 3 | 4;

/* ── Shared field ─────────────────────────────────────────────────────────── */
function Field({ id, label, type = "text", placeholder, value, onChange }: {
  id: string; label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</label>
      <input id={id} name={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border px-4 py-2.5 text-sm"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)", outline: "none" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")} />
    </div>
  );
}

/* ── Step indicator ───────────────────────────────────────────────────────── */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex items-center gap-2" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
          style={{ background: i < current ? "var(--color-accent)" : "var(--color-border)" }} />
      ))}
    </div>
  );
}

/* ── Step 1: Role ─────────────────────────────────────────────────────────── */
const ROLES: { id: Role; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "patient",  label: "Patient",          desc: "Accessing care or communication support",
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { id: "provider", label: "Healthcare Provider", desc: "Clinician, nurse, or healthcare professional",
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z"/></svg> },
  { id: "carer",    label: "Carer / Family",   desc: "Supporting a patient or family member",
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  { id: "other",    label: "Other",            desc: "Researcher, developer, or interested party",
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> },
];

function Step1({ role, setRole, onNext }: { role: Role | null; setRole: (r: Role) => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="mb-1.5 text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>How will you use AegisHub?</h2>
      <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>This helps us personalise your experience.</p>
      <div className="space-y-3 mb-8">
        {ROLES.map(r => (
          <button key={r.id} type="button" onClick={() => setRole(r.id)}
            className="flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-all"
            style={{
              borderColor: role === r.id ? "var(--color-accent)" : "var(--color-border)",
              background: role === r.id ? "var(--color-accent-light)" : "var(--color-surface)",
              boxShadow: role === r.id ? "0 0 0 1px var(--color-accent)" : "none",
            }}>
            <span className="mt-0.5 shrink-0 rounded-lg p-2" style={{ background: role === r.id ? "var(--color-accent)" : "var(--color-surface-subtle)", color: role === r.id ? "#fff" : "var(--color-text-secondary)" }}>
              {r.icon}
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{r.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{r.desc}</p>
            </div>
            {role === r.id && (
              <span className="ml-auto shrink-0 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "var(--color-accent)" }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </span>
            )}
          </button>
        ))}
      </div>
      <button disabled={!role} onClick={onNext}
        className="w-full rounded-sm py-3 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "var(--color-accent)", color: "#fff" }}
        onMouseEnter={(e) => { if (role) e.currentTarget.style.background = "var(--color-accent-hover)"; }}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}>
        Continue
      </button>
    </div>
  );
}

/* ── Step 2: Display info ─────────────────────────────────────────────────── */
function Step2({ name, setName, org, setOrg, onNext, onBack }: {
  name: string; setName: (v: string) => void;
  org: string; setOrg: (v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <div>
      <h2 className="mb-1.5 text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>About you</h2>
      <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>This is how others will see you on AegisHub.</p>
      <div className="space-y-5 mb-8">
        <Field id="display_name" label="Display name" placeholder="Dr. Amara Osei" value={name} onChange={setName} />
        <Field id="organisation"  label="Organisation (optional)" placeholder="Lagos University Teaching Hospital" value={org} onChange={setOrg} />
        {/* Avatar upload placeholder */}
        <div>
          <p className="mb-1.5 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Profile photo (optional)</p>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>
              {name ? name[0].toUpperCase() : "?"}
            </div>
            <button type="button" className="rounded-sm border px-4 py-2 text-sm transition-colors"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-subtle)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              Upload photo
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 rounded-sm border py-3 text-sm font-semibold transition-colors"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          Back
        </button>
        <button disabled={!name.trim()} onClick={onNext}
          className="flex-2 flex-1 rounded-sm py-3 text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ background: "var(--color-accent)", color: "#fff" }}
          onMouseEnter={(e) => { if (name.trim()) e.currentTarget.style.background = "var(--color-accent-hover)"; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}>
          Continue
        </button>
      </div>
    </div>
  );
}

/* ── Step 3: Preferences ─────────────────────────────────────────────────── */
const PREFS = [
  { id: "sign",    label: "Sign Language Interpreter", desc: "Camera-based ASL to text" },
  { id: "caption", label: "Live Captioner",            desc: "Real-time speech captions" },
  { id: "derma",   label: "Derma-Scan",                desc: "AI-assisted skin analysis" },
];

function Step3({ selected, setSelected, onNext, onBack }: {
  selected: string[]; setSelected: (v: string[]) => void;
  onNext: () => void; onBack: () => void;
}) {
  const toggle = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);

  return (
    <div>
      <h2 className="mb-1.5 text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>Which tools do you need?</h2>
      <p className="mb-6 text-sm" style={{ color: "var(--color-text-secondary)" }}>Select all that apply. You can change this later in Settings.</p>
      <div className="space-y-3 mb-8">
        {PREFS.map(p => {
          const on = selected.includes(p.id);
          return (
            <button key={p.id} type="button" onClick={() => toggle(p.id)}
              className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all"
              style={{
                borderColor: on ? "var(--color-accent)" : "var(--color-border)",
                background: on ? "var(--color-accent-light)" : "var(--color-surface)",
              }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{p.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{p.desc}</p>
              </div>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ border: `2px solid ${on ? "var(--color-accent)" : "var(--color-border)"}`, background: on ? "var(--color-accent)" : "transparent" }}>
                {on && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 rounded-sm border py-3 text-sm font-semibold transition-colors"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          Back
        </button>
        <button onClick={onNext} className="flex-1 rounded-sm py-3 text-sm font-semibold transition-colors"
          style={{ background: "var(--color-accent)", color: "#fff" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}>
          Finish setup
        </button>
      </div>
    </div>
  );
}

/* ── Step 4: Done ─────────────────────────────────────────────────────────── */
function Step4({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--color-accent-light)" }}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-accent)" }} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>
        You're all set{name ? `, ${name.split(" ")[0]}` : ""}!
      </h2>
      <p className="mb-8 text-sm max-w-xs mx-auto" style={{ color: "var(--color-text-secondary)" }}>
        Your AegisHub profile is ready. Head to the dashboard to start using your tools.
      </p>
      <button onClick={() => navigate("/dashboard")}
        className="w-full rounded-sm py-3 text-sm font-semibold transition-colors mb-3"
        style={{ background: "var(--color-accent)", color: "#fff" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}>
        Open dashboard
      </button>
      <button onClick={() => navigate("/settings")} className="w-full rounded-sm border py-3 text-sm font-medium transition-colors"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-subtle)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        Review settings first
      </button>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function ProfileSetup() {
  const { updateProfile, user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role | null>(null);
  // Pre-fill display name from whatever was stored at sign-up
  const [name, setName] = useState(user?.firstName ?? "");
  const [org,  setOrg]  = useState("");
  const [prefs, setPrefs] = useState<string[]>([]);

  const TOTAL = 3;

  // When user advances from step 2, commit display name to AuthContext
  const handleStep2Next = () => {
    if (name.trim()) {
      updateProfile({ displayName: name.trim() });
    }
    setStep(3);
  };

  // When user finishes step 3, commit role
  const handleStep3Next = () => {
    if (role) updateProfile({ role });
    setStep(4);
  };

  return (
    <>
      <PageMeta title="Set up your profile — AegisHub" description="Complete your AegisHub profile." />
      <AuthLayout
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&fit=crop&auto=format"
        quote="Your profile. Your tools. Your accessibility gateway."
        quoteAuthor="AegisHub"
      >
        <div className="w-full max-w-sm mx-auto">
          {/* Step progress */}
          {step < 4 && (
            <>
              <StepBar current={step} total={TOTAL} />
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                Step {step} of {TOTAL}
              </p>
            </>
          )}

          {step === 1 && <Step1 role={role} setRole={setRole} onNext={() => setStep(2)} />}
          {step === 2 && <Step2 name={name} setName={setName} org={org} setOrg={setOrg} onNext={handleStep2Next} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 selected={prefs} setSelected={setPrefs} onNext={handleStep3Next} onBack={() => setStep(2)} />}
          {step === 4 && <Step4 name={name} />}

          {step < 4 && (
            <p className="mt-8 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Link to="/dashboard" style={{ color: "var(--color-text-muted)" }}>Skip for now</Link>
            </p>
          )}
        </div>
      </AuthLayout>
    </>
  );
}
