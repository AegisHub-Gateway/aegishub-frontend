import type { SignClassificationResponse } from "../../lib/types/sign";
import ConfidenceIndicator from "./ConfidenceIndicator";
import { cn } from "../../lib/utils/cn";

interface InterpretationResultProps {
  result: SignClassificationResponse;
  className?: string;
}

export default function InterpretationResult({ result, className }: InterpretationResultProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 animate-slide-up", className)}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Interpretation Result
      </p>

      {/* Primary result */}
      <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-400">Interpreted sign</p>
        <p
          className="font-mono text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
          aria-live="polite"
          aria-label={`Sign interpreted as: ${result.gloss}`}
        >
          {result.gloss}
        </p>
      </div>

      {/* Confidence */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Confidence</p>
        <ConfidenceIndicator confidence={result.confidence} />
      </div>

      {/* Alternatives */}
      {result.alternatives.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Alternative interpretations</p>
          <div className="flex flex-wrap gap-2">
            {result.alternatives.map((alt) => (
              <span
                key={alt}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Below-threshold warning */}
      {result.below_threshold && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50 p-3 dark:border-warning-900/30 dark:bg-warning-950/30">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-warning-700 dark:text-warning-400">
            Confidence is below the reliability threshold. Please repeat the sign clearly or verify the result.
          </p>
        </div>
      )}

      {/* Model disclaimer */}
      <p className="mt-4 text-[11px] leading-relaxed text-gray-400 dark:text-gray-600">
        This is an AI model result, not a confirmed interpretation. Verify critical signs directly with the patient.
      </p>
    </div>
  );
}
