import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { mockCategoriesDebiteur } from "@/lib/mock-data";

export const useCategoriesDebiteur = () => {
  return useQuery({
    queryKey: ['categoriesDebiteur'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/categories-debiteur');
        // Si response.data est un objet avec une propriété data, extraire les données
        const data = response.data?.data || response.data;
        console.log('✅ Données catégories débiteur chargées depuis l\'API:', data);
        return Array.isArray(data) ? data : mockCategoriesDebiteur;
      } catch (error) {
        // En cas d'erreur (pas de backend), retourner les données mock
        console.log('API non disponible, utilisation des données mock pour catégories débiteur');
        return mockCategoriesDebiteur;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Ne pas réessayer en cas d'erreur
  });
};