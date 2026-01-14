import { useState } from "react";
import { FiCheck, FiExternalLink, FiLoader, FiTrash2, FiX } from "react-icons/fi";
import { deleteSavedItem } from "../../../services/firebaseService";
import { Memory } from "../../../types";
import { MemoryType, typeLabels } from "../memoryType";
import {
  DialogActions,
  DialogButton,
  DialogCard,
  DialogOverlay,
  DialogText,
  DialogTitle,
  Spinner,
} from "./dialog.styles";
import {
  Body,
  CloseButton,
  Content,
  DateText,
  DragHandle,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderTopRow,
  IconButton,
  Overlay,
  Title,
  TypeBadge,
  UrlText,
} from "./sheet.styles";
import { formatFullDate } from "./formatFullDate";
import { openMemoryInTelegram } from "./openInTelegram";
import { useLockBodyScroll } from "./useLockBodyScroll";

interface MemoryDetailProps {
  memory: Memory | null;
  onClose: () => void;
  onDelete?: () => void;
}

export function MemoryDetail({ memory, onClose, onDelete }: MemoryDetailProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useLockBodyScroll(!!memory);
  if (!memory) return null;

  const closeAllDialogs = () => {
    setIsDeleteConfirmOpen(false);
    setIsErrorOpen(false);
    setErrorText("");
    setIsDeleting(false);
  };

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
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
      e.preventDefault();
      setDragY(deltaY);
    }
  };

  const handleHeaderTouchEnd = () => {
    if (dragY > 100) onClose();
    setIsDragging(false);
    setDragY(0);
    setDragStartY(0);
  };

  const handleDelete = () => setIsDeleteConfirmOpen(true);

  const confirmDelete = async () => {
    if (!memory || isDeleting) return;
    setIsDeleting(true);
    try {
      if (!memory.telegramId) {
        setErrorText("Не удалось удалить: отсутствует telegramId");
        setIsDeleteConfirmOpen(false);
        setIsErrorOpen(true);
        setIsDeleting(false);
        return;
      }
      await deleteSavedItem(memory.telegramId, memory.id);
      onDelete?.();
      closeAllDialogs();
      onClose();
    } catch {
      setErrorText("Не удалось удалить сохраненку");
      setIsDeleteConfirmOpen(false);
      setIsErrorOpen(true);
      setIsDeleting(false);
    }
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
              {typeLabels[memoryType] || memory.category}
            </TypeBadge>
          </HeaderLeft>
          <HeaderRight>
            <HeaderTopRow>
              <IconButton
                onClick={() =>
                  openMemoryInTelegram(memory, (msg) => {
                    setErrorText(msg);
                    setIsErrorOpen(true);
                  })
                }
                aria-label="Open"
                title="Open"
              >
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
            <DateText>{formatFullDate(createdAt)}</DateText>
          </HeaderRight>
        </Header>
        <Body>
          {memory.title && <Title>{memory.title}</Title>}
          <UrlText>{memory.openTelegramUrl || memory.url || memory.content}</UrlText>
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
