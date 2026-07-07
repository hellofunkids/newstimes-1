import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  generateArticlesForAllCategories,
  generateArticlesForCategory,
} from "@/lib/articles/generate";
import { CATEGORIES, type Category } from "@/lib/articles/newsSource";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.parentId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { category } = (await request.json().catch(() => ({}))) as {
    category?: Category;
  };

  try {
    const created =
      category && CATEGORIES.includes(category)
        ? await generateArticlesForCategory(category)
        : await generateArticlesForAllCategories();

    return NextResponse.json({ count: created.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "생성 실패" },
      { status: 500 },
    );
  }
}
