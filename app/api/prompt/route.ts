export const dynamic = "force-dynamic";

// One gentle prompt per day, deterministic by date so every client sees the same
// question and answers stay meaningful when compared across the week.
const PROMPTS = [
  "What did you notice this morning that you usually walk past?",
  "What is one small thing your body is asking for today?",
  "Who would thank you for the way you showed up today?",
  "What did today's ritual make slightly easier?",
  "If today were a page in a book, what would its first line be?",
  "What are you quietly getting better at?",
  "What would make tomorrow's morning softer?",
  "What did you keep today, even though nobody asked you to?",
  "Where did your attention want to go, and where did you choose to put it?",
  "What is one thing you can finish before the day ends?",
  "What felt lighter today than it did a month ago?",
  "What are you looking forward to tomorrow?",
];

const EPOCH = Date.UTC(2024, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

export function GET(request: Request) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");

  if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return Response.json(
      { error: "date must be YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const date = dateParam ?? new Date().toISOString().slice(0, 10);
  const days = Math.floor((Date.parse(`${date}T00:00:00Z`) - EPOCH) / DAY_MS);
  const prompt = PROMPTS[((days % PROMPTS.length) + PROMPTS.length) % PROMPTS.length];

  return Response.json(
    { date, prompt },
    { headers: { "cache-control": "public, max-age=3600, s-maxage=86400" } },
  );
}
