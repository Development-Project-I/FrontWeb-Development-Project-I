import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { canAccessRoute, getHomeRoute } from "./config/permissions";
import { AppearanceProvider } from "./contexts/AppearanceContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AppRoutes } from "./routes/app.routes";


function isFullScreenRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signin"
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (isFullScreenRoute(pathname)) {
    if (isAuthenticated && user) {
      return <Navigate to={getHomeRoute(user.role)} replace />;
    }

    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
        <AppRoutes />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(user.role, pathname)) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-slate-950">
      <TabBar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />
        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </AppearanceProvider>
  );
}

export default App;
