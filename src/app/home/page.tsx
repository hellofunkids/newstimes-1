import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireActiveChildProfile } from "@/lib/activeProfile";
import { categoryLabel } from "@/lib/category";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const child = await requireActiveChildProfile();
  const { category } = await searchParams;

  const articles = await prisma.article.findMany({
    where: {
      level: child.level,
      ...(category ? { category } : {}),
    },
    orderBy: { publishedAt: "desc" },
  });

  const categories = await prisma.article.findMany({
    where: { level: child.level },
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <header className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow">
            {child.avatar ?? "🙂"}
          </span>
          <div>
            <p className="font-semibold text-slate-800">{child.name}</p>
            <p className="text-sm text-slate-500">최신 영어 스토리</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/history"
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            연습 기록
          </Link>
          <Link
            href="/profiles"
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            프로필 전환
          </Link>
        </div>
      </header>

      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap gap-2">
        <Link
          href="/home"
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !category
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-600 shadow-sm"
          }`}
        >
          전체
        </Link>
        {categories.map(({ category: c }) => (
          <Link
            key={c}
            href={`/home?category=${c}`}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === c
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 shadow-sm"
            }`}
          >
            {categoryLabel(c)}
          </Link>
        ))}
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <span className="w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
              {categoryLabel(article.category)}
            </span>
            <h2 className="font-semibold text-slate-800">{article.title}</h2>
            <p className="line-clamp-2 text-sm text-slate-500">
              {article.script}
            </p>
          </Link>
        ))}

        {articles.length === 0 && (
          <p className="col-span-full text-center text-slate-400">
            아직 이 레벨의 스토리가 없어요. 조금만 기다려주세요!
          </p>
        )}
      </div>
    </main>
  );
}
