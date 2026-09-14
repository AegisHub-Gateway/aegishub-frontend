import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] };

interface ScanUploadProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export default function ScanUpload({ onFile, disabled, className }: ScanUploadProps) {
  const [fileError, setFileError] = useState<string | null>(null);

  // Keep a ref to the hidden fallback <input> so the button always opens the picker
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (
      accepted: File[],
      rejected: { file: File; errors: { code: string; message: string }[] }[]
    ) => {
      setFileError(null);
      if (rejected.length > 0) {
        const code = rejected[0].errors[0]?.code ?? "";
        if (code === "file-too-large") {
          setFileError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
        } else if (code === "file-invalid-type") {
          setFileError("Unsupported file type. Please use JPG, PNG, or WebP.");
        } else {
          setFileError("Could not accept this file. Please try a different image.");
        }
        return;
      }
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: false,
    disabled,
    // noClick because we provide our own button below that calls open()
    noClick: false,
  });

  // Fallback handler for browsers where react-dropzone click doesn't open picker
  const handleFallbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!Object.keys(ACCEPTED_TYPES).includes(f.type)) {
      setFileError("Unsupported file type. Please use JPG, PNG, or WebP.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFileError(null);
    onFile(f);
    // Reset so the same file can be re-selected after a remove
    e.target.value = "";
  };

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        role="button"
        aria-label="Upload skin image — click or drag and drop"
        tabIndex={0}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          border: `2px dashed ${isDragActive ? "var(--color-accent)" : "var(--color-border)"}`,
          backgroundColor: isDragActive ? "var(--color-accent-light)" : "var(--color-surface-subtle)",
          padding: "48px 32px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 150ms, background-color 150ms",
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isDragActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent-border)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          }
        }}
      >
        {/* react-dropzone's hidden input — handles drag-drop */}
        <input {...getInputProps()} />

        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: isDragActive ? "var(--color-accent-subtle)" : "var(--color-surface)",
            color: isDragActive ? "var(--color-accent)" : "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {isDragActive ? (
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent)" }}>Drop image here…</p>
        ) : (
          <>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>
              Drop an image or{" "}
              <span
                style={{ color: "var(--color-accent)", textDecoration: "underline", cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); open(); }}
              >
                browse
              </span>
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              JPG, PNG, WebP · Max {MAX_SIZE_MB} MB
            </p>
          </>
        )}
      </div>

      {/* Hidden fallback input — ensures file picker opens in all browsers */}
      <input
        ref={fallbackInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFallbackChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* File error */}
      {fileError && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            borderRadius: 8,
            border: "1px solid var(--color-error-border)",
            backgroundColor: "var(--color-error-bg)",
            padding: "10px 12px",
          }}
        >
          <svg
            style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, color: "var(--color-error)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p style={{ fontSize: 12, color: "var(--color-error)" }}>{fileError}</p>
        </div>
      )}
    </div>
  );
}
