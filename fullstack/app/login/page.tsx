"use client";

import Login from "@/components/Login";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Login onLoginSuccess={() => window.location.href = "/"} />
      </main>
      <Footer />
    </div>
  );
}
