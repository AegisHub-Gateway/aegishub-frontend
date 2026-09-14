import type {
  SignClassificationRequest,
  SignClassificationResponse,
  HealthResponse,
} from "../types/sign";
import { USE_MOCK_API, API_BASE_URL } from "../types/api";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_RESULTS: SignClassificationResponse[] = [
  { gloss: "PAIN", confidence: 0.94, alternatives: ["DISCOMFORT", "ACHE"], below_threshold: false },
  { gloss: "HELP", confidence: 0.91, alternatives: ["ASSIST", "SUPPORT"], below_threshold: false },
  { gloss: "WATER", confidence: 0.87, alternatives: ["DRINK", "LIQUID"], below_threshold: false },
  { gloss: "MEDICINE", confidence: 0.89, alternatives: ["TREATMENT", "DRUG"], below_threshold: false },
  { gloss: "HURT", confidence: 0.72, alternatives: ["PAIN", "INJURY"], below_threshold: false },
  { gloss: "TIRED", confidence: 0.58, alternatives: ["FATIGUE", "WEAK"], below_threshold: true },
];

async function mockClassify(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: SignClassificationRequest
): Promise<SignClassificationResponse> {
  await delay(1200 + Math.random() * 800);
  const result = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  return { ...result };
}

let requestInFlight = false;

async function realClassify(
  req: SignClassificationRequest
): Promise<SignClassificationResponse> {
  if (requestInFlight) {
    throw new Error("A classification request is already in progress");
  }

  requestInFlight = true;
  try {
    const res = await fetch(`${API_BASE_URL}/v1/sign/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(
        err?.detail
          ? JSON.stringify(err.detail)
          : `Classify failed: ${res.status}`
      );
    }

    return res.json();
  } finally {
    requestInFlight = false;
  }
}

async function mockHealth(): Promise<HealthResponse> {
  await delay(300);
  return {
    status: "ok",
    service: "aegishub-backend-mock",
    model_version: "mock",
    model_loaded: true,
  };
}

async function realHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/healthz`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export const signApi = {
  classify: (req: SignClassificationRequest): Promise<SignClassificationResponse> =>
    USE_MOCK_API ? mockClassify(req) : realClassify(req),

  health: (): Promise<HealthResponse> =>
    USE_MOCK_API ? mockHealth() : realHealth(),
};
