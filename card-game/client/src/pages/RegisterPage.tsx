// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "שגיאה בהרשמה");
      }
    } catch (err) {
      setError("שגיאת שרת");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">הרשמה</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">שם משתמש</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
        </div>
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
          className="bg-green-600 text-white py-2 rounded w-full hover:bg-green-800"
        >
          הירשם
        </button>
      </form>
    </div>
  );
}
