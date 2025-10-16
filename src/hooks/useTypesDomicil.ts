import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { mockTypesDomicil } from "@/lib/mock-data";

export const useTypesDomicil = () => {
  return useQuery({
    queryKey: ['typesDomicil'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/types-domicil');
        return response.data;
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour types domiciliation');
        return mockTypesDomicil;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
