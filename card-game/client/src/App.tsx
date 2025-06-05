import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateGamePage from './pages/CreateGamePage';
import JoinGamePage from './pages/JoinGamePage';
import GameRoom from './pages/GameRoom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGamePage />} />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/room/:roomId" element={<GameRoom />} />
    </Routes>
  );
};

export default App;