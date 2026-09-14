import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import CameraView from "../../components/aegis/CameraView";
import HandLandmarkOverlay from "../../components/aegis/HandLandmarkOverlay";
import { useCamera } from "../../lib/hooks/useCamera";
import { useHandLandmarks } from "../../lib/hooks/useHandLandmarks";
import { signApi } from "../../lib/api/sign";
import type { SignClassificationResponse, SignSessionState } from "../../lib/types/sign";

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: active ? "var(--color-accent)" : "var(--color-border-strong)" }}
      aria-hidden="true"
    />
  );
}

export default function SignInterpreterPage() {
  const camera = useCamera();
  const landmarks = useHandLandmarks();
  const [sessionState, setSessionState] = useState<SignSessionState>("idle");
  const [result, setResult] = useState<SignClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setResult(null);
    setError(null);
    await camera.startCamera();
    landmarks.startTracking(camera.videoRef);
    setSessionState("active");
  };

  const handleStop = () => {
    camera.stopCamera();
    landmarks.stopTracking();
    landmarks.clearFrames();
    setSessionState("stopped");
    setResult(null);
  };

  const handleClassify = async () => {
    if (landmarks.frames.length < 5) {
      setError("Not enough frames. Hold a sign clearly for 1–2 seconds, then try again.");
      return;
    }
    setSessionState("processing");
    setError(null);
    try {
      const res = await signApi.classify({ frames: landmarks.frames });
      setResult(res);
      setSessionState("result");
      landmarks.clearFrames();
    } catch {
      setError("Processing failed. Please try again.");
      setSessionState("active");
    }
  };

  const isActive = camera.isActive;
  const processing = sessionState === "processing";

  return (
    <>
      <PageMeta
        title="Sign Language Interpreter — AegisHub"
        description="Translate ASL to text in real time using your camera."
      />

      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>
              Sign Language Interpreter
            </h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Translate ASL to text in real time.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-sm"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No raw video sent
          </span>
        </div>

        {/* Camera — primary surface */}
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-950" style={{ aspectRatio: "16/9" }}>
          <CameraView
            camera={camera}
            isTracking={landmarks.isTracking && landmarks.handCount > 0}
            showOverlay={landmarks.isTracking}
            className="h-full w-full"
          >
            <HandLandmarkOverlay
              landmarks={landmarks.isTracking ? landmarks.landmarks : null}
              width={1280}
              height={720}
            />
          </CameraView>
        </div>

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <StatusDot active={isActive} />
            <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              Camera {isActive ? "active" : "off"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot active={landmarks.isTracking && landmarks.handCount > 0} />
            <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              {landmarks.isTracking
                ? landmarks.handCount > 0
                  ? `Tracking ${landmarks.handCount} hand${landmarks.handCount > 1 ? "s" : ""}`
                  : "No hand detected"
                : "Hand tracking off"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot active={processing} />
            <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              {processing ? "Processing…" : "Ready"}
            </span>
          </div>
          <span
            className="text-mono ml-auto"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-muted)" }}
            aria-label={`${landmarks.frames.length} frames captured`}
          >
            {landmarks.frames.length} frames
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {!isActive ? (
            <button
              onClick={handleStart}
              disabled={camera.permissionState === "requesting"}
              className="rounded-sm px-5 py-2.5 text-label-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-text-inverse)" }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--color-accent-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-accent)"; }}
            >
              {camera.permissionState === "requesting" ? "Starting…" : "Start Interpretation"}
            </button>
          ) : (
            <>
              <button
                onClick={handleClassify}
                disabled={processing || landmarks.frames.length < 3}
                className="rounded-sm px-5 py-2.5 text-label-lg font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--color-accent)", color: "var(--color-text-inverse)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--color-accent-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-accent)"; }}
              >
                {processing ? "Processing…" : "Interpret Sign"}
              </button>
              <button
                onClick={handleStop}
                className="rounded-sm border px-5 py-2.5 text-label-lg font-medium transition-colors duration-150"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Stop
              </button>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <p
            className="rounded-md border px-4 py-3 text-body-sm"
            style={{ borderColor: "var(--color-error-border)", backgroundColor: "var(--color-error-bg)", color: "var(--color-error)" }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Result block */}
        {sessionState === "result" && result && (
          <div
            className="rounded-xl border p-6 animate-slide-up"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
          >
            <div
              className="mb-1 text-label-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              Interpretation
            </div>

            <p
              className="text-display-md mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
              aria-live="polite"
              aria-label={`Sign interpreted as: ${result.gloss}`}
            >
              {result.gloss}
            </p>

            <div className="mb-4 flex items-center gap-3">
              <span
                className="text-mono font-semibold"
                style={{ fontFamily: "var(--font-mono)", color: result.confidence >= 0.85 ? "var(--color-success)" : result.confidence >= 0.65 ? "var(--color-warning)" : "var(--color-error)" }}
              >
                {Math.round(result.confidence * 100)}%
              </span>
              <span className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
                {result.confidence >= 0.85 ? "High confidence" : result.confidence >= 0.65 ? "Moderate confidence" : "Low confidence"}
              </span>
            </div>

            {result.alternatives.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>Possible:</span>
                {result.alternatives.map((alt) => (
                  <span
                    key={alt}
                    className="rounded-full border px-2.5 py-0.5 text-mono"
                    style={{ fontFamily: "var(--font-mono)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "var(--color-surface-subtle)", fontSize: "0.75rem" }}
                  >
                    {alt}
                  </span>
                ))}
              </div>
            )}

            {result.below_threshold && (
              <p
                className="mt-4 rounded-md border px-3 py-2 text-body-sm"
                style={{ borderColor: "var(--color-warning-border)", backgroundColor: "var(--color-warning-bg)", color: "var(--color-warning)" }}
                role="alert"
              >
                Confidence is below the reliability threshold. Please repeat the sign clearly and try again.
              </p>
            )}

            <p className="mt-4 text-body-sm" style={{ color: "var(--color-text-muted)" }}>
              AI model result — not a confirmed interpretation. Verify critical signs directly with the patient.
            </p>
          </div>
        )}

        {/* Idle state */}
        {(sessionState === "idle" || sessionState === "active") && !result && (
          <div
            className="rounded-xl border-2 border-dashed px-6 py-10 text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
              {isActive
                ? "Hold a sign clearly and press Interpret Sign"
                : "Start a session to begin interpreting"}
            </p>
          </div>
        )}

        {/* Privacy context */}
        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          <strong style={{ color: "var(--color-text-secondary)" }}>Camera access</strong> — used to capture hand landmarks for interpretation. Only lightweight coordinate data is sent to the backend. Raw video never leaves your device.
        </p>
      </div>
    </>
  );
}
