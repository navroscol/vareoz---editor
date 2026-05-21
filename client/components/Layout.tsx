import * as React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/templates/landing/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1"><Outlet /></div>
    </div>
  );
}
