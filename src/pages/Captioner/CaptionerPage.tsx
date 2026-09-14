import { useState, useRef, useCallback, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PermissionState from "../../components/aegis/PermissionState";
import { useMicrophone } from "../../lib/hooks/useMicrophone";
import { captionApi } from "../../lib/api/caption";
import type { CaptionUtterance, CaptionSessionState, CaptionSettings } from "../../lib/types/caption";

/* ─────────────────────────────────────────────────────────────────────────────
   Live Captioner — DESIGN.md v1.0
   Caption text is primary. Controls are secondary. Settings are tertiary.
───────────────────────────────────────────────────────────────────────────── */

let uCount = 0;

export default function CaptionerPage() {
  const mic = useMicrophone();
  const [sessionState, setSessionState] = useState<CaptionSessionState>("idle");
  const [utterances, setUtterances] = useState<CaptionUtterance[]>([]);
  const [partialText, setPartialText] = useState("");
  const [speakerActive, setSpeakerActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CaptionSettings>({
    fontSize: "md",
    highContrast: false,
    autoScroll: true,
    showSpeakerActivity: true,
    captionDensity: "normal",
  });
  const abortRef = useRef<AbortController | null>(null);
  const loopRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll */
  useEffect(() => {
    if (settings.autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [utterances, partialText, settings.autoScroll]);

  const runLoop = useCallback(async (signal: AbortSignal) => {
    while (loopRef.current && !signal.aborted) {
      await captionApi.stream((r) => {
        if (signal.aborted) return;
        setSpeakerActive(r.speaker_active);
        if (r.partial) { setPartialText(r.partial); setSessionState("partial"); }
        if (r.final) {
          setPartialText("");
          setSessionState("final");
          setUtterances((prev) => [
            ...prev,
            { id: `u${++uCount}`, text: r.final, timestamp: new Date(), isFinal: true },
          ]);
          setTimeout(() => { if (!signal.aborted) setSessionState("listening"); }, 300);
        }
        if (!r.partial && !r.final) { setPartialText(""); setSpeakerActive(false); setSessionState("listening"); }
      }, signal);
      if (!signal.aborted && loopRef.current) await new Promise((res) => setTimeout(res, 600));
    }
  }, []);

  const handleStart = async () => {
    setSessionState("preparing");
    await mic.startMic();
    setUtterances([]);
    setPartialText("");
    setSessionState("listening");
    loopRef.current = true;
    abortRef.current = new AbortController();
    runLoop(abortRef.current.signal);
  };

  const handlePause = () => {
    loopRef.current = false;
    abortRef.current?.abort();
    setSessionState("paused");
    setPartialText("");
  };

  const handleResume = () => {
    setSessionState("listening");
    loopRef.current = true;
    abortRef.current = new AbortController();
    runLoop(abortRef.current.signal);
  };

  const handleStop = () => {
    loopRef.current = false;
    abortRef.current?.abort();
    mic.stopMic();
    setSessionState("complete");
    setPartialText("");
    setSpeakerActive(false);
  };

  useEffect(() => {
    return () => { loopRef.current = false; abortRef.current?.abort(); mic.stopMic(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRunning = sessionState === "listening" || sessionState === "partial" || sessionState === "final";
  const fontSizeClass = { sm: "text-body-md", md: "text-heading-sm", lg: "text-heading-md", xl: "text-caption-xl" }[settings.fontSize];

  if (mic.permissionState === "denied") {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>Live Captioner</h1>
        <PermissionState type="mic_denied" onRetry={handleStart} />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Live Captioner — AegisHub"
        description="Real-time accessible captions for medical conversations."
      />

      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-heading-lg" style={{ color: "var(--color-text-primary)" }}>Live Captioner</h1>
            <p className="text-body-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Real-time accessible captions.
            </p>
          </div>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-label-sm font-medium transition-colors duration-150"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "transparent" }}
            aria-label="Caption settings"
            aria-expanded={showSettings}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" />
            </svg>
            Settings
          </button>
        </div>

        {/* Settings drawer */}
        {showSettings && (
          <div
            className="rounded-lg border p-5 animate-slide-up"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-subtle)" }}
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Font size */}
              <div>
                <label className="text-label-sm font-medium mb-1.5 block" style={{ color: "var(--color-text-secondary)" }} htmlFor="caption-font-size">
                  Text size
                </label>
                <select
                  id="caption-font-size"
                  value={settings.fontSize}
                  onChange={(e) => setSettings((s) => ({ ...s, fontSize: e.target.value as CaptionSettings["fontSize"] }))}
                  className="w-full rounded-sm border px-3 py-2 text-body-sm"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text-primary)" }}
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra large</option>
                </select>
              </div>

              {/* Toggle rows */}
              {[
                { key: "highContrast", label: "High contrast" },
                { key: "autoScroll",   label: "Auto-scroll" },
                { key: "showSpeakerActivity", label: "Speaker activity" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-body-sm" style={{ color: "var(--color-text-secondary)" }} htmlFor={`toggle-${key}`}>
                    {label}
                  </label>
                  <button
                    id={`toggle-${key}`}
                    role="switch"
                    aria-checked={settings[key as keyof CaptionSettings] as boolean}
                    onClick={() => setSettings((s) => ({ ...s, [key]: !s[key as keyof CaptionSettings] }))}
                    className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-150"
                    style={{ backgroundColor: (settings[key as keyof CaptionSettings] as boolean) ? "var(--color-accent)" : "var(--color-border-strong)" }}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-150"
                      style={{ transform: (settings[key as keyof CaptionSettings] as boolean) ? "translateX(16px)" : "translateX(0)" }}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: mic.isActive ? "var(--color-accent)" : "var(--color-border-strong)" }}
              aria-hidden="true"
            />
            <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              Microphone {mic.isActive ? "active" : "off"}
            </span>
          </div>
          {settings.showSpeakerActivity && (
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: speakerActive ? "var(--color-success)" : "var(--color-border-strong)" }}
                aria-hidden="true"
              />
              <span className="text-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                {speakerActive ? "Speaker detected" : "No speaker"}
              </span>
            </div>
          )}
        </div>

        {/* Caption display — primary surface */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: settings.highContrast ? "#000" : "var(--color-surface)",
            boxShadow: "var(--shadow-sm)",
            border: settings.highContrast ? "2px solid #fff" : `1px solid var(--color-border)`,
          }}
          role="log"
          aria-label="Live captions"
          aria-live="polite"
        >
          {/* Caption header */}
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: settings.highContrast ? "#333" : "var(--color-border)" }}
          >
            <span className="text-label-sm font-semibold uppercase tracking-widest" style={{ color: settings.highContrast ? "#888" : "var(--color-text-muted)" }}>
              Live Captions
            </span>
            <div className="flex items-center gap-2">
              {isRunning && (
                <span
                  className="inline-block h-2 w-2 rounded-full animate-pulse-dot"
                  style={{ backgroundColor: "var(--color-accent)" }}
                  aria-hidden="true"
                />
              )}
              <span className="text-label-sm" style={{ color: settings.highContrast ? "#888" : "var(--color-text-muted)" }}>
                {isRunning ? "Live" : sessionState === "paused" ? "Paused" : "—"}
              </span>
            </div>
          </div>

          {/* Text area */}
          <div className="min-h-64 max-h-96 overflow-y-auto px-6 py-5 space-y-3 custom-scrollbar">
            {utterances.length === 0 && !partialText && (
              <p style={{ color: settings.highContrast ? "#666" : "var(--color-text-muted)" }} className="text-body-sm">
                Captions will appear here once a session starts…
              </p>
            )}
            {utterances.map((u) => (
              <p key={u.id} className={fontSizeClass} style={{ color: settings.highContrast ? "#fff" : "var(--color-text-primary)", lineHeight: "1.55" }}>
                {u.text}
              </p>
            ))}
            {partialText && (
              <p className={fontSizeClass} style={{ color: settings.highContrast ? "#888" : "var(--color-text-muted)", lineHeight: "1.55", fontStyle: "italic" }}>
                {partialText}
                <span className="ml-0.5 inline-block w-0.5 bg-current cursor-blink align-middle" style={{ height: "1em" }} aria-hidden="true" />
              </p>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {sessionState === "idle" || sessionState === "complete" ? (
            <button
              onClick={handleStart}
              className="rounded-sm px-5 py-2.5 text-label-lg font-medium transition-colors duration-150"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-text-inverse)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
            >
              {sessionState === "complete" ? "New session" : "Start Session"}
            </button>
          ) : sessionState === "paused" ? (
            <>
              <button
                onClick={handleResume}
                className="rounded-sm px-5 py-2.5 text-label-lg font-medium transition-colors duration-150"
                style={{ backgroundColor: "var(--color-accent)", color: "var(--color-text-inverse)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
              >
                Resume
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
          ) : (
            <>
              <button
                onClick={handlePause}
                className="rounded-sm border px-5 py-2.5 text-label-lg font-medium transition-colors duration-150"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ⏸ Pause
              </button>
              <button
                onClick={handleStop}
                className="rounded-sm border px-5 py-2.5 text-label-lg font-medium transition-colors duration-150"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-subtle)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ● Stop
              </button>
            </>
          )}

          {utterances.length > 0 && (
            <span className="ml-auto text-label-sm" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>
              {utterances.length} utterance{utterances.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* State label */}
        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          {sessionState === "idle"      && "Session not started."}
          {sessionState === "preparing" && "Preparing…"}
          {isRunning                    && "Listening for speech."}
          {sessionState === "paused"    && "Session paused."}
          {sessionState === "complete"  && `Session ended · ${utterances.length} utterance${utterances.length !== 1 ? "s" : ""} captured.`}
        </p>

        {/* Privacy context */}
        <p className="text-body-sm" style={{ color: "var(--color-text-muted)" }}>
          <strong style={{ color: "var(--color-text-secondary)" }}>Microphone access</strong> — used for live captioning only. Audio features — not recordings — are processed. Access stops when the session ends.
        </p>
      </div>
    </>
  );
}
