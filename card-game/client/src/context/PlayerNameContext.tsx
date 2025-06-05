import React, { createContext, useState, useEffect, useContext } from 'react';

const getStoredName = () => localStorage.getItem('playerName') || generateRandomName();
const generateRandomName = () => `שחקן${Math.floor(Math.random() * 1000)}`;

type PlayerNameContextType = {
  playerName: string;
  setPlayerName: (name: string) => void;
};

const PlayerNameContext = createContext<PlayerNameContextType | null>(null);

export const PlayerNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState(getStoredName());

  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);

  return (
    <PlayerNameContext.Provider value={{ playerName, setPlayerName }}>
      <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
        <span>👤 השם שלך:</span>
        <input
          className="border px-3 py-1 rounded text-sm"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>
      {children}
    </PlayerNameContext.Provider>
  );
};

export const usePlayerName = () => {
  const ctx = useContext(PlayerNameContext);
  if (!ctx) throw new Error('usePlayerName must be used within PlayerNameProvider');
  return ctx;
};
