import Login from "../components/Login";
import { useAuth } from "../contexts/AuthContext";

const LogInPage = () => {
	const { user } = useAuth();

	// Optional: if user is already logged in, don't show form
	if (user) {
		return (
			<div className="welcome login">
				<h2>Welcome, {user.email}</h2>
				{/* could also navigate('/') or show a link */}
			</div>
		);
	}

	return <Login />;
};

export default LogInPage;
