import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
} 