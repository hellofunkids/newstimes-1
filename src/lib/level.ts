import { Level } from "@prisma/client";

export const LEVELS: { value: Level; label: string; emoji: string }[] = [
  { value: "ELEMENTARY", label: "초등부", emoji: "🐣" },
  { value: "MIDDLE", label: "중등부", emoji: "🦉" },
  { value: "JUNIOR", label: "주니어", emoji: "🚀" },
];

export function levelLabel(level: Level): string {
  return LEVELS.find((l) => l.value === level)?.label ?? level;
}
