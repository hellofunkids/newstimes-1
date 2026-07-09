import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireActiveChildProfile } from "@/lib/activeProfile";
import { categoryLabel } from "@/lib/category";

export default async function HistoryPage() {
  const child = await requireActiveChildProfile();

  const attempts = await prisma.recordingAttempt.findMany({
    where: { childProfileId: child.id },
    include: { article: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const average =
    attempts.length === 0
      ? null
      : Math.round(
          attempts.reduce((sum, a) => sum + a.accuracyScore, 0) /
            attempts.length,
        );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            {child.name}의 연습 기록
          </h1>
          <Link
            href="/home"
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            ← 스토리 목록
          </Link>
        </div>

        {average !== null && (
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">평균 정확도</p>
            <p className="text-3xl font-bold text-sky-600">{average}점</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                  {attempt.accuracyScore}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {attempt.article.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {categoryLabel(attempt.article.category)} ·{" "}
                    {attempt.createdAt.toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
              {attempt.audioData && (
                <audio controls src={attempt.audioData} className="w-full">
                  <track kind="captions" />
                </audio>
              )}
            </div>
          ))}

          {attempts.length === 0 && (
            <p className="text-center text-slate-400">
              아직 연습 기록이 없어요. 스토리를 읽고 녹음해보세요!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
