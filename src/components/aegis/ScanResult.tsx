import type { DermaAnalysisResponse } from "../../lib/types/derma";
import { TRIAGE_LABELS } from "../../lib/types/derma";
import SafetyDisclaimer from "./SafetyDisclaimer";
import { cn } from "../../lib/utils/cn";

interface ScanResultProps {
  result: DermaAnalysisResponse;
  className?: string;
}

const TRIAGE_STYLES: Record<DermaAnalysisResponse["triage_tier"], { bg: string; text: string; border: string; dot: string }> = {
  LOW_CONCERN:    { bg: "bg-success-50 dark:bg-success-950/20",  text: "text-success-700 dark:text-success-400",  border: "border-success-200 dark:border-success-900/30",  dot: "bg-success-500" },
  MONITOR:        { bg: "bg-warning-50 dark:bg-warning-950/20",  text: "text-warning-700 dark:text-warning-400",  border: "border-warning-200 dark:border-warning-900/30",  dot: "bg-warning-400" },
  SEEK_EVALUATION:{ bg: "bg-orange-50 dark:bg-orange-950/20",    text: "text-orange-700 dark:text-orange-400",    border: "border-orange-200 dark:border-orange-900/30",    dot: "bg-orange-500" },
  URGENT:         { bg: "bg-error-50 dark:bg-error-950/20",      text: "text-error-700 dark:text-error-400",      border: "border-error-200 dark:border-error-900/30",      dot: "bg-error-500" },
};

const CONFIDENCE_LABELS: Record<DermaAnalysisResponse["confidence_band"], string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
};

export default function ScanResult({ result, className }: ScanResultProps) {
  const triage = TRIAGE_STYLES[result.triage_tier];

  return (
    <div className={cn("space-y-5 animate-slide-up", className)}>
      {/* Triage tier */}
      <div className={cn("flex items-center gap-3 rounded-xl border p-5", triage.bg, triage.border)}>
        <span className={cn("inline-block h-3 w-3 shrink-0 rounded-full", triage.dot)} aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Triage</p>
          <p className={cn("text-lg font-bold", triage.text)} role="status">
            {TRIAGE_LABELS[result.triage_tier]}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Confidence</p>
          <p className={cn("font-mono text-sm font-semibold", triage.text)}>
            {CONFIDENCE_LABELS[result.confidence_band]}
          </p>
        </div>
      </div>

      {/* Observations */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Observations</h3>
        <ul className="space-y-2" role="list">
          {result.observations.map((obs, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden="true" />
              {obs}
            </li>
          ))}
        </ul>
      </div>

      {/* Plain language */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Guidance</h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{result.plain_language}</p>
      </div>

      {/* Skin tone caveat */}
      {result.skin_tone_caveat && (
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="mb-0.5 text-sm font-semibold text-gray-700 dark:text-gray-300">Skin tone note</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI model performance for skin analysis may vary across different skin tones. For a thorough assessment, professional evaluation is recommended regardless of this result.
            </p>
          </div>
        </div>
      )}

      <SafetyDisclaimer type="derma" />
    </div>
  );
}
