// import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserFriends } from "./api";

const Friends = () => {
  // const [error, setError] = useState<string | null>(null);

  //Load portfolio stocks
  const { data: friends, isLoading } = useQuery({
    queryKey: ["userFriends"],
    queryFn: fetchUserFriends,
  });

  if (isLoading)
    return <p className="mt-4 text-center text-2xl">Loading Friends...</p>;

  return (
    <div className="m-40">
      {/* {error && (
        <p className="mt-4 text-center text-2xl text-red-500">{error}</p>
      )} */}
      <h1 className="text-heading text-4xl">Friends</h1>

      {friends?.length === 0 ? (
        <p className="mt-10 text-center text-2xl">
          You have no user who are following.
        </p>
      ) : (
        <div className="my-10 overflow-hidden rounded-lg shadow-lg">
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
                      // onClick={() =>
                      //   deleteMutation.mutate(friend.id.toString())
                      // }
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
