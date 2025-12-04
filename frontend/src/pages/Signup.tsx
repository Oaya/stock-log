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
      navigate("/my_portfolio");
    } catch (res) {
      setError(res instanceof Error ? res.message : String(res));
    }
  }

  return (
    <div className="mt-4 text-center">
      <h2 className="pb-4 text-3xl">Sign up</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSignup}>
        <div className="mb-5">
          <label className="mb-2 block font-bold">Email</label>
          <input
            type="email"
            name="email"
            ref={emailRef}
            onChange={() => setError(null)}
            required
            className="mb-5 rounded border border-gray-300 p-3 shadow-md"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Password</label>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            onChange={() => setError(null)}
            required
            className="mb-5 rounded border border-gray-300 p-3 shadow-md"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Confirm Password</label>
          <input
            type="password"
            name="password"
            ref={confirmPasswordRef}
            onChange={() => setError(null)}
            required
            className="mb-5 rounded border border-gray-300 p-3 shadow-md"
          />
        </div>

        <button
          type="submit"
          className="bg-c-purple rounded px-8 py-5 text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
export default SignUp;
