"use client";

import React, { useEffect, useState } from "react";
import Login from "./Login";

interface AuthGuardProps {  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (isMounted) {
          if (response.ok) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
          }
        }
      } catch {
        if (isMounted) {
          setAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px"  }}>Chargement...</div>;
  }

  if (!authenticated) {
    return <Login onLoginSuccess={() => setAuthenticated(true)} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
