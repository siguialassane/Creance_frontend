import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AgenceBanqueService } from "@/services/agence-banque.service";
import { AgenceBanqueCreateRequest, AgenceBanqueUpdateRequest } from "@/types/agence-banque";
import { useApiClient } from "./useApiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Clés de requête
export const agenceBanqueKeys = {
  all: ["banque-agences"] as const,
  lists: () => [...agenceBanqueKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...agenceBanqueKeys.lists(), { filters }] as const,
  details: () => [...agenceBanqueKeys.all, "detail"] as const,
  detail: (id: string) => [...agenceBanqueKeys.details(), id] as const,
  search: (term: string) => [...agenceBanqueKeys.all, "search", term] as const,
  byBanque: (banqueCode: string) => [...agenceBanqueKeys.all, "by-banque", banqueCode] as const,
};

/**
 * Hook pour récupérer toutes les agences bancaires
 */
export function useAgencesBanque() {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.lists(),
    queryFn: () => AgenceBanqueService.getAll(apiClient).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken,
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
 * Hook pour récupérer une agence bancaire par son code
 */
export function useAgenceBanque(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.detail(code),
    queryFn: () => AgenceBanqueService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
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
 * Hook pour rechercher des agences bancaires
 */
export function useSearchAgencesBanque(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.search(searchTerm),
    queryFn: () => AgenceBanqueService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les recherches
  });
}

/**
 * Hook pour récupérer les agences d'une banque
 */
export function useAgencesByBanque(banqueCode: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSession();
  
  return useQuery({
    queryKey: agenceBanqueKeys.byBanque(banqueCode),
    queryFn: () => AgenceBanqueService.getByBanque(apiClient, banqueCode).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!banqueCode,
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
 * Hook pour créer une agence bancaire
 */
export function useCreateAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (agence: AgenceBanqueCreateRequest) => AgenceBanqueService.create(apiClient, agence),
    onSuccess: (data) => {
      // Invalider et refetch les listes d'agences bancaires
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      toast.success("Agence bancaire créée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création de l'agence bancaire";
      toast.error(message);
    },
  });
}

/**
 * Hook pour mettre à jour une agence bancaire
 */
export function useUpdateAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, agence }: { code: string; agence: AgenceBanqueUpdateRequest }) =>
      AgenceBanqueService.update(apiClient, code, agence),
    onSuccess: (data, variables) => {
      // Invalider les listes et le détail de l'agence bancaire
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.detail(variables.code) });
      toast.success("Agence bancaire mise à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'agence bancaire";
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une agence bancaire
 */
export function useDeleteAgenceBanque() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => AgenceBanqueService.delete(apiClient, code),
    onSuccess: (data, code) => {
      // Invalider les listes et le détail de l'agence bancaire
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agenceBanqueKeys.detail(code) });
      toast.success("Agence bancaire supprimée avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'agence bancaire";
      toast.error(message);
    },
  });
}
