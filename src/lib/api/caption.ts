import type { CaptionResponse } from "../types/caption";
import { USE_MOCK_API } from "../types/api";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_PHRASES = [
  "I need help with my medication",
  "Can you explain the side effects",
  "When should I take this",
  "I have been feeling dizzy",
  "My chest feels tight",
  "Is this normal after surgery",
  "I need to speak with a doctor",
  "How long will recovery take",
];

let mockPhraseIndex = 0;

async function mockStreamCaption(
  onUpdate: (response: CaptionResponse) => void,
  signal: AbortSignal
): Promise<void> {
  const phrase = MOCK_PHRASES[mockPhraseIndex % MOCK_PHRASES.length];
  mockPhraseIndex++;
  const words = phrase.split(" ");

  for (let i = 1; i <= words.length; i++) {
    if (signal.aborted) return;
    await delay(250 + Math.random() * 150);
    const partial = words.slice(0, i).join(" ");
    onUpdate({
      partial: i < words.length ? partial : "",
      final: i === words.length ? phrase : "",
      speaker_active: true,
      timestamp: Date.now(),
    });
  }

  await delay(800);
  if (!signal.aborted) {
    onUpdate({ partial: "", final: "", speaker_active: false, timestamp: Date.now() });
  }
}

export const captionApi = {
  stream: (
    onUpdate: (r: CaptionResponse) => void,
    signal: AbortSignal
  ): Promise<void> =>
    USE_MOCK_API ? mockStreamCaption(onUpdate, signal) : Promise.resolve(),
};
