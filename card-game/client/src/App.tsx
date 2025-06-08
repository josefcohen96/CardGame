import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import RoomListPage from "./pages/RoomListPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-2xl mx-auto px-2 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby/:type/:id" element={<LobbyPage />} />
          <Route path="/game/:type/:id" element={<GamePage />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}
