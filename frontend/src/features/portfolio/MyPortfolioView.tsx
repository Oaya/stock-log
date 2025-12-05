import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToPortfolio,
  fetchUserStocks,
  removeUserStock,
  searchStockBySymbol,
  type Stock,
} from "./api";

const MyPortfolio = () => {
  const queryClient = useQueryClient();
  const stockRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchedStock, setSearchedStock] = useState<Stock | null>(null);

  //Load portfolio stocks
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["userStocks"],
    queryFn: fetchUserStocks,
  });

  const alreadyOwnsStock = stocks?.some(
    (s) => s.ticker === searchedStock?.ticker,
  );

  // Search stock mutation, search stock when form is submitted and add stock to the
  const addMutation = useMutation({
    mutationFn: addToPortfolio,
    onSuccess: (stock) => {
      // Update cached portfolio without refetching
      queryClient.setQueryData<Stock[]>(["userStocks"], (old) => {
        if (!old) return [stock];
        if (old.some((s) => s.ticker === stock.ticker)) return old;
        return [...old, stock];
      });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: removeUserStock,
    onSuccess: (_, id) => {
      // Update cached portfolio without refetching
      queryClient.setQueryData<Stock[]>(["userStocks"], (old) => {
        if (!old) return [];
        return old.filter((s) => s.id.toString() !== id);
      });
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const symbol = stockRef.current?.value || "";

    const data = await searchStockBySymbol(symbol);

    setSearchedStock(data);
  };

  if (isLoading)
    return <p className="mt-4 text-center text-2xl">Loading portfolio...</p>;

  return (
    <div className="m-40">
      {error && (
        <p className="mt-4 text-center text-2xl text-red-500">{error}</p>
      )}
      <h1 className="text-heading text-4xl">My Portfolio</h1>
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
            ref={stockRef}
            className="bg-neutral-secondary-medium border-default-medium text-heading focus:ring-brand focus:border-brand placeholder:text-body block w-full rounded border bg-white p-4 text-2xl"
            placeholder="Search stock symbol..."
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

      {searchedStock && (
        <div className="mt-4 flex w-4xl items-center gap-10 rounded-md bg-gray-100 p-5 text-center shadow-md">
          <p className="text-xl">
            <span className="font-bold"> Name:</span> {searchedStock.name}
          </p>
          <p className="text-xl">
            <span className="font-bold"> Symbol:</span> {searchedStock.ticker}
          </p>
          <p className="text-xl">
            <span className="font-bold"> Price:</span>{" "}
            {searchedStock.last_price}
          </p>
          {!alreadyOwnsStock && (
            <button
              onClick={() => addMutation.mutate(searchedStock.ticker)}
              className="bg-c-purple ml-auto items-center justify-end rounded px-4 py-2 text-white"
            >
              Add to portfolio
            </button>
          )}
        </div>
      )}

      {stocks?.length === 0 ? (
        <p className="mt-10 text-center text-2xl">
          You have no stocks in your portfolio.
        </p>
      ) : (
        <div className="mt-10 overflow-hidden rounded-lg shadow-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-white text-left text-xl font-bold text-gray-600">
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
                      onClick={() => deleteMutation.mutate(stock.id.toString())}
                      className="items-center rounded bg-red-400 px-4 py-2 text-center text-white"
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

export default MyPortfolio;
