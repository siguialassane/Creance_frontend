import { useQuery } from "@tanstack/react-query";
import { TypeDebiteurService } from "@/services/type-debiteur.service";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";

export const typeDebiteurKeys = {
  all: ["typesDebiteur"] as const,
  lists: () => [...typeDebiteurKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...typeDebiteurKeys.lists(), { filters }] as const,
  details: () => [...typeDebiteurKeys.all, "detail"] as const,
  detail: (id: string) => [...typeDebiteurKeys.details(), id] as const,
};

export const useTypesDebiteur = () => {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: typeDebiteurKeys.lists(),
    queryFn: async () => {
      try {
        const res = await TypeDebiteurService.getAll(apiClient);
        const data = res.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour types débiteur');
        return [
          { id: "type001", libelle: "Personne physique", code: "physique" },
          { id: "type002", libelle: "Personne morale", code: "moral" }
        ];
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};