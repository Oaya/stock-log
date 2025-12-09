import { useParams } from "react-router-dom";
import { usePortfolioData } from "../../hooks/usePortfolio";
import { useFriendProfile } from "../../hooks/useFriendProfile";
import { useAuth } from "../../contexts/AuthContext";

const FriendProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const friendId = id ?? null;

  const { data: friend, isLoading, error } = useFriendProfile(friendId);
  const {
    stocks: friendStocks = [],
    isLoading: friendStocksLoading,
    queryError: friendStocksError,
  } = usePortfolioData(friendId);

  const {
    stocks: userStocks = [],
    isLoading: userStocksLoading,
    queryError: userStocksError,
    addStock,
  } = usePortfolioData(user?.id?.toString());

  if (isLoading || friendStocksLoading || userStocksLoading) {
    return (
      <div className="m-10 text-center text-2xl">Loading Friend profile...</div>
    );
  }
  const errorMessage =
    friendStocksError?.message ||
    userStocksError?.message ||
    error?.message ||
    null;

  const trackedTickers = new Set(userStocks.map((s) => s.ticker));
  const friendStocksWithTracking = friendStocks.map((stock) => ({
    ...stock,
    isTracking: trackedTickers.has(stock.ticker),
  }));

  return (
    <div className="m-40">
      {errorMessage && (
        <p className="mt-4 text-center text-2xl text-red-500">{errorMessage}</p>
      )}
      <h1 className="text-heading text-4xl">User Details</h1>

      {friend && (
        <div className="mt-4 flex w-full items-center gap-10 rounded-md bg-gray-100 p-5 text-center text-2xl shadow-md">
          <p className="">
            <span className="font-bold"> Name:</span> {friend.first_name}{" "}
            {friend.last_name}
          </p>
          <p className="">
            <span className="font-bold"> Email:</span> {friend.email}
          </p>
        </div>
      )}

      {friendStocks?.length === 0 ? (
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
              {friendStocksWithTracking?.map((stock) => (
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
                    {stock.isTracking ? (
                      <span className="inline-block rounded bg-gray-300 px-4 py-2 text-center text-white">
                        Already Tracking
                      </span>
                    ) : (
                      <button
                        onClick={() => addStock(stock.ticker)}
                        className="bg-c-purple inline-block rounded px-4 py-2 text-center text-white"
                      >
                        Track
                      </button>
                    )}
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
