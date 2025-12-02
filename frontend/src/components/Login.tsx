import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
	onLogin: (user: unknown) => void;
}

interface User {
	email: string;
	// add id or other fields if your API returns them
	// id: number;
}

export default function Login({ onLogin }: LoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");

		try {
			const res = await fetch("http://localhost:3000/users/sign_in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user: {
						email,
						password,
					},
				}),
			});

			if (!res.ok) {
				setError("Invalid email or password");
				return;
			}

			// Extract JWT from the Authorization header
			const authHeader = res.headers.get("Authorization");

			const token = authHeader?.split(" ")[1];

			if (!token) {
				setError("No token returned from server");
				return;
			}

			// Store token
			localStorage.setItem("jwt", token);

			const data = await res.json();
			onLogin(data.user as User);
			navigate("/");
		} catch (err) {
			console.error(err);
			setError("Network error");
		}
	}

	return (
		<div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
			<h2>Sign In</h2>

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				<div style={{ marginBottom: 12 }}>
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				{error && <p style={{ color: "red" }}>{error}</p>}

				<button
					type="submit"
					style={{
						padding: "10px 20px",
						background: "#007bff",
						color: "white",
						border: "none",
						borderRadius: 4,
					}}
				>
					Log In
				</button>
			</form>
		</div>
	);
}
