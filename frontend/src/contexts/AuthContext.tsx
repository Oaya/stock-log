import {
  useState,
  useContext,
  createContext,
  type ReactNode,
  useEffect,
} from "react";
import { loginRequest, meRequest } from "../api/authApi";

export interface User {
  email?: string;
  id?: number;
  token: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginUserData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

const AuthContext = createContext<{
  user: User | null;
  login: (userData: LoginUserData) => Promise<void>;
  signup: (userData: LoginUserData) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    (async () => {
      try {
        const me = await meRequest(token);
        setUser(me);
      } catch (error) {
        console.error(
          "Error during token validation:",
          (error as Error).message,
        );
        localStorage.removeItem("jwt");
        setUser(null);
      }
    })();
  }, []);

  async function login(userData: LoginUserData) {
    const loggedInUser = await loginRequest(userData);
    localStorage.setItem("jwt", loggedInUser.token);
    setUser(loggedInUser);
  }

  async function signup(userData: LoginUserData) {
    const registeredUser = await loginRequest(userData);
    localStorage.setItem("jwt", registeredUser.token);
    setUser(registeredUser);
  }

  async function logout() {
    localStorage.removeItem("jwt");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
