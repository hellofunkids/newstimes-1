"use client";

import { useEffect, useState } from "react";
import { Level } from "@prisma/client";

const RATES = [0.6, 0.8, 1.0] as const;
const DEFAULT_RATE_BY_LEVEL: Record<Level, number> = {
  ELEMENTARY: 0.6,
  MIDDLE: 0.8,
  JUNIOR: 1.0,
};

type SentencePair = { en: string; ko: string };
type VocabWord = { word: string; meaning: string };

export function StudySection({
  sentences,
  vocabulary,
  level,
}: {
  sentences: SentencePair[];
  vocabulary: VocabWord[];
  level: Level;
}) {
  const [supported, setSupported] = useState(true);
  const [rate, setRate] = useState(DEFAULT_RATE_BY_LEVEL[level]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  function speak(text: string, id: string) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }

  if (!supported) {
    return (
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        이 브라우저는 읽어주기 기능을 지원하지 않아요. 크롬(Chrome)
        브라우저에서 열어주세요.
      </p>
    );
  }

  const fullText = sentences.map((s) => s.en).join(" ");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            speakingId === "all" ? stop() : speak(fullText, "all")
          }
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-400"
        >
          {speakingId === "all" ? "⏹ 멈추기" : "🔊 전체 듣기"}
        </button>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRate(r)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                rate === r
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {r}x
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          className="ml-auto text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          {showTranslation ? "한국어 해석 숨기기" : "한국어 해석 보기"}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {sentences.map((sentence, i) => {
          const id = `sentence-${i}`;
          return (
            <div key={id} className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() =>
                    speakingId === id ? stop() : speak(sentence.en, id)
                  }
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${
                    speakingId === id
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🔊
                </button>
                <p className="text-lg leading-8 text-slate-700">
                  {sentence.en}
                </p>
              </div>
              {showTranslation && (
                <p className="pl-11 text-sm text-slate-400">{sentence.ko}</p>
              )}
            </div>
          );
        })}
      </div>

      {vocabulary.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-700">📝 오늘의 단어</h3>
          <div className="flex flex-col gap-2">
            {vocabulary.map((v, i) => {
              const id = `vocab-${i}`;
              return (
                <div key={id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      speakingId === id ? stop() : speak(v.word, id)
                    }
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${
                      speakingId === id
                        ? "bg-sky-500 text-white"
                        : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                    }`}
                  >
                    🔊
                  </button>
                  <span className="font-semibold text-slate-800">
                    {v.word}
                  </span>
                  <span className="text-slate-500">{v.meaning}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
