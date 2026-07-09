import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveChildProfile } from "@/lib/activeProfile";
import { scoreTranscript } from "@/lib/scoring/diff";
import { generateFeedback } from "@/lib/articles/feedback";

export async function POST(request: Request) {
  const child = await getActiveChildProfile();
  if (!child) {
    return NextResponse.json({ error: "프로필을 선택해주세요" }, { status: 401 });
  }

  const { articleId, transcript, audioData } = (await request
    .json()
    .catch(() => ({}))) as {
    articleId?: string;
    transcript?: string;
    audioData?: string | null;
  };

  if (!articleId || typeof transcript !== "string") {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  // 너무 긴 녹음은 데이터베이스에 부담을 주므로 저장을 건너뛰어요 (채점/피드백은 정상 진행).
  const MAX_AUDIO_LENGTH = 5_000_000;
  const audioToSave =
    typeof audioData === "string" && audioData.length <= MAX_AUDIO_LENGTH
      ? audioData
      : null;

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return NextResponse.json({ error: "스토리를 찾을 수 없어요" }, { status: 404 });
  }

  const score = scoreTranscript(article.script, transcript);

  let feedback: string;
  try {
    feedback = await generateFeedback(score, child.name);
  } catch {
    feedback =
      score.accuracy >= 80
        ? "정말 잘 읽었어요! 계속 연습해봐요."
        : "좋은 시도였어요! 다시 한 번 천천히 읽어볼까요?";
  }

  await prisma.recordingAttempt.create({
    data: {
      childProfileId: child.id,
      articleId: article.id,
      transcript,
      accuracyScore: score.accuracy,
      feedback,
      audioData: audioToSave,
    },
  });

  return NextResponse.json({
    accuracy: score.accuracy,
    words: score.words,
    feedback,
  });
}
