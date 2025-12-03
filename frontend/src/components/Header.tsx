import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogout() {
    setError(null);
    try {
      await logout();
      navigate("/");
    } catch (res) {
      setError(res instanceof Error ? res.message : String(res));
    }
  }

  return (
    <div>
      <header className="bg-light-blue flex justify-between p-8">
        <h1 className="text-5xl">Stock Log</h1>
        <div className="flex gap-4">
          {!user && (
            <>
              <NavLink
                to="/login"
                className="bg-c-purple inline-flex items-center justify-center rounded px-4 py-1 shadow-md"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="bg-c-purple inline-flex items-center justify-center rounded px-4 py-1 shadow-md"
              >
                Signup
              </NavLink>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="bg-c-purple rounded px-4 py-1 shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {error && <p>{error}</p>}
    </div>
  );
}
