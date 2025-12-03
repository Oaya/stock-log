import React, { useRef, useState } from "react";

interface Stock {
  name: string;
  ticker: string;
  last_price: number;
}

const MyPortfolio = () => {
  const stockRef = useRef<HTMLInputElement>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setError("No token found, user might not be logged in");
      }

      if (
        stockRef.current?.value == null ||
        stockRef.current?.value.trim() === ""
      ) {
        setError("Please enter a stock symbol to search.");
      }

      const res = await fetch(
        `http://localhost:3000/api/stocks/search?stock=${stockRef.current?.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.error) {
        setError(`Error: ${data.error}`);
        return;
      }

      setStock(data);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div>
      {error && (
        <p className="mt-4 text-center text-2xl text-red-500">{error}</p>
      )}
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
            ref={stockRef}
            className="bg-neutral-secondary-medium border-default-medium rounded-base text-heading focus:ring-brand focus:border-brand placeholder:text-body mt-5 block w-full border px-3 py-2.5 ps-9 text-sm"
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
      {stock && (
        <div className="bg-c-gray mx-auto mt-10 w-2xl items-center rounded border p-5 text-center shadow-md">
          <h2 className="text-2xl font-bold">Stock Information</h2>
          <p className="mt-4">Name: {stock.name}</p>
          <p>Symbol: {stock.ticker}</p>
          <p>Price: ${stock.last_price}</p>
        </div>
      )}
    </div>
  );
};

export default MyPortfolio;
