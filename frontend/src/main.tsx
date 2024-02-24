import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { CurrencyProvider } from "./context/CurrencyContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </ThemeProvider>
);
