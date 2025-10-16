import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export const useTypesDebiteur = () => {
  return useQuery({
    queryKey: ['typesDebiteur'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/types-debiteur');
        return response.data;
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour types débiteur');
        // Les types débiteur sont statiques : physique et moral
        return [
          { id: "type001", libelle: "Personne physique", code: "physique" },
          { id: "type002", libelle: "Personne morale", code: "moral" }
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};