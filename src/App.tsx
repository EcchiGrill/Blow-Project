import { Route, Routes, useLocation } from "react-router-dom";
import Profile from "@/components/profile/profile";
import Feed from "@/components/feed/feed";
import Home from "@/components/home/home";
import Settings from "@/components/settings";
import Login from "@/components/auth/login";
import NavMenu from "@/components/nav/nav-menu";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import OTPConfirm from "./components/auth/otp-confirm";
import Register from "./components/auth/register";
import { useUser } from "./lib/hooks/useUser";
import ErrorBoundary from "./components/404/error-boundary";
import MyProfile from "./components/profile/my-profile";
import ResetPassword from "./components/reset-password";

function App() {
  const location = useLocation();
  const { isBackToLogin, isOTPConfirm, isLogged, isReset } = useUser();

  const routes = [
    {
      path: "/",
      element: Home,
      children: [
        { path: "login", element: Login, condition: true },
        { path: "reset-password", element: ResetPassword, condition: true },
      ],
    },
    {
      path: "register",
      element: Register,
      children: [
        {
          path: "confirmation",
          element: OTPConfirm,
          condition: isOTPConfirm,
        },
      ],
    },
    { path: "feed", element: Feed },
    { path: "/feed/:postlink", element: Feed },
    { path: "profile", element: MyProfile },
    { path: "/profile/:userlink", element: Profile },
    { path: "settings", element: Settings },
    { path: "*", element: ErrorBoundary },
  ];

  const isLogin =
    (location.state && location.state.login) || location.pathname === "/login";

  const isResetting =
    (location.state && location.state.reset) ||
    location.pathname === "/reset-password";

  const isRegister =
    (location.state && location.state.register) ||
    location.pathname === "/register" ||
    isBackToLogin;

  const isConfirm =
    (location.state && location.state.register) ||
    location.pathname === "/register/confirmation";

  return (
    <>
      <div className="grid h-full max-lg:w-screen lg:grid-cols-1/10fr ">
        <NavMenu />
        <Routes
          location={
            isRegister || isLogin || isResetting || isConfirm || location
          }
        >
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={`${route.path}`}
                element={<route.element />}
              >
                {route.children &&
                  route.children.map(
                    (r) =>
                      r.condition && (
                        <Route
                          key={r.path}
                          path={`${r.path}`}
                          element={<r.element />}
                        />
                      )
                  )}
              </Route>
            );
          })}
        </Routes>

        {isResetting && isReset && (
          <Routes>
            <Route path="reset-password" element={<ResetPassword />} />
          </Routes>
        )}

        {isLogin && !isLogged && (
          <Routes>
            <Route path="login" element={<Login />} />
          </Routes>
        )}
        {(isRegister || isConfirm) && !isLogged && (
          <Routes>
            <Route path="register" element={<Register />}>
              {isOTPConfirm && (
                <Route path="confirmation" element={<OTPConfirm />} />
              )}
            </Route>
          </Routes>
        )}
        <Toaster />
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
