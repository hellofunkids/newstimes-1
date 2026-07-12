export const CATEGORY_LABELS: Record<string, string> = {
  culture: "문화",
  kpop: "K-pop",
  kart: "K-아트",
  literature: "문학",
  quotes: "명언",
  heroes: "위인 이야기",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
