import styled from "styled-components";

export const Bar = styled.div`
  display: flex;
  padding: 6px 10px;
  margin: 10px 12px;
  background: rgba(57, 56, 56, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 99;
`;

export const Scroll = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Track = styled.div`
  position: relative;
  display: flex;
  gap: 6px;
  align-items: center;
  width: max-content;
  min-width: 100%;
  padding: 2px 2px;
`;

export const ActivePill = styled.div<{ $x: number; $w: number; $visible: boolean }>`
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 0;
  width: ${(p) => p.$w}px;
  transform: translateX(${(p) => p.$x}px);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: transform 240ms cubic-bezier(0.2, 0.9, 0.2, 1),
    width 240ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 160ms ease-out;
  will-change: transform, width, opacity;
  pointer-events: none;
  z-index: 0;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  padding: 6px 12px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
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

export const Dot = styled.span<{ color: string }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(props) => props.color};
  flex-shrink: 0;
`;

export const CountBadge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;
