import {
  FiFileText,
  FiImage,
  FiLink,
  FiMic,
  FiMusic,
  FiSmile,
  FiVideo,
} from "react-icons/fi";
import { Memory } from "../../../types";
import { MediaIndicator } from "./styles";

export function MemoryMediaIndicator({ memory }: { memory: Memory }) {
  const show =
    memory.mediaType || memory.type === "link" || memory.openTelegramUrl || memory.url;
  if (!show) return null;

  return (
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
  );
}
