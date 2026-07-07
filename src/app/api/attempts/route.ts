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

  const { articleId, transcript } = (await request.json().catch(() => ({}))) as {
    articleId?: string;
    transcript?: string;
  };

  if (!articleId || typeof transcript !== "string") {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

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
    },
  });

  return NextResponse.json({
    accuracy: score.accuracy,
    words: score.words,
    feedback,
  });
}
