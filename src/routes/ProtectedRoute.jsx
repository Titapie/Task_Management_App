import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
