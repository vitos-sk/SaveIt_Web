import { useEffect } from "react";
import { DataViewer } from "./components/DataViewer";
import { initTelegramWebApp } from "./utils/telegram";

function App() {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return <DataViewer />;
}

export default App;
