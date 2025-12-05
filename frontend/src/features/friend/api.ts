export interface Friend {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const fetchUserFriends = async (): Promise<Friend[]> => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends`, {
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
