import { useParams } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolio";
import { useFriendProfile } from "../../hooks/useFriendProfile";

const FriendProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const friendId = id ?? null;

  // const [error, setError] = useState<string | null>(null);

  const { stocks, isLoading: stockLoading } = usePortfolioData(friendId);
  const { data: user, isLoading, error } = useFriendProfile(friendId);

  if (isLoading || stockLoading) {
    return (
      <div className="m-10 text-center text-2xl">Loading Friend profile...</div>
    );
  }

  return (
    <div className="m-40">
      {error && (
        <p className="mt-4 text-center text-2xl text-red-500">
          {error.message}
        </p>
      )}
      <h1 className="text-heading text-4xl">User Details</h1>

      {user && (
        <div className="mt-4 flex w-full items-center gap-10 rounded-md bg-gray-100 p-5 text-center text-2xl shadow-md">
          <p className="">
            <span className="font-bold"> Name:</span> {user.first_name}{" "}
            {user.last_name}
          </p>
          <p className="">
            <span className="font-bold"> Email:</span> {user.email}
          </p>
        </div>
      )}

      {stocks?.length === 0 ? (
        <p className="mt-10 text-center text-2xl">
          Have stocks in your portfolio.
        </p>
      ) : (
        <div className="mt-10 overflow-hidden rounded-lg text-2xl shadow-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-white text-left font-bold text-gray-600">
                <th className="w-1/6 border-r border-gray-200 px-6 py-4">
                  Ticker
                </th>
                <th className="w-2/6 border-r border-gray-200 px-6 py-4">
                  Name
                </th>
                <th className="w-1/6 border-r border-gray-200 px-6 py-4">
                  Price
                </th>
                <th className="w-2/6 border-r border-gray-200 px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-grey">
              {stocks?.map((stock) => (
                <tr key={stock.id} className="odd:bg-gray-100 even:bg-white">
                  <td className="border border-gray-200 px-6 py-4">
                    {stock.ticker}
                  </td>
                  <td className="truncate border border-gray-200 px-6 py-4">
                    {stock.name}
                  </td>
                  <td className="border border-gray-200 px-6 py-4">
                    $ {stock.last_price}
                  </td>
                  <td className="border border-gray-200 px-6 py-4">
                    <button
                      // onClick={() => deleteMutation.mutate(stock.id.toString())}
                      className="items-center rounded bg-red-300 px-4 py-2 text-center text-white"
                    >
                      Remove
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

export default FriendProfilePage;
