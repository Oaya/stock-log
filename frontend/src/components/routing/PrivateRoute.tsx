import { Navigate } from "react-router-dom";

interface Prop {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Prop) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
