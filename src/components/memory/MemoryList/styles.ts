import styled from "styled-components";

export const Container = styled.div<{ $isEmpty: boolean }>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  padding-top: 160px;
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

export const EmptyState = styled.div`
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

export const EmptyTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const LoadingText = styled.div`
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
