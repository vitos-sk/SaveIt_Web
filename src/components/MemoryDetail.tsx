import { useState, useEffect } from "react";
import { Memory } from "../types";
import { MemoryType } from "./FilterBar";
import styled from "styled-components";
import { deleteLink } from "../services/firebaseService";
import { FiCheck, FiExternalLink, FiLoader, FiTrash2, FiX } from "react-icons/fi";

interface MemoryDetailProps {
  memory: Memory | null;
  onClose: () => void;
  onDelete?: () => void;
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Content = styled.div<{ $isDragging?: boolean; $dragY?: number }>`
  background: rgba(20, 20, 20, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  width: 100%;
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: ${(props) =>
    props.$isDragging ? "none" : "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"};
  overflow: hidden;
  position: relative;
  transform: ${(props) =>
    props.$isDragging && props.$dragY
      ? `translateY(${Math.max(0, props.$dragY)}px)`
      : "translateY(0)"};
  transition: ${(props) => (props.$isDragging ? "none" : "transform 0.2s ease-out")};

  /* более “стеклянный” вид */
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.35);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 12px auto 16px;
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  touch-action: pan-y;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TypeBadge = styled.span<{ type: MemoryType }>`
  background: ${(props) => typeColors[props.type]};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${(props) => typeBorderColors[props.type]};
  color: rgba(255, 255, 255, 0.95);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
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

// Иконки без фона/обводок (как просил)
const IconButton = styled.button<{ $variant?: "danger" }>`
  background: transparent;
  border: none;
  padding: 0;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$variant === "danger" ? "rgba(255, 68, 68, 0.95)" : "rgba(255, 255, 255, 0.9)"};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:active {
    opacity: 0.65;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  overscroll-behavior: contain;
  min-height: 0;
`;

const Title = styled.h3`
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  word-wrap: break-word;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const UrlText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  word-break: break-all;
  line-height: 1.5;
  margin-bottom: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

// (нижние Actions убраны — кнопки перенесены наверх)

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.6;
  }
`;

export function MemoryDetail({ memory, onClose, onDelete }: MemoryDetailProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const closeAllDialogs = () => {
    setIsDeleteConfirmOpen(false);
    setIsErrorOpen(false);
    setErrorText("");
    setIsDeleting(false);
  };

  // Блокируем скролл body когда открыт MemoryDetail
  useEffect(() => {
    if (memory) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      // Блокируем скролл
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      // Блокируем скролл на уровне html
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.width = "100%";

      return () => {
        // Восстанавливаем скролл при закрытии
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.position = "";
        document.documentElement.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [memory]);

  if (!memory) return null;

  // Обработчики для верхней части (DragHandle + Header) - свайп для закрытия
  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    // Если тапаем по кнопкам (Open/Delete/Close) — не начинаем drag (иначе клики не сработают)
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    const touch = e.touches[0];
    setDragStartY(touch.clientY);
    setIsDragging(true);
  };

  const handleHeaderTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - dragStartY;
    if (deltaY > 0) {
      // Предотвращаем скролл только когда реально тянем вниз
      e.preventDefault();
      setDragY(deltaY);
    }
  };

  const handleHeaderTouchEnd = () => {
    if (dragY > 100) {
      // Если свайпнули больше 100px, закрываем
      onClose();
    }
    setIsDragging(false);
    setDragY(0);
    setDragStartY(0);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!memory || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteLink(memory.id);
      if (onDelete) onDelete();
      closeAllDialogs();
      onClose();
    } catch (error) {
      setErrorText("Не удалось удалить сохраненку");
      setIsDeleteConfirmOpen(false);
      setIsErrorOpen(true);
      setIsDeleting(false);
    }
  };

  const handleOpenInTelegram = () => {
    const url = memory.url || memory.content;
    if (!url) return;

    // Для деплоя: открываем только в Telegram и только Telegram-ссылки
    if (!window.Telegram?.WebApp) {
      setErrorText("Откройте приложение внутри Telegram");
      setIsErrorOpen(true);
      return;
    }

    const isTelegramLink = /^https?:\/\/t\.me\//i.test(url);
    if (!isTelegramLink) {
      setErrorText("Эта ссылка откроется только в Telegram (t.me)");
      setIsErrorOpen(true);
      return;
    }

    const tg = window.Telegram.WebApp as any;
    if (typeof tg.openTelegramLink === "function") {
      tg.openTelegramLink(url);
      return;
    }
    if (typeof tg.openLink === "function") {
      tg.openLink(url, { try_instant_view: false });
      return;
    }

    setErrorText("Не удалось открыть ссылку в Telegram");
    setIsErrorOpen(true);
  };

