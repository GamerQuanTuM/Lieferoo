import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import "@/shared/styles/tokens.css";
import "@/shared/styles/global.css";
import { initNative } from "@/shared/native";

void initNative();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
