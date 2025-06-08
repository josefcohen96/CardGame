// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // קריאה ל-API שלך
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (res.ok && data.token) {
        login(data.token);
        navigate("/");
      } else {
        setError(data.message || "שגיאה בהתחברות");
      }
    } catch (err) {
      setError("שגיאה בשרת");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">התחברות</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">אימייל</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div>
          <label className="block mb-1">סיסמה</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-800"
        >
          התחבר
        </button>
        <p className="text-center text-sm mt-4">
          אין לך חשבון?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            הירשם עכשיו
          </a>
        </p>
      </form>
    </div>
  );
}
