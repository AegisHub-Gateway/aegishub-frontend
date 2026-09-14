import type { DermaAnalysisResponse } from "../types/derma";
import { USE_MOCK_API, API_BASE_URL } from "../types/api";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_RESULTS: DermaAnalysisResponse[] = [
  {
    observations: ["Localized visible discoloration", "Mild surface irritation", "Irregular border noted"],
    triage_tier: "MONITOR",
    plain_language:
      "The image shows a localized skin change with mild discoloration. Consider monitoring the area and seek professional evaluation if it changes, grows, or persists beyond a few weeks.",
    confidence_band: "MODERATE",
    skin_tone_caveat: true,
    disclaimer_id: "DERMA_GENERAL_01",
  },
  {
    observations: ["Small raised lesion", "Even coloration"],
    triage_tier: "LOW_CONCERN",
    plain_language:
      "The image shows a small raised area with consistent coloration. This appears to be a low-concern finding. Continue to monitor for any changes.",
    confidence_band: "HIGH",
    skin_tone_caveat: false,
    disclaimer_id: "DERMA_GENERAL_02",
  },
  {
    observations: ["Asymmetric coloration", "Irregular margins", "Multiple tonal variations"],
    triage_tier: "SEEK_EVALUATION",
    plain_language:
      "The image shows features that warrant professional evaluation. Please consult a qualified healthcare provider for a thorough assessment.",
    confidence_band: "MODERATE",
    skin_tone_caveat: true,
    disclaimer_id: "DERMA_GENERAL_03",
  },
];

async function mockAnalyze(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: File
): Promise<DermaAnalysisResponse> {
  await delay(2000 + Math.random() * 1000);
  return { ...MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)] };
}

async function realAnalyze(image: File): Promise<DermaAnalysisResponse> {
  const form = new FormData();
  form.append("image", image);
  const res = await fetch(`${API_BASE_URL}/v1/derma/analyze`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const dermaApi = {
  analyze: (image: File): Promise<DermaAnalysisResponse> =>
    USE_MOCK_API ? mockAnalyze(image) : realAnalyze(image),
};
