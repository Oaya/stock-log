import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";

const SignUp = () => {
	const { signup } = useAuth();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const email = emailRef.current?.value || "";
		const password = passwordRef.current?.value || "";
		const confirmPassword = confirmPasswordRef.current?.value || "";
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			await signup({ email, password });
			navigate("/");
		} catch (res) {
			setError(res instanceof Error ? res.message : String(res));
		}
	}

	return (
		<div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
			<h2>Sign Up</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}

			<form onSubmit={handleSignup}>
				<div style={{ marginBottom: 12 }}>
					<label>Email</label>
					<input
						type="email"
						name="email"
						ref={emailRef}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				<div style={{ marginBottom: 12 }}>
					<label>Password</label>
					<input
						type="password"
						name="password"
						ref={passwordRef}
						minLength={6}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

				<div style={{ marginBottom: 12 }}>
					<label>Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						ref={confirmPasswordRef}
						minLength={6}
						required
						style={{ width: "100%", padding: 8 }}
					/>
				</div>

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
					Sign up
				</button>
			</form>
		</div>
	);
};
export default SignUp;
