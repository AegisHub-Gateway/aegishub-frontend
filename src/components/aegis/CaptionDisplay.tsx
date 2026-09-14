import { useEffect, useRef } from "react";
import type { CaptionUtterance } from "../../lib/types/caption";
import { cn } from "../../lib/utils/cn";

interface CaptionDisplayProps {
  utterances: CaptionUtterance[];
  partialText: string;
  speakerActive: boolean;
  autoScroll?: boolean;
  fontSize?: "sm" | "md" | "lg" | "xl";
  highContrast?: boolean;
  className?: string;
}

const FONT_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export default function CaptionDisplay({
  utterances,
  partialText,
  speakerActive,
  autoScroll = true,
  fontSize = "md",
  highContrast = false,
  className,
}: CaptionDisplayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [utterances, partialText, autoScroll]);

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border",
        highContrast
          ? "border-gray-900 bg-gray-950 dark:border-white dark:bg-black"
          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      role="log"
      aria-label="Live captions"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between border-b px-5 py-3",
        highContrast ? "border-gray-700" : "border-gray-100 dark:border-gray-800"
      )}>
        <span className={cn("text-xs font-semibold uppercase tracking-widest", highContrast ? "text-gray-400" : "text-gray-400 dark:text-gray-500")}>
          Live Captions
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn("inline-block h-2 w-2 rounded-full", speakerActive ? "bg-success-500 animate-pulse" : "bg-gray-300 dark:bg-gray-600")}
            aria-hidden="true"
          />
          <span className={cn("text-xs", highContrast ? "text-gray-400" : "text-gray-500 dark:text-gray-400")}>
            {speakerActive ? "Speaker active" : "Listening…"}
          </span>
        </div>
      </div>

      {/* Transcript area */}
      <div className={cn("flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar min-h-[200px] max-h-[400px]")}>
        {utterances.length === 0 && !partialText && (
          <div className="flex h-full min-h-[160px] items-center justify-center">
            <p className={cn("text-sm text-center", highContrast ? "text-gray-500" : "text-gray-400 dark:text-gray-600")}>
              Captions will appear here once a session starts…
            </p>
          </div>
        )}

        {utterances.map((u) => (
          <p
            key={u.id}
            className={cn(
              FONT_SIZES[fontSize],
              "leading-relaxed",
              highContrast
                ? "text-white"
                : "text-gray-900 dark:text-white font-medium"
            )}
          >
            {u.text}
          </p>
        ))}

        {/* Partial / in-progress caption */}
        {partialText && (
          <p
            className={cn(
              FONT_SIZES[fontSize],
              "leading-relaxed",
              highContrast ? "text-gray-400 italic" : "text-gray-400 dark:text-gray-500 italic"
            )}
            aria-label={`In progress: ${partialText}`}
          >
            {partialText}
            <span className="ml-0.5 inline-block w-0.5 h-[1.1em] align-middle bg-brand-500 animate-pulse" aria-hidden="true" />
          </p>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
