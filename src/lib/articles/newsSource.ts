export type Headline = {
  title: string;
  description: string;
  url: string;
};

const CATEGORIES = ["world", "science", "technology", "sports"] as const;
export type Category = (typeof CATEGORIES)[number];

export async function fetchHeadlines(
  category: Category,
  pageSize = 3,
): Promise<Headline[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY가 설정되어 있지 않습니다 (.env 확인)");
  }

  // NewsAPI.org의 category는 general/world 대신 world를 world 뉴스로 다루기 위해
  // top-headlines는 'world' 카테고리를 지원하지 않으므로 everything 엔드포인트로 대체합니다.
  const params = new URLSearchParams({
    apiKey,
    language: "en",
    pageSize: String(pageSize),
    category: category === "world" ? "general" : category,
    country: "us",
  });

  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?${params.toString()}`,
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
