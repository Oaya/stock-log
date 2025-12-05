import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useState } from "react";

const EditProfile = () => {
  const { updateAccount, user } = useAuth();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const first_name = firstNameRef.current?.value || "";
    const last_name = lastNameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = newPasswordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";
    const currentPassword = currentPasswordRef.current?.value || "";
    setError(null);

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await updateAccount({
        first_name,
        last_name,
        email,
        password,
        current_password: currentPassword,
        password_confirmation: confirmPassword,
      });

      navigate("/my_portfolio");
    } catch (res) {
      setError(res instanceof Error ? res.message : String(res));
    }
  }

  return (
    <div className="m-10">
      <h2 className="pb-4 text-center text-5xl">Edit User</h2>
      {error && (
        <p className="m-4 text-center text-2xl text-red-500">{error}</p>
      )}

      <form onSubmit={handleSignup} className="mx-auto w-200 text-2xl">
        <div className="mb-5">
          <label className="mb-2 block font-bold">First Name</label>
          <input
            type="text"
            name="firstName"
            ref={firstNameRef}
            defaultValue={user?.first_name || ""}
            onChange={() => setError(null)}
            required
            className="mb-5 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Last Name</label>
          <input
            type="text"
            name="lastName"
            ref={lastNameRef}
            defaultValue={user?.last_name || ""}
            onChange={() => setError(null)}
            required
            className="mb-5 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Email</label>
          <input
            type="email"
            name="email"
            ref={emailRef}
            defaultValue={user?.email}
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
            ref={newPasswordRef}
            onChange={() => setError(null)}
            className="mb-2 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
          <p className="text-c-gray">
            Lead blank if you don't want to change your password
          </p>
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Confirm Password</label>
          <input
            type="password"
            name="password"
            ref={confirmPasswordRef}
            onChange={() => setError(null)}
            className="mb-5 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-bold">Current Password</label>
          <input
            type="password"
            name="password"
            ref={currentPasswordRef}
            onChange={() => setError(null)}
            required
            className="mb-2 w-full rounded border border-gray-300 p-3 px-8 py-5 shadow-md"
          />
          <p className="text-c-gray">
            we need your current password to confirm changes
          </p>
        </div>

        <button
          type="submit"
          className="bg-c-purple mt-5 w-full rounded px-8 py-5 text-center text-white"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
