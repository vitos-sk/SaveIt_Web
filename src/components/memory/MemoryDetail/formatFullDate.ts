export function formatFullDate(date: Date | string | number): string {
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

  return dateObj.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
