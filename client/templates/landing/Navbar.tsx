import * as React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto max-w-screen-xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-bold text-lg">VAREOZ - Editor</Link>
        <div className="hidden md:flex gap-6 text-sm">
          <a href="#features" className="hover:text-primary">Características</a>
          <a href="#pricing" className="hover:text-primary">Precios</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
        </div>
        <Link to="/login" className="text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">Entrar</Link>
      </nav>
    </header>
  );
}
