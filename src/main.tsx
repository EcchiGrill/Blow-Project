import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Profile } from "@/components/profile.tsx";
import App from "@/App.tsx";
import Home from "@/components/home.tsx";
import ErrorBoundary from "@/404/error-boundary.tsx";
import Settings from "@/components/settings";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Feed } from "./components/feed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
