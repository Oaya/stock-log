export interface Stock {
  id: number;
  name: string;
  ticker: string;
  last_price: number;
}

export const addToPortfolio = async (ticker: string): Promise<Stock> => {
  console.log("Adding to portfolio:", ticker);
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/portfolio/stock/${ticker}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Stock not found");

  console.log("Added stock to portfolio:", data);
  return data;
};

export const fetchUserStocks = async (): Promise<Stock[]> => {
  const token = localStorage.getItem("jwt");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  console.log("Fetched user stocks:", data);

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

export const removeUserStock = async (id: string) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/portfolio/stock/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();
  if (!res.ok || data.error)
    throw new Error(data.error || "Failed to remove stock");

  console.log("Removed stock from portfolio:", data);
  return data;
};

export const searchStockBySymbol = async (symbol: string) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/stocks/search?stock=${symbol}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Stock not found");

  return data;
};
