import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DirectionProvider } from "@radix-ui/react-direction";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // 🚨 StrictMode 유지 가능하지만, 문제가 지속된다면 제거해도 됨.
    <DirectionProvider dir="ltr">
      <App />
    </DirectionProvider>

);
