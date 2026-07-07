import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { Level } from "@prisma/client";
import { fetchHeadlines, CATEGORIES, type Category } from "./newsSource";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LEVEL_PROMPTS: Record<Level, string> = {
  ELEMENTARY:
    "Korean elementary school students (age 8-10) learning English. Use very short sentences (under 10 words), only the most common everyday words, present tense where possible. 4-6 sentences total.",
  MIDDLE:
    "Korean middle school students (age 12-14) learning English. Use short-to-medium sentences, common intermediate vocabulary, simple past/present tense. 6-8 sentences total.",
  JUNIOR:
    "advanced Korean junior English learners (age 14-16) preparing for exams like NE Times Junior. Use natural, slightly more complex sentences and richer vocabulary, but still clear and readable aloud. 7-10 sentences total.",
};

type LeveledScript = { title: string; script: string };

async function writeLeveledScript(
  headline: string,
  description: string,
  level: Level,
): Promise<LeveledScript> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `A real news headline (for inspiration only): "${headline}" - ${description}

Write an ORIGINAL short English news-style reading passage inspired by the topic of this headline, for ${LEVEL_PROMPTS[level]}

Do NOT copy sentences from the headline/description verbatim. Write new, simple, age-appropriate original sentences about the same general topic. The passage should read naturally out loud for a read-aloud pronunciation practice exercise.

Respond with ONLY valid JSON, no markdown fences, in this exact shape:
{"title": "short original title", "script": "the reading passage as plain text"}`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  const parsed = JSON.parse(text);
  return { title: parsed.title, script: parsed.script };
}

export async function generateArticlesForCategory(category: Category) {
  const headlines = await fetchHeadlines(category);
  const created = [];

  for (const headline of headlines) {
    for (const level of Object.values(Level)) {
      const { title, script } = await writeLeveledScript(
        headline.title,
        headline.description,
        level,
      );

      const article = await prisma.article.create({
        data: {
          level,
          category,
          title,
          script,
          sourceHeadline: headline.title,
          sourceUrl: headline.url,
        },
      });
      created.push(article);
    }
  }

  return created;
}

export async function generateArticlesForAllCategories() {
  const results = [];
  for (const category of CATEGORIES) {
    results.push(...(await generateArticlesForCategory(category)));
  }
  return results;
}
