import * as React from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";

const pageModules = import.meta.glob("@/pages/*.tsx") as Record<string, () => Promise<{ default: React.ComponentType }>>;

const routes = Object.entries(pageModules)
  .map(([path, loader]) => {
    const name = path.split("/").pop()!.replace(/\.tsx$/, "");
    const route = name === "Index" || name === "Home" ? "/" : "/" + name.toLowerCase();
    return { name, route, Component: lazy(loader) };
  })
  .sort((a, b) => (a.route === "/" ? -1 : b.route === "/" ? 1 : a.route.localeCompare(b.route)));

export default function App() {
  return (
    <BrowserRouter>
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto max-w-screen-xl flex items-center gap-1 px-4 py-3 text-sm overflow-x-auto">
          <Link to="/" className="font-semibold mr-4 whitespace-nowrap">Proyecto</Link>
          {routes.map((r) => (
            <NavLink
              key={r.name}
              to={r.route}
              end={r.route === "/"}
              className={({ isActive }: { isActive: boolean }) =>
                "px-3 py-1.5 rounded-md whitespace-nowrap " +
                (isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60")
              }
            >
              {r.name}
            </NavLink>
          ))}
        </nav>
      </header>
      <Suspense fallback={<div className="p-8 text-muted-foreground">Cargando…</div>}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.name} path={r.route} element={<r.Component />} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
