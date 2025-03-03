"use client";
import About from "@/components/landing/About";
import Contacto from "@/components/landing/Contacto";
import Footer from "@/components/landing/Footer";
import Home from "@/components/landing/Home";
import Navbar from "@/components/landing/Navbar";
import { useState } from "react";

export default function Page() {
  const [view, setView] = useState("home");

  return (
    <div>
      <Navbar view={view} setView={setView} />
      <div>
        {view === "home" && <Home />}
        {view === "about" && <About />}
        {view === "contact" && <Contacto />}
      </div>
      <Footer />
    </div>
  );
}
