import { useQuery } from "@tanstack/react-query";
import { CategorieDebiteurService } from "@/services/categorie-debiteur.service";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { mockCategoriesDebiteur } from "@/lib/mock-data";

export const categorieDebiteurKeys = {
  all: ["categoriesDebiteur"] as const,
  lists: () => [...categorieDebiteurKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...categorieDebiteurKeys.lists(), { filters }] as const,
  details: () => [...categorieDebiteurKeys.all, "detail"] as const,
  detail: (id: string) => [...categorieDebiteurKeys.details(), id] as const,
};

export const useCategoriesDebiteur = () => {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: categorieDebiteurKeys.lists(),
    queryFn: async () => {
      try {
        const res = await CategorieDebiteurService.getAll(apiClient);
        const data = res.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.log('API non disponible, utilisation des données mock pour catégories débiteur');
        return mockCategoriesDebiteur;
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};