import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToFriend,
  deleteFriend,
  fetchUserFriends,
  searchFriendById,
  type Friend,
} from "./api";

const Friends = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const friendRef = useRef<HTMLInputElement>(null);
  const [searchedFriends, setSearchedFriends] = useState<Friend[] | null>(null);

  //Load friends
  const { data: friends, isLoading } = useQuery({
    queryKey: ["userFriends"],
    queryFn: fetchUserFriends,
  });

  const friendEmailSet = new Set(friends?.map((f) => f.email));

  const addMutation = useMutation({
    mutationFn: addToFriend,
    onSuccess: (friend) => {
      // Update cached portfolio without refetching
      queryClient.setQueryData<Friend[]>(["userFriends"], (old) => {
        if (!old) return [friend];
        if (old.some((s) => s.email === friend.email)) return old;
        return [...old, friend];
      });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFriend,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Friend[]>(["userFriends"], (old) => {
        if (!old) return [];
        return old.filter((s) => s.id !== id);
      });
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const query = friendRef.current?.value || "";

    try {
      const data = await searchFriendById(query);
      setSearchedFriends(data);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (isLoading)
    return <p className="mt-4 text-center text-2xl">Loading Friends...</p>;

  return (
    <div className="m-40">
      {error && (
        <p className="mt-4 text-center text-2xl text-red-500">{error}</p>
      )}
      <h1 className="text-heading text-4xl">Friends</h1>

      <form
        onSubmit={handleSearch}
        className="mt-10 flex items-center space-x-2"
      >
        <div className="relative w-full">
          <input
            type="text"
            id="simple-search"
            name="stock"
            onChange={() => setError(null)}
            ref={friendRef}
            className="bg-neutral-secondary-medium border-default-medium text-heading focus:ring-brand focus:border-brand placeholder:text-body block w-full rounded border bg-white p-4 text-2xl"
            placeholder="Search Friend By Name or email"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-c-purple hover:bg-brand-strong focus:ring-brand-medium inline-flex items-center justify-center rounded-md p-5 text-white shadow-xs focus:ring-4 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </form>

      {searchedFriends?.length && (
        <div className="mt-6 w-full max-w-4xl rounded-md bg-white p-5 shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-2xl font-bold">
                <th className="w-5/12 px-4 py-2">Name</th>
                <th className="w-5/12 px-4 py-2">Email</th>
                <th className="w-2/12 px-4 py-2"></th>
              </tr>
            </thead>

            <tbody>
              {searchedFriends.map((f) => (
                <tr key={f.id} className="border-b border-gray-100 text-2xl">
                  <td className="px-4 py-2">
                    {f.first_name} {f.last_name}
                  </td>
                  <td className="px-4 py-2">{f.email}</td>
                  <td className="px-4 py-2">
                    {!friendEmailSet.has(f.email) && (
                      <button
                        onClick={() => addMutation.mutate(f.id)}
                        className="bg-c-purple rounded px-4 py-2 text-white"
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {friends?.length === 0 ? (
        <p className="mt-10 text-center text-2xl">
          You have no user who are following.
        </p>
      ) : (
        <div className="my-10 overflow-hidden rounded-lg text-2xl shadow-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-white text-left text-xl font-bold text-gray-600">
                <th className="w-5/12 border-r border-gray-200 px-6 py-4">
                  Email
                </th>
                <th className="w-5/12 border-r border-gray-200 px-6 py-4">
                  Name
                </th>
                <th className="w-2/12 border-r border-gray-200 px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-grey">
              {friends?.map((friend) => (
                <tr key={friend.id} className="odd:bg-gray-100 even:bg-white">
                  <td className="border border-gray-200 px-6 py-4">
                    {friend.email}
                  </td>
                  <td className="truncate border border-gray-200 px-6 py-4">
                    {friend.first_name} {friend.last_name}
                  </td>
                  <td className="border border-gray-200 px-6 py-4">
                    <button
                      onClick={() => deleteMutation.mutate(friend.id)}
                      className="items-center rounded-md bg-red-400 px-4 py-2 text-center text-white"
                    >
                      Stop following
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Friends;
