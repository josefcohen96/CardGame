// src/pages/CreateGamePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGamePage = () => {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState('War');
  const [numPlayers, setNumPlayers] = useState(2);

  const handleCreate = () => {
    const roomId = Math.random().toString(36).substring(2, 7); // MOCK
    navigate(`/room/${roomId}` + `?seats=${numPlayers}`, {
      state: { gameType, numPlayers }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">🎮 צור משחק חדש</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">סוג משחק</label>
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="War">מלחמה</option>
            <option value="Cabo">קאבו</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">כמות שחקנים</label>
          <input
            type="number"
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
            min={2}
            max={6}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          צור חדר
        </button>
      </div>
    </div>
  );
};

export default CreateGamePage;
