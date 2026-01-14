import { Memory } from "../../../types";
import { MemoryType, getCategoryLabel } from "../memoryType";
import { MemoryItem } from "../MemoryItem/MemoryItem";
import { Container, EmptyState, EmptyText, EmptyTitle, LoadingText } from "./styles";

interface MemoryListProps {
  memories: Memory[];
  filter: MemoryType | "all";
  loading: boolean;
  onMemoryClick: (memory: Memory) => void;
}

export function MemoryList({
  memories,
  filter,
  loading,
  onMemoryClick,
}: MemoryListProps) {
  const filteredMemories: Memory[] =
    filter === "all"
      ? memories
      : memories.filter((m) => (m.category || "note") === filter);

  if (loading) {
    return <LoadingText>Загрузка...</LoadingText>;
  }

  if (filteredMemories.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>
          {filter === "all"
            ? "Нет сохраненных сообщений"
            : `Нет сообщений типа "${getCategoryLabel(filter)}"`}
        </EmptyTitle>
        <EmptyText>Перешлите сообщение боту, чтобы сохранить его</EmptyText>
      </EmptyState>
    );
  }

  return (
    <Container $isEmpty={filteredMemories.length === 0}>
      {filteredMemories.map((memory) => (
        <MemoryItem
          key={memory.id}
          memory={memory}
          onClick={() => onMemoryClick(memory)}
        />
      ))}
    </Container>
  );
}
