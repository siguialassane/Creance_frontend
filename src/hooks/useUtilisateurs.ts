import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type UseUtilisateursOptions = {
  enabled?: boolean;
};

export const useUtilisateurs = (options: UseUtilisateursOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const response = await apiClient.get('/utilisateurs');
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
