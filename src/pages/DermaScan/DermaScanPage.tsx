import { useState, useEffect, useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import ScanUpload from "../../components/aegis/ScanUpload";
import { dermaApi } from "../../lib/api/derma";
import type { DermaAnalysisResponse, DermaState } from "../../lib/types/derma";
import { TRIAGE_LABELS } from "../../lib/types/derma";

/* ─────────────────────────────────────────────────────────────────────────────
   Derma-Scan page
   Upload → preview → analyze → result
   Uses URL.createObjectURL for instant preview + revokes on cleanup.
   Fully wired to dermaApi (mock or real via USE_MOCK_API flag).
───────────────────────────────────────────────────────────────────────────── */

const STEPS = ["Preparing image", "Analysing visual features", "Preparing guidance"];

const TRIAGE_STYLE: Record<
  DermaAnalysisResponse["triage_tier"],
  { border: string; bg: string; text: string; dot: string }
> = {
  LOW_CONCERN:     { border: "var(--color-success-border)", bg: "var(--color-success-bg)", text: "var(--color-success)", dot: "var(--color-success)" },
  MONITOR:         { border: "var(--color-warning-border)", bg: "var(--color-warning-bg)", text: "var(--color-warning)", dot: "var(--color-warning)" },
  SEEK_EVALUATION: { border: "var(--color-error-border)",   bg: "var(--color-error-bg)",   text: "var(--color-error)",   dot: "var(--color-error)"   },
  URGENT:          { border: "var(--color-error-border)",   bg: "var(--color-error-bg)",   text: "var(--color-error)",   dot: "var(--color-error)"   },
};

export default function DermaScanPage() {
  const [file, setFile] = useState<File | null>(null);
  // objectURL for preview — created via URL.createObjectURL, revoked on cleanup
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [state, setState] = useState<DermaState>("idle");
  const [result, setResult] = useState<DermaAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  // Hidden file input for the "Replace" button
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL when it changes or component unmounts (prevents memory leak)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ── Accept a new file ───────────────────────────────────────────────────
  const acceptFile = (f: File) => {
    // Revoke previous URL before creating new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(url);
    setImgError(false);
    setResult(null);
    setError(null);
    setState("idle");
    setStep(0);
  };

  // ── Remove / reset ──────────────────────────────────────────────────────
  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(null);
    setImgError(false);
    setResult(null);
    setError(null);
    setState("idle");
    setStep(0);
  };

  // ── Replace: open native file picker ────────────────────────────────────
  const handleReplace = () => {
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
      replaceInputRef.current.click();
    }
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  };

  // ── Analyse ─────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return;
    setState("analyzing");
    setError(null);
    setResult(null);
    setStep(0);

    const timer = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      900
    );

    try {
      const res = await dermaApi.analyze(file);
      clearInterval(timer);
      setResult(res);
      setState("complete");
    } catch {
      clearInterval(timer);
      setError("Analysis failed. Please try again with a clear, well-lit image.");
      setState("error");
    }
  };

  const isAnalyzing = state === "analyzing";

  // ── Helpers ──────────────────────────────────────────────────────────────
  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px 20px",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 150ms",
  };

  return (
    <>
      <PageMeta
        title="Derma-Scan — AegisHub"
        description="Upload a skin image for plain-language AI-assisted observations."
      />

      <div className="space-y-6 animate-fade-in">
        {/* ── Page header ─────────────────────────────────────────────── */}
        <div>
          <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>
            Derma-Scan
          </h1>
          <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Upload a skin image for plain-language guidance.
          </p>
        </div>

        {/* ── Disclaimer ──────────────────────────────────────────────── */}
        <div
          className="flex items-start gap-3 rounded-lg border px-4 py-3"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-subtle)" }}
          role="note"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: "var(--color-accent)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Not a confirmed medical diagnosis.</strong>{" "}
            Results are AI-assisted observations to support — not replace — professional assessment.
          </p>
        </div>

        {/* ── Upload zone OR image preview ────────────────────────────── */}
        {!file ? (
          <ScanUpload onFile={acceptFile} disabled={isAnalyzing} />
        ) : (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          >
            {/* Preview */}
            <div
              style={{
                position: "relative",
                backgroundColor: "var(--color-surface-subtle)",
                maxHeight: 320,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!imgError ? (
                <img
                  src={previewUrl!}
                  alt={`Preview of ${file.name}`}
                  onError={() => setImgError(true)}
                  style={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                // Graceful fallback if object URL somehow fails
                <div
                  style={{
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    color: "var(--color-text-muted)",
                  }}
                >
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p style={{ fontSize: 13 }}>Could not display preview</p>
                </div>
              )}
            </div>

            {/* File meta + Replace + Remove */}
            <div
              className="flex items-center justify-between border-t px-5 py-3"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div style={{ minWidth: 0, marginRight: 16, flex: 1 }}>
                <p
                  className="text-body-sm font-medium"
                  style={{ color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {file.name}
                </p>
                <p className="text-label-sm" style={{ color: "var(--color-text-muted)" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                {/* Replace */}
                <button
                  onClick={handleReplace}
                  disabled={isAnalyzing}
                  className="text-label-sm font-medium transition-colors"
                  style={{ color: "var(--color-accent)", opacity: isAnalyzing ? 0.4 : 1, cursor: isAnalyzing ? "not-allowed" : "pointer" }}
                  aria-label="Replace image"
                >
                  Replace
                </button>
                {/* Remove */}
                <button
                  onClick={handleRemove}
                  disabled={isAnalyzing}
                  className="text-label-sm font-medium transition-colors"
                  style={{ color: "var(--color-text-muted)", opacity: isAnalyzing ? 0.4 : 1, cursor: isAnalyzing ? "not-allowed" : "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                  aria-label="Remove image"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden input for Replace */}
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleReplaceChange}
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* ── Analyse button ───────────────────────────────────────────── */}
        {file && state !== "complete" && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{
              ...btnBase,
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              opacity: isAnalyzing ? 0.55 : 1,
              cursor: isAnalyzing ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!isAnalyzing) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)"; }}
          >
            {isAnalyzing ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Analysing…
              </span>
            ) : (
              "Analyse Image"
            )}
          </button>
        )}

        {/* Scan another after complete */}
        {state === "complete" && (
          <button
            onClick={handleRemove}
            style={{
              ...btnBase,
              backgroundColor: "transparent",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-surface-subtle)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            Scan another image
          </button>
        )}

        {/* ── Analysis progress ────────────────────────────────────────── */}
        {isAnalyzing && (
          <div
            className="rounded-xl border p-8 text-center animate-fade-in"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
          >
            <p className="text-heading-sm mb-6" style={{ color: "var(--color-text-primary)" }}>
              Analysing image…
            </p>
            <div style={{ maxWidth: 280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      backgroundColor:
                        i < step
                          ? "var(--color-success)"
                          : i === step
                          ? "var(--color-accent)"
                          : "var(--color-surface-subtle)",
                      color: i <= step ? "#fff" : "var(--color-text-muted)",
                    }}
                    aria-hidden="true"
                  >
                    {i < step ? (
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className="text-body-sm"
                    style={{
                      color: i <= step ? "var(--color-text-primary)" : "var(--color-text-muted)",
                      fontWeight: i === step ? 500 : 400,
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {state === "error" && error && (
          <div
            className="rounded-lg border px-4 py-3"
            style={{ borderColor: "var(--color-error-border)", backgroundColor: "var(--color-error-bg)" }}
            role="alert"
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <svg className="h-5 w-5 shrink-0" style={{ color: "var(--color-error)", marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-body-sm font-semibold" style={{ color: "var(--color-error)" }}>
                  Analysis failed
                </p>
                <p className="text-body-sm" style={{ color: "var(--color-error)" }}>
                  {error}
                </p>
                <button
                  onClick={handleAnalyze}
                  className="mt-2 text-body-sm font-medium underline"
                  style={{ color: "var(--color-error)" }}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {state === "complete" && result && (
          <div className="space-y-4 animate-slide-up">
            {/* Triage */}
            <div
              className="flex items-center gap-3 rounded-xl border px-5 py-4"
              style={{
                borderColor: TRIAGE_STYLE[result.triage_tier].border,
                backgroundColor: TRIAGE_STYLE[result.triage_tier].bg,
              }}
            >
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: TRIAGE_STYLE[result.triage_tier].dot }}
                aria-hidden="true"
              />
              <div style={{ flex: 1 }}>
                <p
                  className="text-label-sm font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Triage
                </p>
                <p
                  className="text-heading-sm font-bold"
                  style={{ color: TRIAGE_STYLE[result.triage_tier].text }}
                  role="status"
                >
                  {TRIAGE_LABELS[result.triage_tier]}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p className="text-label-sm" style={{ color: "var(--color-text-muted)" }}>
                  Confidence
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: TRIAGE_STYLE[result.triage_tier].text,
                  }}
                >
                  {result.confidence_band}
                </p>
              </div>
            </div>

            {/* Observations */}
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <h2 className="text-heading-sm mb-3" style={{ color: "var(--color-text-primary)" }}>
                Observations
              </h2>
              <ul className="space-y-2" role="list">
                {result.observations.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-body-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span
                      style={{
                        marginTop: 7,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: "var(--color-text-muted)",
                        display: "inline-block",
                      }}
                      aria-hidden="true"
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guidance */}
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <h2 className="text-heading-sm mb-3" style={{ color: "var(--color-text-primary)" }}>
                Guidance
              </h2>
              <p className="text-body-md leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {result.plain_language}
              </p>
            </div>

            {/* Skin tone caveat */}
            {result.skin_tone_caveat && (
              <div
                className="flex items-start gap-3 rounded-lg border px-4 py-3"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-subtle)" }}
              >
                <svg
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p
                    className="text-body-sm font-semibold mb-0.5"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Skin tone note
                  </p>
                  <p className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                    AI model performance for skin analysis may vary across different skin tones.
                    Professional evaluation is recommended regardless of this result.
                  </p>
                </div>
              </div>
            )}

            {/* Safety disclaimer */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg
                style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: "var(--color-warning)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                This is AI-assisted guidance, not a diagnosis. Always consult a qualified healthcare
                provider.
              </p>
            </div>
          </div>
        )}

        {/* ── Idle empty state ────────────────────────────────────────── */}
        {state === "idle" && !file && (
          <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
            Upload an image above to begin. Supported formats: JPG, PNG, WebP · max 10 MB.
          </p>
        )}
      </div>

      {/* Spinner keyframe (inline so no extra CSS file needed) */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
