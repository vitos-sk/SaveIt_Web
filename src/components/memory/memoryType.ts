export type MemoryType =
  | "idea"
  | "task"
  | "knowledge"
  | "note"
  | "bookmark"
  | "quote"
  | "study"
  | "fun";

export const typeLabels: Record<MemoryType, string> = {
  idea: "Идеи",
  task: "Задачи",
  knowledge: "База",
  note: "Заметки",
  bookmark: "Закладки",
  quote: "Вдохновение",
  study: "Учеба",
  fun: "Фан",
};

// Используем те же цвета, что и раньше (из старых компонентов)
export const typeBorderColors: Record<MemoryType, string> = {
  idea: "rgba(255, 193, 7, 0.6)",
  task: "rgba(76, 175, 80, 0.6)",
  knowledge: "rgba(63, 81, 181, 0.6)",
  note: "rgba(156, 39, 176, 0.6)",
  bookmark: "rgba(255, 87, 34, 0.6)",
  quote: "rgba(233, 30, 99, 0.6)",
  study: "rgba(33, 150, 243, 0.6)",
  fun: "rgba(255, 152, 0, 0.6)",
};

// Цвета фона на основе цветов границ (более прозрачные)
export const typeColors: Record<MemoryType, string> = {
  idea: "rgba(255, 193, 7, 0.15)",
  task: "rgba(76, 175, 80, 0.15)",
  knowledge: "rgba(63, 81, 181, 0.15)",
  note: "rgba(156, 39, 176, 0.15)",
  bookmark: "rgba(255, 87, 34, 0.15)",
  quote: "rgba(233, 30, 99, 0.15)",
  study: "rgba(33, 150, 243, 0.15)",
  fun: "rgba(255, 152, 0, 0.15)",
};

export function getCategoryLabel(type: MemoryType | "all"): string {
  const labels: Record<MemoryType | "all", string> = {
    all: "Все",
    ...typeLabels,
  };
  return labels[type] || type;
}
