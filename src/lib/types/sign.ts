export interface HandFrame {
  timestamp: number;
  leftHand?: number[][];
  rightHand?: number[][];
}

export interface SignClassificationRequest {
  frames: HandFrame[];
}

export interface SignClassificationResponse {
  gloss: string;
  confidence: number;
  alternatives: string[];
  below_threshold: boolean;
}

export type SignSessionState =
  | "idle"
  | "requesting_permission"
  | "permission_denied"
  | "camera_unavailable"
  | "browser_unsupported"
  | "active"
  | "tracking"
  | "processing"
  | "result"
  | "no_hand"
  | "low_confidence"
  | "error"
  | "stopped";
