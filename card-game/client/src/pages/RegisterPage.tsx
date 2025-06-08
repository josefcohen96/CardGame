import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });
      if (!response.ok) throw new Error(await response.text());
      alert("נרשמת בהצלחה!");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "הרשמה נכשלה. נסה שוב.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-center">הרשמה</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">שם</label>
          <input className="w-full border rounded p-2" value={displayName}
            onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">אימייל</label>
          <input className="w-full border rounded p-2" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">סיסמה</label>
          <input className="w-full border rounded p-2" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800" type="submit">
          הירשם
        </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}
