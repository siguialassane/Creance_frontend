import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export const useUtilisateurs = () => {
  return useQuery({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const response = await apiClient.get('/utilisateurs');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
