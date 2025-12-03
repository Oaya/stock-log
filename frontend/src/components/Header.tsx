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
		<header>
			{error && <p>{error}</p>}
			{!user && (
				<>
					<NavLink to="/login">Login</NavLink>
					<NavLink to="/signup">Signup</NavLink>
				</>
			)}
			{user && <button onClick={handleLogout}>Logout</button>}
		</header>
	);
}
