import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export const useCategoriesDebiteur = () => {
  return useQuery({
    queryKey: ['categoriesDebiteur'],
    queryFn: async () => {
      const response = await apiClient.get('/categories-debiteur');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};