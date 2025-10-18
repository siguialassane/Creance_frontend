import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FonctionService } from "@/services/fonction.service";
import { FonctionCreateRequest, FonctionUpdateRequest } from "@/types/fonction";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const fonctionKeys = {
  all: ["fonctions"] as const,
  lists: () => [...fonctionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...fonctionKeys.lists(), { filters }] as const,
  details: () => [...fonctionKeys.all, "detail"] as const,
  detail: (id: string) => [...fonctionKeys.details(), id] as const,
  search: (term: string) => [...fonctionKeys.all, "search", term] as const,
};

export function useFonctions() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: fonctionKeys.lists(),
    queryFn: async () => {
      try {
        const res = await FonctionService.getAll(apiClient);
        // L'API /all retourne : { data: [...], message, status }
        const data = res.data?.data || res.data || res;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // En cas d'erreur, retourner les données mock
        console.log('API non disponible, utilisation des données mock pour fonctions');
        const { mockFonctions } = await import("@/lib/mock-data");
        return mockFonctions;
      }
    },
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useFonction(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: fonctionKeys.detail(code),
    queryFn: () => FonctionService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchFonctions(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: fonctionKeys.search(searchTerm),
    queryFn: () => FonctionService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateFonction() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (fonction: FonctionCreateRequest) => FonctionService.create(apiClient, fonction),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });
      toast.success("Fonction créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la fonction";
      toast.error(message);
    },
  });
}

export function useUpdateFonction() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, fonction }: { code: string; fonction: FonctionUpdateRequest }) =>
      FonctionService.update(apiClient, code, fonction),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fonctionKeys.detail(variables.code) });
      toast.success("Fonction mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la fonction";
      toast.error(message);
    },
  });
}

export function useDeleteFonction() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => FonctionService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fonctionKeys.lists() });
      toast.success("Fonction supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la fonction";
      toast.error(message);
    },
  });
}

