import { Memory } from "../types";
import { MemoryType } from "./FilterBar";
import styled from "styled-components";
import {
  FiFileText,
  FiImage,
  FiLink,
  FiMic,
  FiMusic,
  FiSmile,
  FiVideo,
} from "react-icons/fi";

interface MemoryItemProps {
  memory: Memory;
  onClick: () => void;
}

const typeLabels: Record<MemoryType, string> = {
  idea: "Идеи",
  task: "Задачи",
  knowledge: "База",
  note: "Заметки",
  bookmark: "Закладки",
  quote: "Вдохновение",
  study: "Учеба",
  fun: "Фан",
};

// Используем те же цвета, что и в FilterBar
const typeBorderColors: Record<MemoryType, string> = {
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
const typeColors: Record<MemoryType, string> = {
  idea: "rgba(255, 193, 7, 0.15)",
  task: "rgba(76, 175, 80, 0.15)",
  knowledge: "rgba(63, 81, 181, 0.15)",
  note: "rgba(156, 39, 176, 0.15)",
  bookmark: "rgba(255, 87, 34, 0.15)",
  quote: "rgba(233, 30, 99, 0.15)",
  study: "rgba(33, 150, 243, 0.15)",
  fun: "rgba(255, 152, 0, 0.15)",
};

const Item = styled.div`
  background: transparent;
  border-left: none;
  border-right: none;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0;
  padding: 14px;
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  touch-action: manipulation;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:active {
    transform: scale(0.98);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TypeBadge = styled.span<{ type: MemoryType }>`
  background: ${(props) => typeColors[props.type]};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${(props) => typeBorderColors[props.type]};
  color: rgba(255, 255, 255, 0.95);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const DateText = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Content = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const MediaIndicator = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export function MemoryItem({ memory, onClick }: MemoryItemProps) {
  const formatDate = (date: Date | string | number) => {
    let dateObj: Date;
    if (typeof date === "number") {
      // Если это timestamp в секундах, конвертируем в миллисекунды
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
  };

  const memoryType = ((memory.category || "note") as MemoryType) || "note";
  const createdAt = memory.createdAt
    ? typeof memory.createdAt === "number"
      ? memory.createdAt > 10000000000
        ? memory.createdAt
        : memory.createdAt * 1000
      : memory.createdAt
    : Date.now();

  return (
    <Item onClick={onClick}>
      <Header>
        <TypeBadge type={memoryType}>
          {typeLabels[memoryType] || memory.category}
        </TypeBadge>
        <DateText>{formatDate(createdAt)}</DateText>
      </Header>
      <Content>{memory.title || memory.content || "Без текста"}</Content>
      {(memory.mediaType ||
        memory.type === "link" ||
        memory.openTelegramUrl ||
        memory.url) && (
        <MediaIndicator>
          {memory.mediaType === "photo" && (
            <>
              <FiImage size={14} /> Фото
            </>
          )}
          {memory.mediaType === "video" && (
            <>
              <FiVideo size={14} /> Видео
            </>
          )}
          {memory.mediaType === "voice" && (
            <>
              <FiMic size={14} /> Голосовое
            </>
          )}
          {memory.mediaType === "audio" && (
            <>
              <FiMusic size={14} /> Музыка
            </>
          )}
          {(memory.mediaType === "link" ||
            memory.type === "link" ||
            !!memory.openTelegramUrl ||
            !!memory.url) && (
            <>
              <FiLink size={14} /> Ссылка
            </>
          )}
          {memory.mediaType === "document" && (
            <>
              <FiFileText size={14} /> Документ
            </>
          )}
          {memory.mediaType === "sticker" && (
            <>
              <FiSmile size={14} /> Стикер
            </>
          )}
        </MediaIndicator>
      )}
    </Item>
  );
}
