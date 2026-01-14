import { useRef, useEffect } from "react";
import styled from "styled-components";

export type MemoryType =
  | "idea"
  | "task"
  | "knowledge"
  | "note"
  | "bookmark"
  | "quote"
  | "study"
  | "fun";

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

const Container = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  margin: 12px;
  background: rgba(57, 56, 56, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: fixed;
  top: 85px;
  left: 0;
  right: 0;
  z-index: 99;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const Dot = styled.span<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => props.color};
  flex-shrink: 0;
`;

const filters: Array<{ value: MemoryType | "all"; label: string }> = [
  { value: "all", label: "Все" },
  { value: "idea", label: "Идеи" },
  { value: "task", label: "Задачи" },
  { value: "knowledge", label: "База" },
  { value: "note", label: "Заметки" },
  { value: "bookmark", label: "Закладки" },
  { value: "quote", label: "Вдохновение" },
  { value: "study", label: "Учеба" },
  { value: "fun", label: "Фан" },
];

interface FilterBarProps {
  filter: MemoryType | "all";
  onFilterChange: (filter: MemoryType | "all") => void;
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeButton = containerRef.current.querySelector(
        `button[data-active="true"]`
      ) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [filter]);

  return (
    <Container ref={containerRef}>
      {filters.map(({ value, label }) => (
        <FilterButton
          key={value}
          $active={filter === value}
          data-active={filter === value}
          onClick={() => onFilterChange(value)}
        >
          {value !== "all" && <Dot color={typeBorderColors[value as MemoryType]} />}
          {label}
        </FilterButton>
      ))}
    </Container>
  );
}