  const formatDate = (date: Date | string | number) => {
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
  };

  const memoryType = (memory.type as MemoryType) || "note";
  const createdAt = memory.createdAt
    ? typeof memory.createdAt === "number"
      ? memory.createdAt > 10000000000
        ? memory.createdAt
        : memory.createdAt * 1000
      : memory.createdAt
    : Date.now();

  return (
    <Overlay onClick={onClose}>
      <Content
        onClick={(e) => e.stopPropagation()}
        $isDragging={isDragging}
        $dragY={dragY}
      >
        <DragHandle
          onTouchStart={handleHeaderTouchStart}
          onTouchMove={handleHeaderTouchMove}
          onTouchEnd={handleHeaderTouchEnd}
        />
        <Header
          onTouchStart={handleHeaderTouchStart}
          onTouchMove={handleHeaderTouchMove}
          onTouchEnd={handleHeaderTouchEnd}
        >
          <HeaderLeft>
            <TypeBadge type={memoryType}>
              {typeLabels[memoryType] || memory.type}
            </TypeBadge>
          </HeaderLeft>
          <HeaderRight>
            <HeaderTopRow>
              <IconButton onClick={handleOpenInTelegram} aria-label="Open" title="Open">
                <FiExternalLink size={18} />
              </IconButton>
              <IconButton
                $variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </IconButton>
              <CloseButton onClick={onClose}>×</CloseButton>
            </HeaderTopRow>
            <DateText>{formatDate(createdAt)}</DateText>
          </HeaderRight>
        </Header>
        <Body>
          {memory.title && <Title>{memory.title}</Title>}
          <UrlText>{memory.url || memory.content}</UrlText>
        </Body>
      </Content>

      {(isDeleteConfirmOpen || isErrorOpen) && (
        <DialogOverlay
          onClick={() => {
            if (!isDeleting) closeAllDialogs();
          }}
        >
          <DialogCard onClick={(e) => e.stopPropagation()}>
            <DialogTitle>{isDeleteConfirmOpen ? "Удалить?" : "Ошибка"}</DialogTitle>
            <DialogText>
              {isDeleteConfirmOpen
                ? "Удалить эту сохраненку навсегда?"
                : errorText || "Что-то пошло не так"}
            </DialogText>
            <DialogActions>
              {isDeleteConfirmOpen ? (
                <>
                  <DialogButton
                    onClick={() => closeAllDialogs()}
                    disabled={isDeleting}
                    aria-label="Cancel"
                    title="Cancel"
                  >
                    <FiX size={18} />
                  </DialogButton>
                  <DialogButton
                    $variant="danger"
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    aria-label="Delete"
                    title="Delete"
                  >
                    {isDeleting ? (
                      <Spinner>
                        <FiLoader size={18} />
                      </Spinner>
                    ) : (
                      <FiTrash2 size={18} />
                    )}
                  </DialogButton>
                </>
              ) : (
                <DialogButton
                  onClick={() => closeAllDialogs()}
                  aria-label="OK"
                  title="OK"
                >
                  <FiCheck size={18} />
                </DialogButton>
              )}
            </DialogActions>
          </DialogCard>
        </DialogOverlay>
      )}
    </Overlay>
  );
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2000;
`;

const DialogCard = styled.div`
  width: calc(100% - 32px);
  max-width: 420px;
  background: rgba(57, 56, 56, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const DialogTitle = styled.div`
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const DialogText = styled.div`
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.45;
  text-align: center;
  margin-bottom: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const DialogButton = styled.button<{ $variant?: "danger" }>`
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  padding: 0;
  font-size: 0;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.$variant === "danger"
        ? "rgba(255, 68, 68, 0.35)"
        : "rgba(255, 255, 255, 0.18)"};
  background: ${(props) =>
    props.$variant === "danger"
      ? "rgba(255, 68, 68, 0.18)"
      : "rgba(255, 255, 255, 0.10)"};
  color: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:active {
    transform: scale(0.98);
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
    transform: none;
  }
`;

const Spinner = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
