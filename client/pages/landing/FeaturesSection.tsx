import * as React from "react";

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-screen-xl">
        <h2 className="text-3xl font-bold text-center mb-10">Características</h2><div className="grid md:grid-cols-3 gap-6">{["Rápido","Editable","Bonito"].map((t) => (<div key={t} className="p-6 rounded-xl border bg-card"><h3 className="font-semibold mb-2">{t}</h3><p className="text-sm text-muted-foreground">Detalle.</p></div>))}</div>
      </div>
    </section>
  );
}
