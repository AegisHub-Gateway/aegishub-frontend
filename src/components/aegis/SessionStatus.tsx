import { cn } from "../../lib/utils/cn";

export interface StatusItem {
  label: string;
  status: "ready" | "active" | "warning" | "error" | "idle" | "processing";
  detail?: string;
}

interface SessionStatusProps {
  items: StatusItem[];
  className?: string;
}

const STATUS_STYLES = {
  ready: { dot: "bg-success-500", text: "text-success-600 dark:text-success-400", label: "Ready" },
  active: { dot: "bg-brand-500 animate-pulse", text: "text-brand-600 dark:text-brand-400", label: "Active" },
  warning: { dot: "bg-warning-400", text: "text-warning-600 dark:text-warning-400", label: "Warning" },
  error: { dot: "bg-error-500", text: "text-error-600 dark:text-error-400", label: "Error" },
  idle: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400", label: "Idle" },
  processing: { dot: "bg-brand-500 animate-pulse", text: "text-brand-600 dark:text-brand-400", label: "Processing" },
};

export default function SessionStatus({ items, className }: SessionStatusProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Session Status</p>
      <div className="space-y-3">
        {items.map((item) => {
          const s = STATUS_STYLES[item.status];
          return (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.detail && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</span>
                )}
                <div className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-2 w-2 rounded-full", s.dot)} aria-hidden="true" />
                  <span className={cn("text-xs font-medium", s.text)}>{s.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
