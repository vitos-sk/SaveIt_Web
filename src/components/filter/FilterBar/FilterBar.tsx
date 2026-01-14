import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { MemoryType, typeBorderColors } from "../../memory/memoryType";
import { ActivePill, Bar, CountBadge, Dot, FilterButton, Scroll, Track } from "./styles";

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
  counts?: Partial<Record<MemoryType | "all", number>>;
}

export function FilterBar({ filter, onFilterChange, counts }: FilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number; visible: boolean }>({
    x: 0,
    w: 0,
    visible: false,
  });

  const updatePill = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const activeButton = track.querySelector(
      `button[data-active="true"]`
    ) as HTMLElement | null;
    if (!activeButton) return;

    const x = activeButton.offsetLeft;
    const w = activeButton.offsetWidth;
    setPill({ x, w, visible: true });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const activeButton = track.querySelector(
      `button[data-active="true"]`
    ) as HTMLElement | null;
    if (!activeButton) return;

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [filter]);

  useLayoutEffect(() => {
    updatePill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, counts]);

  useEffect(() => {
    const onResize = () => updatePill();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updatePill]);

  return (
    <Bar>
      <Scroll ref={scrollRef}>
        <Track ref={trackRef}>
          <ActivePill $x={pill.x} $w={pill.w} $visible={pill.visible} />
          {filters.map(({ value, label }) => (
            <FilterButton
              key={value}
              $active={filter === value}
              data-active={filter === value}
              onClick={() => onFilterChange(value)}
            >
              {value !== "all" && <Dot color={typeBorderColors[value as MemoryType]} />}
              {label}
              {!!counts?.[value] && counts[value]! > 0 && (
                <CountBadge>{counts[value]}</CountBadge>
              )}
            </FilterButton>
          ))}
        </Track>
      </Scroll>
    </Bar>
  );
}
