import * as React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-muted-foreground">Página no encontrada.</p>
      <Link to="/" className="text-primary underline">Volver al inicio</Link>
    </main>
  );
}
