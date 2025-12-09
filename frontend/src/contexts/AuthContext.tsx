import {
  useState,
  useContext,
  createContext,
  type ReactNode,
  useEffect,
} from "react";
import {
  loginRequest,
  meRequest,
  signupRequest,
  updateUserRequest,
} from "../services/auth";

export interface User {
  email?: string;
  id?: number;
  token?: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginUserData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface SignupUserData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  current_password: string;
}

const AuthContext = createContext<{
  user: User | null;
  login: (userData: LoginUserData) => Promise<void>;
  signup: (userData: SignupUserData) => Promise<void>;
  logout: () => Promise<void>;
  updateAccount: (userData: UpdateUserData) => Promise<void>;
}>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateAccount: async () => {},
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
    if (loggedInUser.token) {
      localStorage.setItem("jwt", loggedInUser.token);
    }

    setUser(loggedInUser);
  }

  async function signup(userData: SignupUserData) {
    const registeredUser = await signupRequest(userData);
    setUser(registeredUser);
  }

  async function logout() {
    localStorage.removeItem("jwt");
    setUser(null);
  }

  async function updateAccount(userData: UpdateUserData) {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("No token found");

    const updatedUser = await updateUserRequest(token, userData);
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
