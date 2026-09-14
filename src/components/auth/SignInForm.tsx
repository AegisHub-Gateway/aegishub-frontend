import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

/* ─────────────────────────────────────────────────────────────────────────────
   Sign In — reads email from the form and stores the user identity in
   AuthContext so the greeting and avatar update immediately after login.
───────────────────────────────────────────────────────────────────────────── */

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18.751 10.194c0-.72-.06-1.245-.19-1.789H10.18v3.248h4.92c-.099.807-.634 2.022-1.825 2.839l-.013.109 2.65 2.012.184.018c1.686-1.526 2.659-3.772 2.659-6.437z" fill="#4285F4"/>
    <path d="M10.179 18.75c2.41 0 4.434-.778 5.912-2.119l-2.82-2.139c-.754.515-1.766.875-3.095.875-2.361 0-4.365-1.526-5.08-3.635l-.104.008-2.756 2.09-.036.098C3.671 16.786 6.687 18.75 10.179 18.75z" fill="#34A853"/>
    <path d="M5.1 11.731a5.257 5.257 0 01-.288-1.732c0-.603.109-1.186.278-1.731l-.004-.116L2.295 6.03l-.091.043A8.954 8.954 0 001.251 10c0 1.41.347 2.742.952 3.928L5.1 11.73z" fill="#FBBC05"/>
    <path d="M10.179 4.633c1.676 0 2.807.71 3.452 1.303l2.52-2.411C14.604 2.115 12.59 1.25 10.179 1.25c-3.492 0-6.508 1.964-7.976 4.822l2.876 2.197c.724-2.11 2.728-3.636 5.1-3.636z" fill="#EB4335"/>
  </svg>
);

function InputField({ id, label, type = "text", placeholder, required, inputRef }: {
  id: string; label: string; type?: string; placeholder?: string;
  required?: boolean; inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
        {label}{required && <span className="ml-0.5" style={{ color: "var(--color-error)" }}>*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id} name={id}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-sm border px-4 py-2.5 text-sm transition-colors"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--color-border)")}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={show ? "Hide password" : "Show password"}>
            {show
              ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SignInForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Read the email that the user typed so we can derive a display name.
    // Since sign-in doesn't ask for a name, we extract the local part of
    // the email address (everything before @) and capitalise it as the
    // first name. This is replaced by the real name if the user goes
    // through profile-setup, and will be overwritten by the backend name
    // once a real auth layer is added.
    const email = emailRef.current?.value ?? "";
    const localPart = email.split("@")[0] ?? "";
    const guessedName = localPart
      .replace(/[._-]+/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    signIn(guessedName, "", email);

    setTimeout(() => navigate("/dashboard"), 700);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="mb-1.5 text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}>
          Welcome back
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Sign in to your AegisHub account.
        </p>
      </div>

      <div className="mb-6">
        <button type="button"
          className="flex w-full items-center justify-center gap-3 rounded-sm border py-2.5 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-xs" style={{ background: "var(--color-surface)", color: "var(--color-text-muted)" }}>
            or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField id="email" label="Email" type="email" placeholder="you@example.com" required inputRef={emailRef} />
        <InputField id="password" label="Password" type="password" placeholder="Enter your password" required />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" style={{ accentColor: "var(--color-accent)" }} />
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Keep me signed in</span>
          </label>
          <Link to="/reset-password" className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-sm py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ background: "var(--color-accent)", color: "#fff" }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--color-accent-hover)"; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-accent)")}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold" style={{ color: "var(--color-accent)" }}>Create one</Link>
      </p>
    </div>
  );
}
