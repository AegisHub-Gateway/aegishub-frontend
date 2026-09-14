export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
}

export interface HandFrame {
  left_hand: LandmarkPoint[];
  right_hand: LandmarkPoint[];
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

export interface HealthResponse {
  status: string;
  service: string;
  model_version: string;
  model_loaded: boolean;
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
