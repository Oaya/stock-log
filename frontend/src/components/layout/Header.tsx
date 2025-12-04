import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../assets/stock-market.png";

export default function Header() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        <div>
          <NavLink
            to="/"
            className="position-absolute flex items-center gap-4 text-xl font-bold"
          >
            <img src={logoImage} alt="logo" className="h-10 w-10" />
            <span className="text-4xl">Stock Log</span>
          </NavLink>
        </div>

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
            <>
              {location.pathname !== "/my_portfolio" && (
                <NavLink
                  to="/my_portfolio"
                  className="inline-flex items-center justify-center px-4 py-1"
                >
                  My Portfolio
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="bg-c-purple rounded px-4 py-1 shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {error && <p>{error}</p>}
    </div>
  );
}
