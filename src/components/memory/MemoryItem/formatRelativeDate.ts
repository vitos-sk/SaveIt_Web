export function formatRelativeDate(date: Date | string | number): string {
  let dateObj: Date;
  if (typeof date === "number") {
    dateObj = new Date(date > 10000000000 ? date : date * 1000);
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return "Неизвестно";
  }

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  if (days < 7) return `${days} дн. назад`;
  return dateObj.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
