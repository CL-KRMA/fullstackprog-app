"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setAuthenticated(true);
        setUsername(data.username);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthenticated(false);
      setUsername("");
      window.location.reload();
    } catch (error) {
      console.error("Erreur logout:", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-center">
          <Link href="/">Accueil</Link>
          <Link href="/liste">Liste d'images</Link>
          <Link href="/ajouter">Ajouter</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-right">
          {authenticated ? (
            <>
              <span style={{ marginRight: "15px" }}>
                Welcome, <strong>{username}</strong> 👤
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ marginRight: "15px", textDecoration: "none", color: "white" }}>Connexion</Link>
              <Link href="/register" style={{ textDecoration: "none", color: "white" }}>Inscription</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}