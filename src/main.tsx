import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/main.css";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.tsx";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthProvider from "./provider/auth-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
