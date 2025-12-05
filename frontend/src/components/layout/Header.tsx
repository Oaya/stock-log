import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../assets/stock-market.png";

export default function Header() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
              <div className="relative inline-block text-left">
                <div>
                  <button
                    onClick={toggleDropdown}
                    className="inline-flex w-full justify-center border-gray-300 px-4 py-2 text-2xl"
                  >
                    {user.first_name ?? user.email}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  <div
                    className="ring-opacity-5 absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white text-2xl shadow-lg focus:outline-none"
                    role="menu"
                  >
                    <div className="py-1" role="none">
                      {location.pathname !== "/my_portfolio" && (
                        <a
                          href="/my_portfolio"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          My Portfolio
                        </a>
                      )}
                      <a
                        href="/edit_profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Edit Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-c-purple rounded px-4 py-2 text-2xl shadow-md"
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
