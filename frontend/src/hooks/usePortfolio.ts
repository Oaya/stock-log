import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToPortfolio,
  fetchUserStocks,
  removeUserStock,
  type Stock,
} from "../services/portfolio";

export const usePortfolioData = (userId: string | null | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: stocks = [],
    error: queryError,
    isLoading,
  } = useQuery({
    queryKey: ["userStocks", userId],
    queryFn: () => fetchUserStocks(userId as string),
    enabled: !!userId,
  });

  // Add mutation
  const addStockMutation = useMutation({
    mutationFn: addToPortfolio,
    onSuccess: (stock) => {
      queryClient.setQueryData<Stock[]>(["userStocks", userId], (old) => {
        if (!old) return [stock];
        if (old.some((s) => s.ticker === stock.ticker)) return old;
        return [...old, stock];
      });
    },
  });

  // Delete mutation
  const deleteStockMutation = useMutation({
    mutationFn: removeUserStock,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Stock[]>(["userStocks", userId], (old) =>
        old ? old.filter((s) => s.id.toString() !== id) : [],
      );
    },
  });

  const addStock = (ticker: string) => addStockMutation.mutate(ticker);
  const removeStock = (id: string) => deleteStockMutation.mutate(id);
  return {
    stocks,
    isLoading,
    queryError,
    addStock,
    removeStock,
    addStockMutation,
    deleteStockMutation,
  };
};
