import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import RoomListPage from "./pages/RoomListPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-2xl mx-auto px-2 py-6">
          <Routes>
            {/* public pages*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* private pages */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lobby/:type/:id" element={<LobbyPage />} />
              <Route path="/game/:type/:id" element={<GamePage />} />
              <Route path="/rooms" element={<RoomListPage />} />
              <Route path="/create" element={<CreateRoomPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
