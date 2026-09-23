import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { initColorblind } from "./lib/colorblind";
import { initSkin } from "./lib/skin";
import { initThemeColor } from "./lib/themeColor";
import { SessionProvider } from "./lib/session.tsx";
import "./index.css";
import "./styles/newfront.css";

initSkin();
initColorblind();
initThemeColor();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
);
