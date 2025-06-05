// src/pages/GameScreen.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const GameScreen = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatCount = Number(queryParams.get('seats')) || 8;

  const playerName = localStorage.getItem('playerName') || 'שחקן';
  const [seats, setSeats] = useState<Array<string | null>>(Array(seatCount).fill(null));

  useEffect(() => {
    const exampleSeats = Array(seatCount).fill(null);
    exampleSeats[Math.floor(Math.random() * seatCount)] = playerName;
    setSeats(exampleSeats);
  }, [playerName, seatCount]);

  const tableWidth = 700;
  const tableHeight = 450;
  const centerX = tableWidth / 2;
  const centerY = tableHeight / 2;
  const radiusX = 280;
  const radiusY = 170;

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-4">🎮 משחק בחדר {roomId}</h2>

      <div className="relative" style={{ width: tableWidth, height: tableHeight }}>
        <div
          className="absolute inset-0 bg-green-200 border-4 border-green-600"
          style={{ borderRadius: `${radiusY}px / ${radiusX}px` }}
        ></div>

        {seats.map((seat, index) => {
          const angle = (2 * Math.PI * index) / seats.length;
          const x = centerX + radiusX * Math.cos(angle);
          const y = centerY + radiusY * Math.sin(angle);

          const isSelf = seat === playerName;
          return (
            <div
              key={index}
              style={{ position: 'absolute', top: y, left: x, transform: 'translate(-50%, -50%)' }}
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-center border bg-white ${isSelf ? 'border-blue-500 font-bold' : 'border-gray-400'}`}
            >
              <div>🧍‍♂️</div>
              <div className="text-xs mt-1">{seat || 'ריק'}</div>
              {seat && (
                <div className="mt-1 text-xs">🎴 x{Math.floor(Math.random() * 10) + 1}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* קלפים אישיים */}
      <div className="mt-8 flex gap-2">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="w-16 h-24 bg-white border rounded shadow flex items-center justify-center">
            🂠
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
