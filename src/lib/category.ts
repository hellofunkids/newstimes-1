export const CATEGORY_LABELS: Record<string, string> = {
  world: "월드",
  science: "과학",
  technology: "기술",
  sports: "스포츠",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
