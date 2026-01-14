import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Suppress noisy Telegram WebApp debug logs like:
// [Telegram.WebView] > postEvent web_app_...
(() => {
  const shouldSuppress = (args: unknown[]) => {
    const first = args[0];
    if (typeof first !== "string") return false;
    return (
      first.startsWith("[Telegram.WebView] > postEvent") ||
      first.startsWith("[Telegram.WebApp] Method") ||
      first.includes("WebAppMethodUnsupported")
    );
  };

  const wrap =
    (fn: (...args: any[]) => void) =>
    (...args: any[]) => {
      if (shouldSuppress(args)) return;
      fn(...args);
    };

  // Keep console.error intact (we want to see real errors)
  console.log = wrap(console.log.bind(console));
  console.info = wrap(console.info.bind(console));
  console.debug = wrap(console.debug.bind(console));
  console.warn = wrap(console.warn.bind(console));
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
