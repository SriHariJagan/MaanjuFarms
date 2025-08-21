import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContextStore from "./Store/Store.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextStore>
      <App />
    </ContextStore>
  </StrictMode>
);
