import { Memory } from "../../../types";
import { MemoryType, typeLabels } from "../memoryType";
import { formatRelativeDate } from "./formatRelativeDate";
import { Content, DateText, Header, Item, TypeBadge } from "./styles";
import { MemoryMediaIndicator } from "./MediaIndicator";

interface MemoryItemProps {
  memory: Memory;
  onClick: () => void;
}

export function MemoryItem({ memory, onClick }: MemoryItemProps) {
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
        <DateText>{formatRelativeDate(createdAt)}</DateText>
      </Header>
      <Content>{memory.title || memory.content || "Без текста"}</Content>
      <MemoryMediaIndicator memory={memory} />
    </Item>
  );
}
