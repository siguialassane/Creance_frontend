import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BanqueService } from "@/services/banque.service";
import { BanqueCreateRequest, BanqueUpdateRequest } from "@/types/banque";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Clés de requête
export const banqueKeys = {
  all: ["banques"] as const,
  lists: () => [...banqueKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...banqueKeys.lists(), { filters }] as const,
  details: () => [...banqueKeys.all, "detail"] as const,
  detail: (id: string) => [...banqueKeys.details(), id] as const,
  search: (term: string) => [...banqueKeys.all, "search", term] as const,
};

/**
 * Hook pour récupérer toutes les banques
 */
export function useBanques() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useMutation({
    mutationKey: banqueKeys.lists(),
    mutationFn: () => BanqueService.getAll(apiClient).then((res) => res.data),
    onMutate: () => {
      // Vérifier l'authentification avant la mutation
      if (status !== 'authenticated' || !(session as any)?.accessToken) {
        throw new Error('Non authentifié');
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook pour récupérer une banque par son code
 */
export function useBanque(code: string) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: banqueKeys.detail(code),
    queryFn: () => BanqueService.getByCode(apiClient, code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook pour rechercher des banques
 */
export function useSearchBanques(searchTerm: string) {
  const apiClient = useApiClient();
  
  return useQuery({
    queryKey: banqueKeys.search(searchTerm),
    queryFn: () => BanqueService.search(apiClient, searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
}

/**
 * Hook pour créer une banque
 */
export function useCreateBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (banque: BanqueCreateRequest) => BanqueService.create(apiClient, banque),
    onSuccess: (data) => {
      // Invalider et refetch les listes de banques
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      toast.success("Banque créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de la banque";
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour une banque
 */
export function useUpdateBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, banque }: { code: string; banque: BanqueUpdateRequest }) =>
      BanqueService.update(apiClient, code, banque),
    onSuccess: (data, variables) => {
      // Invalider les listes et le détail de la banque
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: banqueKeys.detail(variables.code) });
      toast.success("Banque mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la banque";
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une banque
 */
export function useDeleteBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => BanqueService.delete(apiClient, code),
    onSuccess: (data, code) => {
      // Invalider les listes et supprimer le détail de la banque du cache
      queryClient.invalidateQueries({ queryKey: banqueKeys.lists() });
      queryClient.removeQueries({ queryKey: banqueKeys.detail(code) });
      toast.success("Banque supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de la banque";
      toast.error(message);
    },
  });
}

/**
 * Hook pour précharger une banque
 */
export function usePrefetchBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return (code: string) => {
    queryClient.prefetchQuery({
      queryKey: banqueKeys.detail(code),
      queryFn: () => BanqueService.getByCode(apiClient, code),
      staleTime: 5 * 60 * 1000,
    });
  };
}
