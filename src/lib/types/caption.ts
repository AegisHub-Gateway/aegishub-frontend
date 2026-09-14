export interface CaptionResponse {
  partial: string;
  final: string;
  speaker_active: boolean;
  timestamp?: number;
}

export interface CaptionSession {
  id: string;
  startedAt: Date;
  transcript: CaptionUtterance[];
  status: CaptionSessionState;
}

export interface CaptionUtterance {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

export type CaptionSessionState =
  | "idle"
  | "preparing"
  | "camera_active"
  | "mic_active"
  | "listening"
  | "processing"
  | "partial"
  | "final"
  | "paused"
  | "disconnected"
  | "error"
  | "complete";

export interface CaptionSettings {
  fontSize: "sm" | "md" | "lg" | "xl";
  highContrast: boolean;
  autoScroll: boolean;
  showSpeakerActivity: boolean;
  captionDensity: "compact" | "normal" | "spacious";
}
