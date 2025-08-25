import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContextState from "./Context/contextState.jsx";

createRoot(document.getElementById("root")).render(
  <ContextState>
    <App />
  </ContextState>
);
