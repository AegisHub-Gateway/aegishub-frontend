export interface DermaAnalysisRequest {
  image: File;
}

export interface DermaAnalysisResponse {
  observations: string[];
  triage_tier: "LOW_CONCERN" | "MONITOR" | "SEEK_EVALUATION" | "URGENT";
  plain_language: string;
  confidence_band: "LOW" | "MODERATE" | "HIGH";
  skin_tone_caveat: boolean;
  disclaimer_id: string;
}

export type DermaState =
  | "idle"
  | "uploading"
  | "preparing"
  | "analyzing"
  | "complete"
  | "error";

export const TRIAGE_LABELS: Record<DermaAnalysisResponse["triage_tier"], string> = {
  LOW_CONCERN: "Low Concern",
  MONITOR: "Monitor",
  SEEK_EVALUATION: "Seek Evaluation",
  URGENT: "Seek Care Promptly",
};

export const TRIAGE_COLORS: Record<DermaAnalysisResponse["triage_tier"], string> = {
  LOW_CONCERN: "success",
  MONITOR: "warning",
  SEEK_EVALUATION: "orange",
  URGENT: "error",
};
