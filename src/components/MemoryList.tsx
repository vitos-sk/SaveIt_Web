import { Memory } from "../types";
import { MemoryItem } from "./MemoryItem";
import { MemoryType } from "./FilterBar";
import styled from "styled-components";

const getCategoryLabel = (type: MemoryType | "all"): string => {
  const labels: Record<MemoryType | "all", string> = {
    all: "Все",
    idea: "Идеи",
    task: "Задачи",
    knowledge: "База",
    note: "Заметки",
    bookmark: "Закладки",
    quote: "Вдохновение",
    study: "Учеба",
    fun: "Фан",
  };
  return labels[type] || type;
};

const Container = styled.div<{ $isEmpty: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  padding-top: 175px;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  user-select: auto;
  min-height: calc(100vh - 150px);
  position: relative;
  z-index: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const EmptyState = styled.div`
  position: fixed;
  top: calc(50% + 25px);
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  width: 90%;
  max-width: 400px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const LoadingText = styled.div`
  position: fixed;
  top: calc(50% + 25px);
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  z-index: 50;
`;

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
      : memories.filter((memory) => (memory.category || "note") === filter);

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
