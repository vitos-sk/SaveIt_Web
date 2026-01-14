import styled from "styled-components";
import { MemoryType, typeBorderColors, typeColors } from "../memoryType";

export const Overlay = styled.div`
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

export const Content = styled.div<{ $isDragging?: boolean; $dragY?: number }>`
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

export const DragHandle = styled.div`
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

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  touch-action: pan-y;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

export const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const TypeBadge = styled.span<{ type: MemoryType }>`
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

export const DateText = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const IconButton = styled.button<{ $variant?: "danger" }>`
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

export const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  overscroll-behavior: contain;
  min-height: 0;
`;

export const Title = styled.h3`
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

export const UrlText = styled.div`
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

export const CloseButton = styled.button`
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
