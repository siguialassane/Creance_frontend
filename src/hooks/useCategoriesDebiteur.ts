import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { CategorieDebiteurService } from "@/services/categorie-debiteur.service";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";
import { CategorieDebiteurCreateRequest, CategorieDebiteurUpdateRequest } from "@/types/categorie-debiteur";

export const categorieDebiteurKeys = {
  all: ["categoriesDebiteur"] as const,
  lists: () => [...categorieDebiteurKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...categorieDebiteurKeys.lists(), { filters }] as const,
  details: () => [...categorieDebiteurKeys.all, "detail"] as const,
  detail: (id: string) => [...categorieDebiteurKeys.details(), id] as const,
  search: (term: string) => [...categorieDebiteurKeys.all, "search", term] as const,
};

export const useCategoriesDebiteur = () => {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: categorieDebiteurKeys.lists(),
    queryFn: async () => {
      try {
        const res = await CategorieDebiteurService.getAll(apiClient);
        const data = res.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.log('API non disponible, utilisation des données mock pour catégories débiteur');
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategorieDebiteur(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: categorieDebiteurKeys.detail(code),
    queryFn: () => CategorieDebiteurService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchCategoriesDebiteur(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: categorieDebiteurKeys.search(searchTerm),
    queryFn: () => CategorieDebiteurService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateCategorieDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (categorie: CategorieDebiteurCreateRequest) => CategorieDebiteurService.create(apiClient, categorie),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categorieDebiteurKeys.lists() });
      toast.success("Catégorie débiteur créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la catégorie débiteur";
      toast.error(message);
    },
  });
}

export function useUpdateCategorieDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, categorie }: { code: string; categorie: CategorieDebiteurUpdateRequest }) =>
      CategorieDebiteurService.update(apiClient, code, categorie),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categorieDebiteurKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categorieDebiteurKeys.detail(variables.code) });
      toast.success("Catégorie débiteur mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la catégorie débiteur";
      toast.error(message);
    },
  });
}

export function useDeleteCategorieDebiteur() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => CategorieDebiteurService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categorieDebiteurKeys.lists() });
      toast.success("Catégorie débiteur supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la catégorie débiteur";
      toast.error(message);
    },
  });
}
