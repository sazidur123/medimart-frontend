import { Navigate } from "react-router-dom";

function PrivateRoute({ user, loading, children }) {
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default PrivateRoute;
