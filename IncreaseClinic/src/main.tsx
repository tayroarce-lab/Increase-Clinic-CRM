import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/Global.css";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render( /*Asegura que el elemento root exista antes de renderizar*/
  <StrictMode>
    <App />
  </StrictMode>
);
