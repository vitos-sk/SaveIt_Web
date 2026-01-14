import styled from "styled-components";

export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 2000;
`;

export const DialogCard = styled.div`
  width: calc(100% - 32px);
  max-width: 420px;
  background: rgba(57, 56, 56, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

export const DialogTitle = styled.div`
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const DialogText = styled.div`
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.45;
  text-align: center;
  margin-bottom: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const DialogButton = styled.button<{ $variant?: "danger" }>`
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  padding: 0;
  font-size: 0;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.$variant === "danger"
        ? "rgba(255, 68, 68, 0.35)"
        : "rgba(255, 255, 255, 0.18)"};
  background: ${(props) =>
    props.$variant === "danger"
      ? "rgba(255, 68, 68, 0.18)"
      : "rgba(255, 255, 255, 0.10)"};
  color: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:active {
    transform: scale(0.98);
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
    transform: none;
  }
`;

export const Spinner = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
