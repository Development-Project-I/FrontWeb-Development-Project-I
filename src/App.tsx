import { useEffect, useRef } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
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

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  if (isFullScreenRoute(pathname)) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
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
    <ToastProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
