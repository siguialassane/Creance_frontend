import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type UseTypesDomicilOptions = {
  enabled?: boolean;
};

export const useTypesDomicil = (options: UseTypesDomicilOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['typesDomicil'],
    queryFn: async () => {
      const response = await apiClient.get('/types/AC_TYPE_DOMICIL');
      const data = response.data?.content || response.data?.data || response.data || response;
      console.log('✅ Données types domiciliation chargées depuis l\'API:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
