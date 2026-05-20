import * as React from "react";
export default function FooterSection() {
  return (
    <footer className="border-t py-10 text-sm text-muted-foreground">
      <div className="mx-auto max-w-screen-xl px-6 flex justify-between">
        <span>© {new Date().getFullYear()} VAREOZ - Editor</span>
        <span>Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
