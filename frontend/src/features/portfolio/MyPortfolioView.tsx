import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToPortfolio,
  fetchUserStocks,
  removeUserStock,
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

    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("No token found");

    const res = await fetch(
      `http://localhost:3000/api/stocks/search?stock=${symbol}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    if (!res.ok || data.error) {
      setError(data.error || "Stock not found");
      return;
    }
    setSearchedStock(data);
  };

  if (isLoading)
    return <p className="mt-4 text-center text-2xl">Loading portfolio...</p>;

  return (
    <div className="p-10">
      {error && (
        <p className="mt-4 text-center text-2xl text-red-500">{error}</p>
      )}
      <h1 className="text-heading text-4xl">My Portfolio</h1>
      <form
        onSubmit={handleSearch}
        className="mx-auto flex max-w-2xl items-center space-x-2"
      >
        <div className="relative mt-5 w-full">
          <label htmlFor="simple-search" className="text-4xl">
            Search Stocks
          </label>
          <input
            type="text"
            id="simple-search"
            name="stock"
            onChange={() => setError(null)}
            ref={stockRef}
            className="bg-neutral-secondary-medium border-default-medium rounded-base text-heading focus:ring-brand focus:border-brand placeholder:text-body mt-5 block w-full border bg-white px-3 py-2.5 ps-9 text-sm"
            placeholder="Search branch name..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-c-purple hover:bg-brand-strong focus:ring-brand-medium rounded-base mt-20 inline-flex h-10 w-10 shrink-0 items-center justify-center text-white shadow-xs focus:ring-4 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <span className="sr-only">Icon description</span>
        </button>
      </form>

      {searchedStock && (
        <div className="mx-auto mt-10 w-2xl items-center rounded border bg-white p-5 text-center shadow-md">
          <h2 className="text-2xl font-bold">Stock Information</h2>
          <p className="mt-4">Name: {searchedStock.name}</p>
          <p>Symbol: {searchedStock.ticker}</p>
          <p>Price: ${searchedStock.last_price}</p>
          {!alreadyOwnsStock && (
            <button
              onClick={() => addMutation.mutate(searchedStock.ticker)}
              className="bg-c-purple mt-4 rounded px-4 py-2 text-white"
            >
              Add to Portfolio
            </button>
          )}
        </div>
      )}

      {stocks?.length === 0 ? (
        <p className="mt-10 text-center text-2xl">
          You have no stocks in your portfolio.
        </p>
      ) : (
        <div className="m-10 overflow-hidden rounded-lg shadow-lg md:mx-10">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-white text-left text-xl font-bold text-gray-600">
                <th className="w-1/4 border-r border-gray-200 px-6 py-4">
                  Ticker
                </th>
                <th className="w-1/4 border-r border-gray-200 px-6 py-4">
                  Name
                </th>
                <th className="w-1/4 border-r border-gray-200 px-6 py-4">
                  Price
                </th>
                <th className="w-1/4 border-r border-gray-200 px-6 py-4">
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
