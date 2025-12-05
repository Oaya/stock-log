import type {
  LoginUserData,
  UpdateUserData,
  User,
} from "../contexts/AuthContext";

const API_BASE = "http://localhost:3000";

export const loginRequest = async (userData: LoginUserData) => {
  const res = await fetch(`${API_BASE}/users/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: {
        email: userData.email,
        password: userData.password,
      },
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Login failed: ${data.error}`);
  }

  // Extract JWT from the Authorization header
  const authHeader = res.headers.get("Authorization");

  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("No token returned from server");
  }

  // Store token
  localStorage.setItem("jwt", token);

  console.log("Login response data:", data);

  const user: User = {
    email: data.user.email,
    id: data.user.id,
    token,
    first_name: data.user.first_name,
    last_name: data.user.last_name,
  };

  return user;
};

export const signupRequest = async (userData: LoginUserData) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
      },
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(`Signin failed: ${data.error}`);
  }

  // Extract JWT from the Authorization header
  const authHeader = res.headers.get("Authorization");

  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("No token returned from server");
  }

  // Store token
  localStorage.setItem("jwt", token);

  console.log("Sign in response data:", data);

  const user: User = {
    email: data.user.email,
    id: data.user.id,
    token,
    first_name: data.user.first_name,
    last_name: data.user.last_name,
  };

  return user;
};

export const logoutRequest = async () => {
  console.log("Logging out user");
  const token = localStorage.getItem("jwt");

  if (token) {
    const res = await fetch(`${API_BASE}/users/sign_out`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // THROW an error so caller can catch it
      throw new Error(`Logout failed: ${res.status}`);
    }
  }
};

export const meRequest = async (token: string): Promise<User> => {
  const res = await fetch(`${API_BASE}/api/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Token validation failed");
  }

  return {
    email: data.email,
    id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    token,
  };
};

export const updateUserRequest = async (
  token: string,
  user: UpdateUserData,
) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        password_confirmation: user.password_confirmation,
        current_password: user.current_password,
      },
    }),
  });

  const data = await res.json();

  console.log("Update response data:", data);

  if (!res.ok || data.error) {
    throw new Error(data.error || "Update failed");
  }

  return {
    email: data.user.email,
    id: data.user.id,
    first_name: data.user.first_name,
    last_name: data.user.last_name,
    token,
  };
};
