import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export const useTypesDomicil = () => {
  return useQuery({
    queryKey: ['typesDomicil'],
    queryFn: async () => {
      const response = await apiClient.get('/types-domicil');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
