import { useEffect, useMemo, useState } from "react";
import { getUserMemories } from "../../../services/firebaseService";
import { Memory } from "../../../types";
import { getTelegramUser } from "../../../utils/telegram";
import { FilterBar } from "../../FilterBar";
import { MemoryDetail } from "../../MemoryDetail";
import { MemoryList } from "../../MemoryList";
import { MemoryType } from "../../memory/memoryType";
import { sortMemoriesByCreatedAtDesc } from "./sortMemories";
import { Container, ErrorText, Header, LoadingText, Title } from "./styles";

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
      const t = (m.category || "note") as MemoryType;
      c[t] = (c[t] || 0) + 1;
    }
    return c;
  }, [memories]);

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
      setMemories(sortMemoriesByCreatedAtDesc(userMemories));
    } catch (err: any) {
      setError(err?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMemoryDelete = () => {
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

      {!error && <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />}

      {error && <ErrorText>{error}</ErrorText>}

      {!error && (
        <MemoryList
          memories={memories}
          filter={filter}
          loading={false}
          onMemoryClick={setSelectedMemory}
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
