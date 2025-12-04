import {
  useState,
  useContext,
  createContext,
  type ReactNode,
  useEffect,
} from "react";

export interface User {
  email?: string;
  id?: number;
  token: string;
}

export interface LoginUserData {
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

    if (token) {
      setUser({
        token,
      });
    }
  }, []);

  const login = async (userData: LoginUserData) => {
    try {
      const res = await fetch("http://localhost:3000/users/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email: userData.email,
            password: userData.password,
          },
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(`Login failed: ${data.error}`);
      }

      // Extract JWT from the Authorization header
      const authHeader = res.headers.get("Authorization");

      const token = authHeader?.split(" ")[1];

      if (!token) {
        throw new Error("No token returned from server");
      }

      // Store token
      localStorage.setItem("jwt", token);

      setUser({ email: data.user.email, id: data.user.id, token });
    } catch (error) {
      console.error("Error during login:", (error as Error).message);
      throw error;
    }
  };

  const signup = async (userData: LoginUserData) => {
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email: userData.email,
            password: userData.password,
          },
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(`Signin failed: ${data.error}`);
      }

      // Extract JWT from the Authorization header
      const authHeader = res.headers.get("Authorization");

      const token = authHeader?.split(" ")[1];

      if (!token) {
        throw new Error("No token returned from server");
      }

      // Store token
      localStorage.setItem("jwt", token);

      console.log("Sign in response data:", data);

      setUser({ email: data.user.email, id: data.user.id, token });
    } catch (error) {
      console.error("Error during Sign in:", (error as Error).message);
      throw error;
    }
  };

  const logout = async () => {
    console.log("Logging out user");
    const token = localStorage.getItem("jwt");

    try {
      if (token) {
        const res = await fetch("http://localhost:3000/users/sign_out", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // THROW an error so caller can catch it
          throw new Error(`Logout failed: ${res.status}`);
        }

        localStorage.removeItem("jwt");
        setUser(null);
      }
    } catch (err) {
      console.error("Error during sign out:", (err as Error).message);
      throw (err as Error).message;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
