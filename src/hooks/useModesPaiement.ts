import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModePaiementService } from "@/services/mode-paiement.service";
import { ModePaiementCreateRequest, ModePaiementUpdateRequest } from "@/types/mode-paiement";
import { useApiClient } from "./useApiClient";
import { useSessionWrapper } from "./useSessionWrapper";
import { toast } from "sonner";

export const modePaiementKeys = {
  all: ["modes-paiement"] as const,
  lists: () => [...modePaiementKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...modePaiementKeys.lists(), { filters }] as const,
  details: () => [...modePaiementKeys.all, "detail"] as const,
  detail: (id: string) => [...modePaiementKeys.details(), id] as const,
  search: (term: string) => [...modePaiementKeys.all, "search", term] as const,
};

export function useModesPaiement() {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: modePaiementKeys.lists(),
    queryFn: () => ModePaiementService.getAll(apiClient).then((res) => res.data),
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

export function useModePaiement(code: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: modePaiementKeys.detail(code),
    queryFn: () => ModePaiementService.getByCode(apiClient, code),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!code,
  });
}

export function useSearchModesPaiement(searchTerm: string) {
  const apiClient = useApiClient();
  const { data: session, status } = useSessionWrapper();

  return useQuery({
    queryKey: modePaiementKeys.search(searchTerm),
    queryFn: () => ModePaiementService.search(apiClient, searchTerm).then((res) => res.data),
    enabled: status === 'authenticated' && !!(session as any)?.accessToken && !!searchTerm,
    staleTime: 1000 * 60 * 2, // 2 minutes pour les recherches
  });
}

export function useCreateModePaiement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (mode: ModePaiementCreateRequest) => ModePaiementService.create(apiClient, mode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: modePaiementKeys.lists() });
      toast.success("Mode de paiement créé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la création du mode de paiement";
      toast.error(message);
    },
  });
}

export function useUpdateModePaiement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: ({ code, mode }: { code: string; mode: ModePaiementUpdateRequest }) =>
      ModePaiementService.update(apiClient, code, mode),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: modePaiementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: modePaiementKeys.detail(variables.code) });
      toast.success("Mode de paiement mis à jour avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du mode de paiement";
      toast.error(message);
    },
  });
}

export function useDeleteModePaiement() {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (code: string) => ModePaiementService.delete(apiClient, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modePaiementKeys.lists() });
      toast.success("Mode de paiement supprimé avec succès");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erreur lors de la suppression du mode de paiement";
      toast.error(message);
    },
  });
}

