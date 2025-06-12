// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type UserInfo = {
  userId: number;
  email: string;
  displayName: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserInfo | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// פונקציה קטנה לפענח payload של JWT (ללא אימות חתימה)
function decodeJwt<T = any>(token: string): T | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  /** נשמר token  ומעדכן state */
  const handleToken = (token: string | null) => {
    if (token) {
      const payload = decodeJwt<UserInfo & { exp: number }>(token);
      if (payload) {
        setUser({
          userId: payload.userId,
          email: payload.email,
          displayName: payload.displayName,
        });
        setIsLoggedIn(true);
      } else {
        // טוקן פגום
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    handleToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    handleToken(null);
  };

  /* טעינת token שקיים עם רענון הדפדפן */
  useEffect(() => {
    handleToken(localStorage.getItem("token"));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
