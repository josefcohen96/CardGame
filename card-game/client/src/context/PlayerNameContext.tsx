import React, { createContext, useState, useEffect, useContext } from "react";

const generateRandomName = () => `שחקן${Math.floor(Math.random() * 1000)}`;
const getStoredName = () => localStorage.getItem("playerName") || generateRandomName();
type PlayerNameContextType = {
  playerName: string;
  setPlayerName: (name: string) => void;
};
const PlayerNameContext = createContext<PlayerNameContextType | null>(null);

export const PlayerNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState(getStoredName());

  useEffect(() => {
    localStorage.setItem("playerName", playerName);
  }, [playerName]);

  return (
    <PlayerNameContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerNameContext.Provider>
  );
};

export const usePlayerName = () => {
  const ctx = useContext(PlayerNameContext);
  if (!ctx) throw new Error("usePlayerName must be used within PlayerNameProvider");
  return ctx;
};
