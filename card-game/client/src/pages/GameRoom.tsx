import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const GameRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatCount = Number(queryParams.get('seats')) || 6;

  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'שחקן';
  const [seats, setSeats] = useState(Array(seatCount).fill(null));
  const [mySeat, setMySeat] = useState<number | null>(null);

  useEffect(() => {
    const existingIndex = seats.findIndex((seat) => seat === playerName);
    if (existingIndex >= 0) setMySeat(existingIndex);
  }, [seats, playerName]);

  const handleSit = (index: number) => {
    if (seats[index] === playerName) return;

    const newSeats = [...seats];

    if (mySeat !== null) {
      newSeats[mySeat] = null;
    }

    if (newSeats[index] && newSeats[index] !== playerName) return;

    newSeats[index] = playerName;
    setSeats(newSeats);
    setMySeat(index);
  };

  const handleLeave = () => {
    if (mySeat === null) return;
    const newSeats = [...seats];
    newSeats[mySeat] = null;
    setSeats(newSeats);
    setMySeat(null);
  };

  const handleStart = () => {
    return
  };

  const radiusX = 750;
  const radiusY = 400;
  const centerX = 800;
  const centerY = 400;

  const seatPositions = Array(seatCount).fill(null).map((_, i) => {
    const angle = (2 * Math.PI * i) / seatCount;
    return {
      top: `${centerY + radiusY * Math.sin(angle)}px`,
      left: `${centerX + radiusX * Math.cos(angle)}px`
    };
  });


  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-6">🪑 חדר {roomId}</h2>

      <div className="relative w-[400px] h-[400px] sm:w-[1600px] sm:h-[800px]">
        <div className="absolute inset-0 bg-white border-4 border-green-300 rounded-full" />
        {seats.map((seat, i) => (
          <div
            key={i}
            style={{ position: 'absolute', transform: 'translate(-50%, -50%)', ...seatPositions[i] }}
            className="text-center"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border text-sm ${seat === playerName ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}>
              {seat || (
                <button className="text-blue-600 underline" onClick={() => handleSit(i)}>
                  שב כאן
                </button>
              )}
            </div>
            <div className="mt-1 text-xs">{seat}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-x-4">
        {mySeat !== null && (
          <button
            onClick={handleLeave}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            קום מהכיסא
          </button>
        )}
        {mySeat !== null && (
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            התחל משחק
          </button>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
