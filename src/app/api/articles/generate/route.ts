import { NextResponse } from "next/server";
import {
  generateArticlesForAllCategories,
  generateArticlesForCategory,
} from "@/lib/articles/generate";
import { CATEGORIES, type Category } from "@/lib/articles/newsSource";

// 로그인이 없어진 대신, 이 엔드포인트는 뉴스/AI API 비용이 들기 때문에
// 공개 URL로 아무나 실행하지 못하도록 간단한 비밀 키로 보호합니다.
export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_TRIGGER_SECRET) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 401 });
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
