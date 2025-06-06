import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GAMES = [
  { type: "war", label: "מלחמה", icon: "🎲" },
  { type: "durak", label: "דוראק", icon: "🃏" },
];

const GameFab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (type: string) => {
    navigate(`/create?type=${type}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {open &&
          GAMES.map((game, index) => (
            <button
              key={game.type}
              onClick={() => handleCreate(game.type)}
              className={`absolute right-0 mb-2 w-48 p-2 bg-white text-sm rounded shadow hover:bg-gray-100 border transition-all duration-200 ${
                index === 0 ? "bottom-16" : "bottom-28"
              }`}
            >
              <span className="text-xl mr-2">{game.icon}</span>
              {game.label}
            </button>
          ))}

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white text-3xl shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default GameFab;
