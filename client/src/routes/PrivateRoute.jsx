import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}
export default PrivateRoute;
