import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { initColorblind } from "./lib/colorblind";
import { initSkin } from "./lib/skin";
import { initThemeMode } from "./lib/themeMode";
import { SessionProvider } from "./lib/session.tsx";
import "./index.css";
import "./styles/newfront.css";

initSkin();
initThemeMode();
initColorblind();
try {
  localStorage.removeItem("happy-learn-theme-color");
} catch {
  /* ignore */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
);
