// Offline fallback prompts, used when the daily-prompt API can't be reached.
// Mirrors the server list in the web app's /api/prompt route.
export const FALLBACK_PROMPTS = [
  'What did you notice this morning that you usually walk past?',
  'What is one small thing your body is asking for today?',
  'Who would thank you for the way you showed up today?',
  'What did today\u2019s ritual make slightly easier?',
  'If today were a page in a book, what would its first line be?',
  'What are you quietly getting better at?',
  'What would make tomorrow\u2019s morning softer?',
  'What did you keep today, even though nobody asked you to?',
  'Where did your attention want to go, and where did you choose to put it?',
  'What is one thing you can finish before the day ends?',
  'What felt lighter today than it did a month ago?',
  'What are you looking forward to tomorrow?',
];

const EPOCH = Date.UTC(2024, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

export function fallbackPrompt(dateKey: string): string {
  const days = Math.floor((Date.parse(`${dateKey}T00:00:00Z`) - EPOCH) / DAY_MS);
  const list = FALLBACK_PROMPTS;
  return list[((days % list.length) + list.length) % list.length];
}

export async function fetchDailyPrompt(
  dateKey: string,
  baseUrl: string,
): Promise<{ prompt: string; fromNetwork: boolean }> {
  try {
    const response = await fetch(`${baseUrl}/api/prompt?date=${dateKey}`);
    if (response.ok) {
      const data = (await response.json()) as { prompt?: string };
      if (typeof data.prompt === 'string' && data.prompt.length > 0) {
        return { prompt: data.prompt, fromNetwork: true };
      }
    }
  } catch {
    // offline or API not deployed yet — use the built-in rotation
  }
  return { prompt: fallbackPrompt(dateKey), fromNetwork: false };
}
