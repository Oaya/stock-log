import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Prop {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Prop) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
