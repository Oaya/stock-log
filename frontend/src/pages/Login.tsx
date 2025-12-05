import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    try {
      await login({ email, password });
      navigate("/my_portfolio");
    } catch (res) {
      setError(res instanceof Error ? res.message : String(res));
    }
  }

  return (
    <div className="m-10">
      <h2 className="pb-4 text-center text-5xl">Log In</h2>
      {error && (
        <p className="m-4 text-center text-2xl text-red-500">{error}</p>
      )}

      <form onSubmit={handleLogin} className="mx-auto w-200 text-2xl">
        <div className="mb-5">
          <label className="mb-2 block font-bold">Email</label>
          <input
            type="email"
            name="email"
            ref={emailRef}
            onChange={() => setError(null)}
            required
            className="mb-5 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
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
            className="mb-5 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
        </div>

        <button
          type="submit"
          className="bg-c-purple w-full rounded px-8 py-5 text-center text-white"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LogIn;
