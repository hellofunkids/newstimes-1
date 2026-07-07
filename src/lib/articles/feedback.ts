import Anthropic from "@anthropic-ai/sdk";
import type { ScoreResult } from "@/lib/scoring/diff";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateFeedback(
  score: ScoreResult,
  childName: string,
): Promise<string> {
  const missedWords = score.words
    .filter((w) => !w.matched)
    .map((w) => w.text)
    .slice(0, 5);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `${childName} is a Korean student practicing reading an English passage aloud. Speech recognition compared what they said to the original text and got ${score.accuracy}% word accuracy. Words the recognizer did not catch: ${missedWords.length ? missedWords.join(", ") : "(none, great job)"}.

Write a short, warm, encouraging comment in Korean (2 sentences max) for the student. If there were missed words, gently mention 1-2 of them as words to practice again. Do not mention percentages or technical terms like "speech recognition". Keep it simple and kid-friendly.`,
      },
    ],
  });

  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}
