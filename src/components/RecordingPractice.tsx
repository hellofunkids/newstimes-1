"use client";

import { useRef, useState } from "react";
import { scoreTranscript, type ScoreResult } from "@/lib/scoring/diff";

type Status = "idle" | "recording" | "scoring" | "done" | "unsupported";

export function RecordingPractice({
  articleId,
  script,
}: {
  articleId: string;
  script: string;
}) {
  const [status, setStatus] = useState<Status>(() =>
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
      ? "idle"
      : "unsupported",
  );
  const [liveTranscript, setLiveTranscript] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  function start() {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const alt = result[0];
        if (!alt) continue;
        if (result.isFinal) {
          finalTranscript += alt.transcript + " ";
        } else {
          interim += alt.transcript;
        }
      }
      setLiveTranscript((finalTranscript + interim).trim());
    };

    recognition.onerror = () => {
      setStatus("idle");
    };

    recognition.onend = async () => {
      const transcript = finalTranscript.trim();
      const score = scoreTranscript(script, transcript);
      setResult(score);
      setStatus("scoring");

      try {
        const res = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, transcript }),
        });
        const data = await res.json();
        setFeedback(data.feedback ?? null);
      } catch {
        setFeedback(null);
      }
      setStatus("done");
    };

    recognitionRef.current = recognition;
    setLiveTranscript("");
    setResult(null);
    setFeedback(null);
    setStatus("recording");
    recognition.start();
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  function retry() {
    setResult(null);
    setFeedback(null);
    setLiveTranscript("");
    setStatus("idle");
  }

  if (status === "unsupported") {
    return (
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        이 브라우저는 음성 인식을 지원하지 않아요. 크롬(Chrome) 브라우저에서
        열어주세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {status === "idle" && (
        <button
          type="button"
          onClick={start}
          className="flex w-fit items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-400"
        >
          🎙 녹음하기
        </button>
      )}

      {status === "recording" && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={stop}
            className="flex w-fit animate-pulse items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white"
          >
            ⏺ 녹음 중... (누르면 끝내기)
          </button>
          <p className="text-sm text-slate-400">{liveTranscript}</p>
        </div>
      )}

      {(status === "scoring" || status === "done") && result && (
        <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4">
          <p className="text-3xl font-bold text-sky-600">
            {result.accuracy}
            <span className="text-lg text-slate-400">점</span>
          </p>

          <p className="text-lg leading-8">
            {result.words.map((w, i) => (
              <span
                key={i}
                className={
                  w.matched
                    ? "mr-1 text-emerald-600"
                    : "mr-1 text-rose-400 underline decoration-wavy"
                }
              >
                {w.text}
              </span>
            ))}
          </p>

          {status === "scoring" && (
            <p className="text-sm text-slate-400">AI 피드백을 준비 중이에요...</p>
          )}
          {status === "done" && feedback && (
            <p className="rounded-lg bg-sky-50 px-4 py-3 text-sky-800">
              {feedback}
            </p>
          )}

          {status === "done" && (
            <button
              type="button"
              onClick={retry}
              className="w-fit rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              🔁 다시 시도
            </button>
          )}
        </div>
      )}
    </div>
  );
}
