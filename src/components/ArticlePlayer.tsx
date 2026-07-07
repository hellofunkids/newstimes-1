"use client";

import { useState } from "react";
import { Level } from "@prisma/client";

const RATE_BY_LEVEL: Record<Level, number> = {
  ELEMENTARY: 0.75,
  MIDDLE: 0.85,
  JUNIOR: 0.95,
};

export function ArticlePlayer({
  script,
  level,
}: {
  script: string;
  level: Level;
}) {
  const [speaking, setSpeaking] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  function speak() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = "en-US";
    utterance.rate = RATE_BY_LEVEL[level];
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return (
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        이 브라우저는 읽어주기 기능을 지원하지 않아요. 크롬(Chrome)
        브라우저에서 열어주세요.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={speaking ? stop : speak}
      className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-400"
    >
      {speaking ? "⏹ 멈추기" : "🔊 듣기"}
    </button>
  );
}
