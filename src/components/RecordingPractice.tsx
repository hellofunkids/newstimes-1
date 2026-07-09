"use client";

import { useEffect, useRef, useState } from "react";
import { scoreTranscript, type ScoreResult } from "@/lib/scoring/diff";

type Status = "idle" | "recording" | "scoring" | "done" | "unsupported";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function RecordingPractice({
  articleId,
  script,
}: {
  articleId: string;
  script: string;
}) {
  // 서버 렌더링과 첫 클라이언트 렌더링을 동일하게 맞추기 위해, 브라우저
  // 지원 여부는 마운트 이후에만 확인합니다 (hydration mismatch 방지).
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setStatus("unsupported");
    }
  }, []);

  const [liveTranscript, setLiveTranscript] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const finalTranscriptRef = useRef("");
  const pendingRef = useRef({ transcriptDone: false, audioDone: false });

  async function finishRecording() {
    const transcript = finalTranscriptRef.current.trim();
    const audioBase64 = audioChunksRef.current.length
      ? await blobToBase64(new Blob(audioChunksRef.current, { type: "audio/webm" }))
      : null;

    setAudioUrl(audioBase64);
    const score = scoreTranscript(script, transcript);
    setResult(score);

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, transcript, audioData: audioBase64 }),
      });
      const data = await res.json();
      setFeedback(data.feedback ?? null);
    } catch {
      setFeedback(null);
    }
    setStatus("done");
  }

  function maybeFinish() {
    if (pendingRef.current.transcriptDone && pendingRef.current.audioDone) {
      setStatus("scoring");
      finishRecording();
    }
  }

  async function start() {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    finalTranscriptRef.current = "";
    audioChunksRef.current = [];
    pendingRef.current = { transcriptDone: false, audioDone: false };
    setLiveTranscript("");
    setResult(null);
    setFeedback(null);
    setAudioUrl(null);
    setStatus("recording");

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const alt = result[0];
        if (!alt) continue;
        if (result.isFinal) {
          finalTranscriptRef.current += alt.transcript + " ";
        } else {
          interim += alt.transcript;
        }
      }
      setLiveTranscript((finalTranscriptRef.current + interim).trim());
    };

    recognition.onerror = () => {
      pendingRef.current.transcriptDone = true;
      maybeFinish();
    };

    recognition.onend = () => {
      pendingRef.current.transcriptDone = true;
      maybeFinish();
    };

    recognitionRef.current = recognition;
    recognition.start();

    // 녹음 파일 저장(선택 사항): 마이크 권한이 없거나 MediaRecorder를 지원하지
    // 않는 브라우저에서도 음성 인식 채점은 그대로 동작하도록 실패를 무시합니다.
    if (typeof MediaRecorder !== "undefined") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          pendingRef.current.audioDone = true;
          maybeFinish();
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      } catch {
        pendingRef.current.audioDone = true;
      }
    } else {
      pendingRef.current.audioDone = true;
    }
  }

  function stop() {
    recognitionRef.current?.stop();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    } else {
      pendingRef.current.audioDone = true;
      maybeFinish();
    }
  }

  function retry() {
    setResult(null);
    setFeedback(null);
    setLiveTranscript("");
    setAudioUrl(null);
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

          {audioUrl && (
            <audio controls src={audioUrl} className="w-full">
              <track kind="captions" />
            </audio>
          )}

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
