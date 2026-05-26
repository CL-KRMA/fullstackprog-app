"use client";

import Register from "@/components/Register";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Register onRegisterSuccess={() => window.location.href = "/"} />
      </main>
      <Footer />
    </div>
  );
}
