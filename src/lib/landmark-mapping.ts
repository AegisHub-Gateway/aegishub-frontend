import type { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import type { HandFrame, LandmarkPoint } from "./types/sign";

const EMPTY_HAND: LandmarkPoint[] = Array.from({ length: 21 }, () => ({
  x: 0,
  y: 0,
  z: 0,
}));

export function resultToHandFrame(result: HandLandmarkerResult): HandFrame {
  let left_hand: LandmarkPoint[] = EMPTY_HAND;
  let right_hand: LandmarkPoint[] = EMPTY_HAND;

  result.landmarks.forEach((landmarks, i) => {
    const handedness = result.handednesses?.[i]?.[0]?.categoryName;
    const points: LandmarkPoint[] = landmarks.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.z,
    }));

    if (handedness === "Left") left_hand = points;
    if (handedness === "Right") right_hand = points;
  });

  return { left_hand, right_hand };
}
