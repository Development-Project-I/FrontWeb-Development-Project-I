import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "./components/Navigation/AppLayout";
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
  const { user, isAuthenticated } = useAuth();

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
    <AppLayout>
      <AppRoutes />
    </AppLayout>
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
