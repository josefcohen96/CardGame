// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function PrivateRoute() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
