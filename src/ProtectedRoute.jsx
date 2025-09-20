import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ClinicContext } from "./context";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(ClinicContext);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user status is not approved, redirect to login
  if (user.status !== 'approved') {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on user role
    switch (user.role) {
      case "doctor":
        return <Navigate to="/doctor" replace />;
      case "secretary":
        return <Navigate to="/reception" replace />;
      case "owner":
        return <Navigate to="/owner" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User has the required role, render the protected component
  return children;
}
