import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");

  // if no token → redirect login
  if (!token) {
    return <Navigate to="/" />;
  }

  // if token exists → allow access
  return children;
};

export default ProtectedRoute;