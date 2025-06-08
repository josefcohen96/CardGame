import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error(await response.text());
      // כאן בעתיד: שמור token/session וכו'
      alert("התחברת בהצלחה!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "התחברות נכשלה. בדוק אימייל וסיסמה.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-center">התחברות</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
          התחבר
        </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}
