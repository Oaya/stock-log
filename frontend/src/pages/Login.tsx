import { useState } from "react";
import Login from "../components/Login";

type User = {
	email: string;
};

const LogIn = () => {
	const [user, setUser] = useState<User | null>(null);

	// Called when the Login form succeeds
	const handleLogin = (loggedInUser: unknown) => {
		setUser(loggedInUser as User);
	};

	if (!user) {
		return <Login onLogin={handleLogin} />;
	}

	// After login, show something else (not the login form again)
	return (
		<div className="welcome login">
			<h2>Welcome, {user.email}</h2>
			<button onClick={() => setUser(null)}>Log out</button>
		</div>
	);
};

export default LogIn;
