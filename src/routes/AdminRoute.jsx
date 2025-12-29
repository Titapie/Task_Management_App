import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminRoute() {
  const { loading, user, isAuthenticated } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const isAdmin = user?.Role === "admin";
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
