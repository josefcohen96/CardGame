// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-blue-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">🎴 ברוך הבא למשחק</h1>
      <div className="space-x-4">
        <button onClick={() => navigate('/create')}  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          צור משחק חדש
        </button>
        <button onClick={() => navigate('/join')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          הצטרף למשחק קיים
        </button>
      </div>
    </div>
  );
};

export default HomePage;
