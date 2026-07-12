export type Headline = {
  title: string;
  description: string;
  url: string;
};

const CATEGORIES = [
  "culture",
  "kpop",
  "kart",
  "literature",
  "quotes",
  "heroes",
] as const;
export type Category = (typeof CATEGORIES)[number];

// 이 6개 주제는 NewsAPI의 기본 카테고리(business/entertainment/...)에 없어서
// top-headlines 대신 검색어 기반의 everything 엔드포인트를 사용합니다.
const CATEGORY_QUERIES: Record<Category, string> = {
  culture: "Korean culture OR Korean tradition",
  kpop: "K-pop",
  kart: "Korean art OR Korean artist",
  literature: "Korean literature OR classic novel",
  quotes: "inspiring quote OR famous saying",
  heroes: "inspiring people OR unsung hero",
};

export async function fetchHeadlines(
  category: Category,
  pageSize = 3,
): Promise<Headline[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY가 설정되어 있지 않습니다 (.env 확인)");
  }

  const params = new URLSearchParams({
    apiKey,
    language: "en",
    pageSize: String(pageSize),
    sortBy: "relevancy",
    q: CATEGORY_QUERIES[category],
  });

  const res = await fetch(
    `https://newsapi.org/v2/everything?${params.toString()}`,
  );
  if (!res.ok) {
    throw new Error(`NewsAPI 요청 실패: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return (data.articles ?? [])
    .filter((a: { title?: string }) => a.title)
    .map((a: { title: string; description?: string; url: string }) => ({
      title: a.title,
      description: a.description ?? "",
      url: a.url,
    }));
}

export { CATEGORIES };
