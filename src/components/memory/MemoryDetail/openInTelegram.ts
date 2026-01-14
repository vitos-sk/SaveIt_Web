import { Memory } from "../../../types";

export function openMemoryInTelegram(memory: Memory, onError: (msg: string) => void) {
  if (!window.Telegram?.WebApp) {
    const candidate = (memory.openTelegramUrl || memory.url || "").trim();
    if (candidate) {
      const w = window.open(candidate, "_blank", "noopener,noreferrer");
      if (w) return;
    }

    onError("Откройте приложение внутри Telegram");
    return;
  }

  const tg = window.Telegram.WebApp as any;

  const internalChatIdFrom = (chatId: number | string): string => {
    const raw = String(chatId).replace(/^-/, "");
    return raw.startsWith("100") ? raw.slice(3) : raw;
  };

  const toTelegramWebUrl = (url: string): string | null => {
    if (/^https?:\/\/t\.me\//i.test(url)) {
      return url.replace(/^http:\/\//i, "https://");
    }

    if (!/^tg:\/\//i.test(url)) return null;

    try {
      const u = new URL(url);
      const host = (u.host || "").toLowerCase();
      const p = u.searchParams;

      if (host === "resolve") {
        const domain = p.get("domain");
        const post = p.get("post") || p.get("message");
        if (domain && post) return `https://t.me/${domain}/${post}`;
      }

      if (host === "privatepost") {
        const chat = p.get("chat");
        const post = p.get("post");
        if (chat && post) {
          const internal = internalChatIdFrom(chat);
          return `https://t.me/c/${internal}/${post}`;
        }
      }
    } catch {}

    return null;
  };

  const openTelegramLink = (link: string) => {
    if (typeof tg.openTelegramLink === "function") {
      tg.openTelegramLink(link);
      return true;
    }
    if (typeof tg.openLink === "function") {
      tg.openLink(link, { try_instant_view: false });
      return true;
    }
    return false;
  };

  const openExternalLink = (link: string) => {
    if (typeof tg.openLink === "function") {
      tg.openLink(link, { try_instant_view: false });
      return true;
    }
    return false;
  };

  if (typeof memory.openTelegramUrl === "string" && memory.openTelegramUrl.trim()) {
    const web = toTelegramWebUrl(memory.openTelegramUrl) || memory.openTelegramUrl;
    if (openTelegramLink(web)) return;
  }

  const chatId = memory.chatId;
  const messageId = memory.messageId;
  if (typeof chatId === "number" && typeof messageId === "number") {
    if (chatId < 0) {
      const clean = internalChatIdFrom(chatId);
      const link = `https://t.me/c/${clean}/${messageId}`;
      if (openTelegramLink(link)) return;
    } else {
      const deep = `tg://privatepost?chat=${chatId}&post=${messageId}`;
      if (openExternalLink(deep)) return;

      const userDeep = `tg://user?id=${chatId}`;
      if (openExternalLink(userDeep)) return;
    }
  }

  if (typeof memory.url === "string" && memory.url.trim()) {
    const maybeTelegramWeb = toTelegramWebUrl(memory.url);
    if (maybeTelegramWeb && openTelegramLink(maybeTelegramWeb)) return;
    if (/^https?:\/\//i.test(memory.url) && openExternalLink(memory.url)) return;
    if (/^tg:\/\//i.test(memory.url) && openExternalLink(memory.url)) return;
  }

  onError(
    "Не удалось открыть. Для каналов/групп нужна openTelegramUrl или (chatId<0 + messageId). Для приватных чатов Telegram не даёт ссылку на конкретное сообщение."
  );
}
