import React from 'react';
import { useNavigate } from 'react-router-dom';

const JoinGamePage = () => {
  const navigate = useNavigate();

  const fakeRooms = ['abc12', 'xyz34']; // MOCK

  return (
    <div>
      <h2>בחר חדר להצטרפות</h2>
      {fakeRooms.map(roomId => (
        <div key={roomId}>
          <span>חדר {roomId}</span>
          <button onClick={() => navigate(`/room/${roomId}`)}>הצטרף</button>
        </div>
      ))}
    </div>
  );
};

export default JoinGamePage;
