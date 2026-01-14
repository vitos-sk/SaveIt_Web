import { Memory } from "../../../types";

function toTimestamp(date: string | number | undefined): number {
  if (!date) return 0;
  if (typeof date === "number") {
    return date > 10000000000 ? date : date * 1000;
  }
  const parsed = new Date(date).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export function sortMemoriesByCreatedAtDesc(memories: Memory[]): Memory[] {
  return memories.sort((a, b) => {
    const dateA = toTimestamp(a.createdAt);
    const dateB = toTimestamp(b.createdAt);
    return dateB - dateA;
  });
}
