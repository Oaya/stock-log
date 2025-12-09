import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";

const SignUp = () => {
  const { signup } = useAuth();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const first_name = firstNameRef.current?.value || "";
    const last_name = lastNameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup({
        first_name,
        last_name,
        email,
        password,
      });
      setInfo(
        `We sent a confirmation email to ${email}. Please click the link in that email before logging in.`,
      );

      setTimeout(() => navigate("/login"), 10000);
    } catch (res) {
      setError(res instanceof Error ? res.message : String(res));
    }
  }

  return (
    <div className="m-10">
      <h2 className="pb-4 text-center text-5xl">Sign up</h2>
      {error && (
        <p className="m-4 text-center text-2xl text-red-500">{error}</p>
      )}
      {info && (
        <p className="m-4 text-center text-2xl text-green-600">{info}</p>
      )}

      <form onSubmit={handleSignup} className="mx-auto w-200 text-2xl">
        <div className="mb-5">
          <label className="mb-2 block font-bold">Email</label>
          <input
            type="email"
            name="email"
            ref={emailRef}
            onChange={() => setError(null)}
            required
            className="mb-5 w-full rounded border border-gray-300 bg-white p-3 px-8 py-5 shadow-md"
          />
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-5 w-full">
            <label className="mb-2 block font-bold">First Name</label>
            <input
              type="text"
              name="firstName"
              ref={firstNameRef}
              onChange={() => setError(null)}
              required
              className="mb-5 w-full rounded border border-gray-300 bg-white p-3 px-8 py-5 shadow-md"
            />
          </div>
          <div className="group relative z-0 mb-5 w-full">
            <label className="mb-2 block font-bold">Last Name</label>
            <input
              type="text"
              name="lastName"
              ref={lastNameRef}
              onChange={() => setError(null)}
              required
              className="mb-5 w-full rounded border border-gray-300 bg-white p-3 px-8 py-5 shadow-md"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Password</label>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            onChange={() => setError(null)}
            required
            className="mb-5 w-full rounded border border-gray-300 bg-white p-3 px-8 py-5 shadow-md"
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
            className="mb-5 w-full rounded border border-gray-300 bg-white p-3 px-8 py-5 shadow-md"
          />
        </div>

        <button
          type="submit"
          className="bg-c-purple w-full rounded px-8 py-5 text-center text-white"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
export default SignUp;
