import { useState, useContext, createContext, type ReactNode } from "react";

export interface User {
	email: string;
}

const AuthContext = createContext<{
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
}>({
	user: null,
	login: () => {},
	logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
