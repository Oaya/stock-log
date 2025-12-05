export interface Friend {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const addToFriend = async (user_id: number): Promise<Friend> => {
  console.log("Adding to friend:", user_id);
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/user/add_friend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: user_id.toString() }),
    },
  );

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "User not found");

  console.log("Added user to friend:", data);
  return data;
};

export const fetchUserFriends = async (): Promise<Friend[]> => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/my_friends`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || data.error) throw new Error(data.error || "Friend not found");
  console.log("User friends", data);

  return data;
};

export const searchFriendById = async (query: string): Promise<Friend[]> => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/users/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();
  console.log(data);

  if (!res.ok || data.error) throw new Error(data.error || "User not found");

  return data;
};
