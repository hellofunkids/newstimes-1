import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireActiveChildProfile } from "@/lib/activeProfile";
import { categoryLabel } from "@/lib/category";
import { StudySection } from "@/components/StudySection";
import { RecordingPractice } from "@/components/RecordingPractice";

type SentencePair = { en: string; ko: string };
type VocabWord = { word: string; meaning: string };

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireActiveChildProfile();
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const sentences = article.sentences as unknown as SentencePair[];
  const vocabulary = article.vocabulary as unknown as VocabWord[];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Link
          href="/home"
          className="w-fit text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          ← 목록으로
        </Link>

        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
              {categoryLabel(article.category)}
            </span>
            <h1 className="text-2xl font-bold text-slate-800">
              {article.title}
            </h1>
          </div>

          <StudySection
            sentences={sentences}
            vocabulary={vocabulary}
            level={article.level}
          />

          <RecordingPractice articleId={article.id} script={article.script} />
        </div>
      </div>
    </main>
  );
}
