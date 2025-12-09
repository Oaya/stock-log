import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToFriend,
  deleteFriend,
  fetchUserFriends,
  type User,
} from "../services/friend";

export const useFriendsData = () => {
  const queryClient = useQueryClient();

  const {
    data: friends = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["userFriends"],
    queryFn: fetchUserFriends,
  });

  //Add friend mutation
  const addFriendMutation = useMutation({
    mutationFn: addToFriend,
    onSuccess: (friend) => {
      // Update cached portfolio without refetching
      queryClient.setQueryData<User[]>(["userFriends"], (old) => {
        if (!old) return [friend];
        if (old.some((s) => s.email === friend.email)) return old;
        return [...old, friend];
      });
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, id) => {
      queryClient.setQueryData<User[]>(["userFriends"], (old) => {
        if (!old) return [];
        return old.filter((s) => s.id !== id);
      });
    },
  });

  return {
    friends,
    isLoading,
    queryError,
    addFriendMutation,
    removeFriendMutation,
  };
};
