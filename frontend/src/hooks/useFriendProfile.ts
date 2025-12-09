import { useQuery } from "@tanstack/react-query";
import { fetchUserFriendById, type User } from "../services/friend";

export const useFriendProfile = (id: string | null) => {
  return useQuery<User>({
    queryKey: ["friendProfile", id],
    queryFn: () => fetchUserFriendById(id as string),
    enabled: !!id,
  });
};
