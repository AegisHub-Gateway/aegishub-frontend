import { cn } from "../../lib/utils/cn";

interface ConfidenceIndicatorProps {
  confidence: number; // 0 – 1
  showLabel?: boolean;
  className?: string;
}

function getBand(c: number): { label: string; color: string; trackColor: string; textColor: string } {
  if (c >= 0.85) return { label: "High confidence", color: "bg-success-500", trackColor: "bg-success-100 dark:bg-success-950", textColor: "text-success-600 dark:text-success-400" };
  if (c >= 0.65) return { label: "Moderate confidence", color: "bg-warning-400", trackColor: "bg-warning-100 dark:bg-warning-950", textColor: "text-warning-600 dark:text-warning-400" };
  return { label: "Low confidence", color: "bg-error-400", trackColor: "bg-error-100 dark:bg-error-950", textColor: "text-error-600 dark:text-error-400" };
}

export default function ConfidenceIndicator({ confidence, showLabel = true, className }: ConfidenceIndicatorProps) {
  const pct = Math.round(confidence * 100);
  const { label, color, trackColor, textColor } = getBand(confidence);

  return (
    <div className={cn("space-y-1.5", className)} role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Confidence: ${pct}%, ${label}`}>
      <div className="flex items-center justify-between">
        <span className={cn("mono text-sm font-semibold tabular-nums", textColor)}>{pct}%</span>
        {showLabel && <span className={cn("text-xs font-medium", textColor)}>{label}</span>}
      </div>
      <div className={cn("h-1.5 w-full overflow-hidden rounded-full", trackColor)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
