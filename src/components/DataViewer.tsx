import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { getUserMemories } from "../services/firebaseService";
import { Memory } from "../types";
import { getTelegramUser } from "../utils/telegram";
import { FilterBar, MemoryType } from "./FilterBar";
import { MemoryList } from "./MemoryList";
import { MemoryDetail } from "./MemoryDetail";

const Container = styled.div`
  min-height: 100vh;
  color: #ffffff;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`;

const Header = styled.div`
  position: fixed;
  top: 25px;
  left: 0;
  right: 0;
  background: transparent;
  padding: 12px 16px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const LoadingText = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

const ErrorText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 68, 68, 0.95);
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  max-width: 90%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  z-index: 300;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

export function DataViewer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filter, setFilter] = useState<MemoryType | "all">("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const telegramUser = getTelegramUser();

  const counts = useMemo(() => {
    const c: Partial<Record<MemoryType | "all", number>> = { all: memories.length };
    for (const m of memories) {
      const t = m.type as MemoryType;
      c[t] = (c[t] || 0) + 1;
    }
    return c;
  }, [memories]);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!telegramUser) {
        setError("Откройте приложение внутри Telegram");
        return;
      }

      const telegramId = telegramUser.id;
      const userMemories = await getUserMemories(telegramId);

      // Сортируем по дате создания (новые сверху)
      const sortedMemories = userMemories.sort((a, b) => {
        const getTimestamp = (date: string | number | undefined): number => {
          if (!date) return 0;
          if (typeof date === "number") {
            // Если это timestamp в секундах, конвертируем в миллисекунды
            return date > 10000000000 ? date : date * 1000;
          }
          const parsed = new Date(date).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        const dateA = getTimestamp(a.createdAt);
        const dateB = getTimestamp(b.createdAt);
        return dateB - dateA;
      });
      setMemories(sortedMemories);
    } catch (err: any) {
      setError(err?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleMemoryDelete = () => {
    // Перезагружаем список после удаления
    loadMemories();
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>SaveIt</Title>
        </Header>
        <LoadingText>Загрузка...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>SaveIt</Title>
      </Header>

      {!error && <FilterBar filter={filter} onFilterChange={setFilter} />}
      {!error && <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />}

      {error && <ErrorText>{error}</ErrorText>}

      {!error && (
        <MemoryList
          memories={memories}
          filter={filter}
          loading={false}
          onMemoryClick={handleMemoryClick}
        />
      )}

      <MemoryDetail
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onDelete={handleMemoryDelete}
      />
    </Container>
  );
}
